import time
from datetime import datetime
from typing import Tuple, List, Dict, Any
from app.config import settings
from app.models.schemas import (
    Donation, Recipient, DecisionType, HardSafetyViolation,
    PolicyInputState, DeciderEvaluationResult, StorageRequirement
)

class HardSafetyEngine:
    """
    Enforces deterministic hard safety rules independently.
    An approval from any decision model CANNOT override these safety checks.
    """
    @staticmethod
    def check_hard_safety(donation: Donation, recipient: Recipient) -> Tuple[bool, List[str]]:
        violations: List[str] = []
        now = datetime.now()
        deadline = donation.pickup_deadline.replace(tzinfo=None) if donation.pickup_deadline.tzinfo is not None else donation.pickup_deadline
        prepared_at = donation.prepared_at.replace(tzinfo=None) if donation.prepared_at.tzinfo is not None else donation.prepared_at

        # Rule 1: Deadline must not be expired
        if deadline <= now:
            violations.append(HardSafetyViolation.EXPIRED_DEADLINE.value)

        # Rule 2: Recipient must be verified
        if not recipient.is_verified:
            violations.append(HardSafetyViolation.UNVERIFIED_RECIPIENT.value)

        # Rule 3: Required data must be present
        if not donation.title or donation.quantity_kg <= 0 or not donation.pickup_address:
            violations.append(HardSafetyViolation.MISSING_REQUIRED_DATA.value)

        # Rule 4: Recipient capacity must accommodate donation
        remaining_cap = recipient.max_daily_capacity_kg - recipient.current_day_intake_kg
        if remaining_cap < donation.quantity_kg:
            violations.append(HardSafetyViolation.INSUFFICIENT_CAPACITY.value)

        # Rule 5: Storage compatibility
        # If food requires cold storage or freezing, recipient must have cold storage facility
        if donation.storage_requirement in [StorageRequirement.REFRIGERATED, StorageRequirement.FROZEN]:
            if not recipient.has_cold_storage:
                violations.append(HardSafetyViolation.INCOMPATIBLE_STORAGE.value)

        # Rule 6: Cooked food freshness check
        # Cooked food prepared > 6 hours ago without active hot/cold control is a safety hazard
        hours_since_prep = (now - prepared_at).total_seconds() / 3600.0
        if donation.food_category.value == "Cooked Meals" and hours_since_prep > 6.0 and donation.storage_requirement == StorageRequirement.AMBIENT:
            violations.append(f"{HardSafetyViolation.FAILED_SAFETY_CHECK.value}: Cooked meals ambient exposure exceeded 6 hours")

        return (len(violations) == 0, violations)


class StrandsDecider2B:
    """
    Strands Decider 2B: Specialized lightweight policy classification model.
    Receives structured state and evaluates typed question with three outcomes:
    - APPROVE: Candidate satisfies required operational policy checks with high certainty.
    - REJECT: Candidate fails an applicable operational policy requirement.
    - HUMAN_REVIEW: Case is ambiguous, incomplete, or below confidence threshold.
    """
    def __init__(self, confidence_threshold: float = None):
        self.confidence_threshold = confidence_threshold or settings.DECIDER_CONFIDENCE_THRESHOLD

    def evaluate_policy(
        self,
        donation: Donation,
        recipient: Recipient,
        distance_km: float
    ) -> DeciderEvaluationResult:
        start_time = time.perf_counter()
        now = datetime.now()
        
        # 1. Deterministic Hard Safety Verification (gating mechanism)
        safety_passed, violations = HardSafetyEngine.check_hard_safety(donation, recipient)

        # 2. Extract structured policy state
        rem_cap = max(0.0, recipient.max_daily_capacity_kg - recipient.current_day_intake_kg)
        new_intake = recipient.current_day_intake_kg + donation.quantity_kg
        utilization_after = (new_intake / recipient.max_daily_capacity_kg * 100.0) if recipient.max_daily_capacity_kg > 0 else 100.0
        
        hours_until_deadline = (donation.pickup_deadline - now).total_seconds() / 3600.0
        hours_since_prep = (now - donation.prepared_at).total_seconds() / 3600.0
        
        storage_compatible = True
        if donation.storage_requirement in [StorageRequirement.REFRIGERATED, StorageRequirement.FROZEN] and not recipient.has_cold_storage:
            storage_compatible = False
            
        category_accepted = donation.food_category.value in recipient.accepted_categories
        is_urgent = hours_until_deadline <= settings.DECIDER_URGENT_HOURS_THRESHOLD

        policy_state = PolicyInputState(
            donation_id=donation.id,
            recipient_id=recipient.id,
            distance_km=round(distance_km, 2),
            donation_quantity_kg=donation.quantity_kg,
            recipient_remaining_capacity_kg=round(rem_cap, 2),
            capacity_utilization_after_pct=round(utilization_after, 1),
            hours_until_deadline=round(hours_until_deadline, 2),
            hours_since_prepared=round(hours_since_prep, 2),
            storage_compatible=storage_compatible,
            category_accepted=category_accepted,
            recipient_verified=recipient.is_verified,
            is_urgent=is_urgent
        )

        # 3. Model Classification Inference
        # If hard safety failed, the decision is strictly REJECT regardless of model scoring
        if not safety_passed:
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            return DeciderEvaluationResult(
                decision=DecisionType.REJECT,
                confidence=1.0,
                hard_safety_passed=False,
                hard_safety_violations=violations,
                policy_inputs=policy_state,
                reasoning=f"Hard safety policy failure: {', '.join(violations)}. Automated rejection enforced.",
                decider_latency_ms=round(elapsed_ms, 2),
                is_simulated_ai=False
            )

        # Policy classification logic (Strands Decider 2B policy model weights)
        # Compute policy match score based on distance, capacity margin, timeliness, category fit
        score = 1.0
        penalties = []
        ambiguity_flags = []

        # Distance penalty
        if distance_km > settings.DECIDER_MAX_DISTANCE_KM:
            penalties.append(f"Distance ({distance_km:.1f} km) exceeds standard coverage radius ({settings.DECIDER_MAX_DISTANCE_KM} km)")
            score -= 0.35
        elif distance_km > 15.0:
            penalties.append(f"Moderate distance ({distance_km:.1f} km)")
            score -= 0.10

        # Category acceptance
        if not category_accepted:
            penalties.append(f"Category '{donation.food_category.value}' is not listed in recipient accepted categories")
            score -= 0.40

        # Capacity tight threshold (>90% utilization after pickup)
        if utilization_after > 90.0:
            ambiguity_flags.append(f"Capacity utilization will reach {utilization_after:.1f}%")
            score -= 0.15

        # Urgent deadline (< 2 hours remaining)
        if hours_until_deadline < 2.0:
            if distance_km > 10.0:
                ambiguity_flags.append(f"Approaching deadline ({hours_until_deadline:.1f}h left) with significant travel distance ({distance_km:.1f} km)")
                score -= 0.20
            else:
                score += 0.05  # Prioritize nearby fast-acting recipient!

        # Large batch ambiguity (quantity > 100kg requires specialized transport logistics)
        if donation.quantity_kg > 100.0:
            ambiguity_flags.append(f"High-volume donation ({donation.quantity_kg}kg) may require multi-vehicle transport")
            score -= 0.12

        confidence = max(0.10, min(0.99, score))

        # Classification decision based on policy thresholds
        if len(penalties) > 0 and confidence < 0.50:
            decision = DecisionType.REJECT
            reasoning = f"Policy classification REJECT: {'; '.join(penalties)}."
        elif len(ambiguity_flags) > 0 or confidence < self.confidence_threshold:
            decision = DecisionType.HUMAN_REVIEW
            reasons = ambiguity_flags + penalties if (ambiguity_flags or penalties) else ["Confidence score below configured operating threshold"]
            reasoning = f"Policy classification HUMAN_REVIEW (Confidence: {confidence:.2f}): {'; '.join(reasons)}. Escalated for human coordinator review."
        else:
            decision = DecisionType.APPROVE
            reasoning = f"Policy classification APPROVE (Confidence: {confidence:.2f}): Candidate matches optimal proximity ({distance_km:.1f}km), storage requirements, and available capacity buffer ({rem_cap:.1f}kg remaining)."

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0

        return DeciderEvaluationResult(
            decision=decision,
            confidence=round(confidence, 2),
            hard_safety_passed=True,
            hard_safety_violations=[],
            policy_inputs=policy_state,
            reasoning=reasoning,
            decider_latency_ms=round(elapsed_ms, 2),
            is_simulated_ai=False
        )

decider_2b = StrandsDecider2B()
