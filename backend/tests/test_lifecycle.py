from datetime import datetime, timedelta
import pytest
from app.database.connection import init_db
from app.database.repository import repo
from app.services.donation_service import donation_service
from app.models.schemas import (
    DonationCreate, FoodCategory, StorageRequirement,
    DonationStatus, DonationAcceptRequest, PickupConfirmationRequest
)

from app.database.seed_data import seed_database

@pytest.fixture(autouse=True)
def setup_db():
    seed_database()

def test_full_donation_lifecycle():
    now = datetime.now()
    # 1. Create Donation
    donation, match_res = donation_service.create_donation(
        DonationCreate(
            donor_id="donor_001",
            title="Lifecycle Test Batch",
            description="Testing state transitions",
            food_category=FoodCategory.COOKED_MEALS,
            quantity_kg=20.0,
            storage_requirement=StorageRequirement.AMBIENT,
            prepared_at=now - timedelta(hours=1),
            pickup_deadline=now + timedelta(hours=3),
            pickup_address="Banjara Hills",
            latitude=17.41,
            longitude=78.43
        )
    )
    assert donation.status == DonationStatus.PROPOSED
    assert donation.collection_verification_code is not None

    # 2. Accept Donation
    accepted = donation_service.accept_donation(
        donation_id=donation.id,
        request=DonationAcceptRequest(recipient_id="rec_001")
    )
    assert accepted.status == DonationStatus.PICKUP_SCHEDULED
    assert accepted.accepted_by_recipient_id == "rec_001"

    # 3. Fail pickup with incorrect verification code
    with pytest.raises(ValueError, match="Invalid collection verification code"):
        donation_service.confirm_pickup(
            donation_id=donation.id,
            request=PickupConfirmationRequest(
                verification_code="WRONG-CODE",
                authorized_collector_name="Volunteer"
            )
        )

    # 4. Succeed pickup with valid verification code
    collected = donation_service.confirm_pickup(
        donation_id=donation.id,
        request=PickupConfirmationRequest(
            verification_code=donation.collection_verification_code,
            authorized_collector_name="Volunteer Ravi"
        )
    )
    assert collected.status == DonationStatus.COLLECTED
    assert collected.authorized_collector_name == "Volunteer Ravi"
