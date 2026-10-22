from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import (
    DecisionAuditLog, DecisionType, HumanReviewActionRequest, DonationStatus
)
from app.database.repository import repo

router = APIRouter(prefix="/decisions", tags=["Decisions & Audit Logs"])

@router.get("/audit-logs", response_model=List[DecisionAuditLog])
def list_audit_logs(
    decision: Optional[DecisionType] = Query(None),
    pending_human_review: bool = Query(False)
):
    return repo.audits.list_all(decision=decision, pending_human_review=pending_human_review)

@router.get("/human-review-queue", response_model=List[DecisionAuditLog])
def get_human_review_queue():
    return repo.audits.list_all(pending_human_review=True)

@router.post("/human-review", response_model=DecisionAuditLog)
def submit_human_review(action: HumanReviewActionRequest):
    audit = repo.audits.get_by_id(action.audit_id)
    if not audit:
        raise HTTPException(status_code=404, detail="Audit log entry not found")

    # If hard safety had failed, even a human reviewer cannot approve an unsafe violation!
    if not audit.hard_safety_passed and action.override_decision == DecisionType.APPROVE:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot override hard safety violations: {', '.join(audit.hard_safety_violations)}. Safety rules are non-negotiable."
        )

    updated_log = repo.audits.update_human_review(
        log_id=action.audit_id,
        override_decision=action.override_decision,
        reviewer_name=action.reviewer_name,
        notes=action.review_notes
    )

    # If human approved the match, set donation matched_recipient_id
    if action.override_decision == DecisionType.APPROVE:
        repo.donations.update_status(
            donation_id=audit.donation_id,
            status=DonationStatus.PROPOSED,
            matched_recipient_id=audit.recipient_id
        )

    return updated_log
