import uuid
import random
from datetime import datetime
from typing import Optional, List, Tuple
from app.database.repository import repo
from app.models.schemas import (
    Donation, DonationCreate, DonationStatus,
    DonationAcceptRequest, PickupConfirmationRequest,
    ProposedMatchesResponse
)
from app.ai.agent import strands_agent

class DonationService:
    def create_donation(self, data: DonationCreate) -> Tuple[Donation, ProposedMatchesResponse]:
        # Generate clean ID and 6-char verification code for physical pickup
        donation_id = f"don_{uuid.uuid4().hex[:8]}"
        verification_code = f"FB-{random.randint(1000, 9999)}"
        
        # 1. Store donation in repository
        donation = repo.donations.create(
            donation=data,
            donation_id=donation_id,
            verification_code=verification_code
        )

        # 2. Trigger Strands AI Matching & Decider 2B Classification Workflow
        match_response = strands_agent.coordinate_donation_matching(donation)
        
        # Refresh donation state
        updated_donation = repo.donations.get_by_id(donation_id) or donation
        return updated_donation, match_response

    def accept_donation(self, donation_id: str, request: DonationAcceptRequest) -> Donation:
        donation = repo.donations.get_by_id(donation_id)
        if not donation:
            raise ValueError(f"Donation {donation_id} not found")
        
        if donation.status in [DonationStatus.COLLECTED, DonationStatus.EXPIRED, DonationStatus.REJECTED]:
            raise ValueError(f"Cannot accept donation in status {donation.status.value}")

        recipient = repo.recipients.get_by_id(request.recipient_id)
        if not recipient:
            raise ValueError(f"Recipient {request.recipient_id} not found")

        # Update donation status to ACCEPTED / PICKUP_SCHEDULED
        updated = repo.donations.update_status(
            donation_id=donation_id,
            status=DonationStatus.PICKUP_SCHEDULED,
            matched_recipient_id=request.recipient_id,
            accepted_by_recipient_id=request.recipient_id
        )

        # Update recipient current day intake
        repo.recipients.update_intake(request.recipient_id, donation.quantity_kg)
        return updated

    def confirm_pickup(self, donation_id: str, request: PickupConfirmationRequest) -> Donation:
        donation = repo.donations.get_by_id(donation_id)
        if not donation:
            raise ValueError(f"Donation {donation_id} not found")

        # Verification code check (e.g. FB-8942)
        if request.verification_code.strip().upper() != donation.collection_verification_code.strip().upper():
            raise ValueError("Invalid collection verification code. Physical custody cannot be verified.")

        # Mark as COLLECTED
        updated = repo.donations.update_status(
            donation_id=donation_id,
            status=DonationStatus.COLLECTED,
            authorized_collector_name=request.authorized_collector_name
        )
        return updated

    def check_and_mark_expired(self) -> int:
        """
        Scans donations and marks uncollected donations past pickup deadline as EXPIRED.
        """
        now = datetime.now()
        all_donations = repo.donations.list_all()
        expired_count = 0
        for d in all_donations:
            if d.status in [DonationStatus.PROPOSED, DonationStatus.ACCEPTED, DonationStatus.PICKUP_SCHEDULED]:
                deadline = d.pickup_deadline.replace(tzinfo=None) if d.pickup_deadline.tzinfo is not None else d.pickup_deadline
                if deadline <= now:
                    repo.donations.update_status(d.id, DonationStatus.EXPIRED)
                    expired_count += 1
        return expired_count

donation_service = DonationService()
