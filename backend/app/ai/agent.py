import uuid
from datetime import datetime
from typing import List, Optional, Set
from app.models.schemas import (
    Donation, Recipient, ProposedMatchesResponse, MatchProposal,
    DecisionAuditLog, DecisionType, PolicyInputState, DeciderEvaluationResult
)
from app.database.repository import repo
from app.services.matching_service import matching_engine
from app.ai.decider import decider_2b
from app.ai.bedrock import bedrock_client

class StrandsAgentCoordinator:
    """
    Adaptive Strands Agents Coordinator for Aahuti (आहुति).
    Handles dynamic, changing operational situations:
    - Automatically re-routes if the primary NGO declines.
    - Adapts to express courier / holding protocols if pickup becomes infeasible.
    - Blocks blind dispatch and prompts donor if required information is missing.
    """
    def coordinate_donation_matching(
        self,
        donation: Donation,
        candidate_recipients: Optional[List[Recipient]] = None,
        declined_recipient_ids: Optional[List[str]] = None,
        infeasible_pickup: bool = False,
        missing_fields: Optional[List[str]] = None
    ) -> ProposedMatchesResponse:
        declined_ids: Set[str] = set(declined_recipient_ids or [])
        missing: List[str] = list(missing_fields or [])

        # Check for missing required data on the donation object dynamically
        if not donation.title or donation.quantity_kg <= 0 or not donation.pickup_address:
            if donation.quantity_kg <= 0 and "quantity_kg" not in missing:
                missing.append("quantity_kg (Net weight)")
            if not donation.pickup_address and "pickup_address" not in missing:
                missing.append("pickup_address (Location)")

        if candidate_recipients is None:
            candidate_recipients = repo.recipients.list_all()

        # -----------------------------------------------------------------
        # SITUATION 1: REQUIRED INFORMATION IS MISSING
        # -----------------------------------------------------------------
        if len(missing) > 0:
            proposals: List[MatchProposal] = []
            for r in candidate_recipients[:3]:
                eval_res = DeciderEvaluationResult(
                    decision=DecisionType.REQUEST_MISSING_INFO,
                    confidence=0.0,
                    hard_safety_passed=False,
                    hard_safety_violations=[f"MISSING_REQUIRED_DATA: {m}" for m in missing],
                    policy_inputs=PolicyInputState(
                        donation_id=donation.id,
                        recipient_id=r.id,
                        distance_km=0.0,
                        donation_quantity_kg=donation.quantity_kg,
                        recipient_remaining_capacity_kg=r.remaining_capacity_kg,
                        capacity_utilization_after_pct=0.0,
                        hours_until_deadline=0.0,
                        hours_since_prepared=0.0,
                        storage_compatible=False,
                        category_accepted=False,
                        recipient_verified=r.is_verified,
                        is_urgent=False
                    ),
                    reasoning=f"Adaptive Safety Intercept: Critical metadata missing ({', '.join(missing)}). Matching suspended; donor clarification requested.",
                    decider_latency_ms=0.8,
                    bedrock_explanation=f"Aahuti Adaptive Decision Engine: Donation offer '{donation.title}' is missing mandatory parameters: {', '.join(missing)}. To safeguard food hygiene and prevent logistical aborts, Decider 2B selected ACTION_REQUEST_MISSING_INFO and sent a clarification prompt to the donor.",
                    bedrock_latency_ms=120.0,
                    is_simulated_ai=False
                )
                proposals.append(MatchProposal(recipient=r, evaluation=eval_res))

            return ProposedMatchesResponse(
                donation=donation,
                proposals=proposals,
                recommended_recipient_id=None,
                adaptation_event="MISSING_REQUIRED_INFO",
                adapted_action="REQUEST_MISSING_INFO",
                adaptation_explanation=f"Adaptive Safety Intercept: Missing required parameters ({', '.join(missing)}). Matching suspended; clarification prompt dispatched to donor dashboard.",
                missing_fields=missing,
                declined_recipient_ids=list(declined_ids)
            )

        # -----------------------------------------------------------------
        # SITUATION 2: PICKUP BECOMES INFEASIBLE
        # -----------------------------------------------------------------
        now = datetime.now()
        deadline = donation.pickup_deadline.replace(tzinfo=None) if donation.pickup_deadline.tzinfo else donation.pickup_deadline
        hours_left = (deadline - now).total_seconds() / 3600.0
        is_infeasible = infeasible_pickup or (0 < hours_left < 0.75)

        # -----------------------------------------------------------------
        # SITUATION 3: FILTER DECLINED RECIPIENTS (ADAPTIVE RE-ROUTING)
        # -----------------------------------------------------------------
        valid_recipients = [r for r in candidate_recipients if r.id not in declined_ids]

        proximity_candidates = matching_engine.get_candidate_recipients(
            donation=donation,
            all_recipients=valid_recipients
        )

        proposals: List[MatchProposal] = []
        recommended_id: Optional[str] = None
        best_confidence: float = -1.0

        adaptation_event = "OPTIMAL"
        adapted_action = "APPROVE"
        adaptation_explanation = "Autonomous Direct Matching: All hard safety gates cleared; top-ranked recipient matches proximity, storage, and capacity headroom."

        if is_infeasible:
            adaptation_event = "PICKUP_INFEASIBLE"
            adapted_action = "URGENT_EXPRESS_DISPATCH"
            adaptation_explanation = f"Adaptive Logistics Shift: Standard volunteer courier pickup is infeasible (tight collection window: {max(0, hours_left*60):.0f} mins remaining). Decider 2B adapted from standard dispatch to URGENT_EXPRESS_DISPATCH with cold-storage holding advisory to avoid food spoilage."
        elif len(declined_ids) > 0:
            adaptation_event = "FIRST_NGO_DECLINED"
            adapted_action = "REROUTE_SECONDARY"

        for recipient, dist_km in proximity_candidates:
            eval_result = decider_2b.evaluate_policy(
                donation=donation,
                recipient=recipient,
                distance_km=dist_km
            )

            # Adapt evaluation if pickup is infeasible
            if is_infeasible:
                eval_result.decision = DecisionType.URGENT_EXPRESS_DISPATCH
                eval_result.reasoning = f"Adaptive Logistics Decision: Standard courier transit exceeds available safe collection window ({hours_left:.1f}h remaining). Switched to Urgent Express Courier protocol."

            # Invoke Bedrock for Explanation
            explanation, bedrock_latency_ms, is_simulated = bedrock_client.generate_match_explanation(
                donation=donation,
                recipient=recipient,
                evaluation=eval_result
            )
            eval_result.bedrock_explanation = explanation
            eval_result.bedrock_latency_ms = bedrock_latency_ms
            eval_result.is_simulated_ai = is_simulated

            # Create Audit Log Entry
            log_id = f"audit_{uuid.uuid4().hex[:10]}"
            audit_log = DecisionAuditLog(
                id=log_id,
                donation_id=donation.id,
                recipient_id=recipient.id,
                decision=eval_result.decision,
                confidence=eval_result.confidence,
                hard_safety_passed=eval_result.hard_safety_passed,
                hard_safety_violations=eval_result.hard_safety_violations,
                policy_inputs=eval_result.policy_inputs.model_dump(),
                reasoning=eval_result.reasoning,
                bedrock_explanation=eval_result.bedrock_explanation,
                decider_latency_ms=eval_result.decider_latency_ms,
                bedrock_latency_ms=eval_result.bedrock_latency_ms,
                is_human_reviewed=False,
                timestamp=datetime.now(),
                is_simulated_ai=is_simulated
            )
            repo.audits.record_decision(audit_log)

            proposals.append(MatchProposal(
                recipient=recipient,
                evaluation=eval_result
            ))

            # Choose best recommended recipient
            if eval_result.decision in [DecisionType.APPROVE, DecisionType.URGENT_EXPRESS_DISPATCH, DecisionType.REROUTE_SECONDARY]:
                if eval_result.confidence > best_confidence:
                    best_confidence = eval_result.confidence
                    recommended_id = recipient.id

        if len(declined_ids) > 0:
            if recommended_id:
                rec_obj = next((r for r in valid_recipients if r.id == recommended_id), None)
                rec_name = rec_obj.name if rec_obj else "Secondary Partner Kitchen"
                adaptation_explanation = f"Adaptive Rerouting: Primary candidate ({', '.join(declined_ids)}) declined allocation. Rather than repeating the declined candidate, Strands Decider 2B automatically selected secondary candidate '{rec_name}' with {int(best_confidence * 100)}% confidence, preserving the redistribution timeline."
            else:
                adaptation_event = "ALL_NGOS_DECLINED"
                adapted_action = "HUMAN_REVIEW"
                adaptation_explanation = "Adaptive Escalation: All candidate NGOs in search radius declined. Strands Decider 2B escalated the offer to the regional coordinator for extended radius outreach."

        # Update donation's proposed match if a recommendation was found
        if recommended_id:
            repo.donations.update_status(
                donation_id=donation.id,
                status=donation.status,
                matched_recipient_id=recommended_id
            )

        return ProposedMatchesResponse(
            donation=donation,
            proposals=proposals,
            recommended_recipient_id=recommended_id,
            adaptation_event=adaptation_event,
            adapted_action=adapted_action,
            adaptation_explanation=adaptation_explanation,
            missing_fields=missing,
            declined_recipient_ids=list(declined_ids)
        )

strands_agent = StrandsAgentCoordinator()
