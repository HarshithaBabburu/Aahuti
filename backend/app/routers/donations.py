from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import (
    Donation, DonationCreate, DonationStatus,
    DonationAcceptRequest, PickupConfirmationRequest,
    ProposedMatchesResponse
)
from app.database.repository import repo
from app.services.donation_service import donation_service
from app.ai.agent import strands_agent

router = APIRouter(prefix="/donations", tags=["Donations"])

@router.get("", response_model=List[Donation])
def list_donations(status: Optional[DonationStatus] = Query(None)):
    donation_service.check_and_mark_expired()
    return repo.donations.list_all(status=status)

@router.get("/{donation_id}", response_model=Donation)
def get_donation(donation_id: str):
    donation = repo.donations.get_by_id(donation_id)
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    return donation

@router.post("", response_model=Donation)
def create_donation(data: DonationCreate):
    donation, _ = donation_service.create_donation(data)
    return donation

@router.get("/{donation_id}/matches", response_model=ProposedMatchesResponse)
def get_donation_matches(
    donation_id: str,
    declined_ids: Optional[str] = Query(None, description="Comma-separated IDs of recipients that declined"),
    infeasible_pickup: bool = Query(False, description="Simulate transit/deadline infeasibility"),
    missing_fields: Optional[str] = Query(None, description="Comma-separated list of missing fields")
):
    donation = repo.donations.get_by_id(donation_id)
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
        
    declined_list = [x.strip() for x in declined_ids.split(",") if x.strip()] if declined_ids else None
    missing_list = [x.strip() for x in missing_fields.split(",") if x.strip()] if missing_fields else None
    
    return strands_agent.coordinate_donation_matching(
        donation=donation,
        declined_recipient_ids=declined_list,
        infeasible_pickup=infeasible_pickup,
        missing_fields=missing_list
    )

@router.post("/{donation_id}/decline", response_model=ProposedMatchesResponse)
def decline_donation_match(
    donation_id: str,
    recipient_id: str = Query(..., description="ID of the recipient declining the allocation")
):
    donation = repo.donations.get_by_id(donation_id)
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
        
    return strands_agent.coordinate_donation_matching(
        donation=donation,
        declined_recipient_ids=[recipient_id]
    )

@router.post("/{donation_id}/accept", response_model=Donation)
def accept_donation(donation_id: str, request: DonationAcceptRequest):
    try:
        return donation_service.accept_donation(donation_id, request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{donation_id}/confirm-pickup", response_model=Donation)
def confirm_pickup(donation_id: str, request: PickupConfirmationRequest):
    try:
        return donation_service.confirm_pickup(donation_id, request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
