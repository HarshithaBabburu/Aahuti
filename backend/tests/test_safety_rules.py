from datetime import datetime, timedelta
import pytest
from app.models.schemas import (
    Donation, Recipient, FoodCategory, StorageRequirement,
    DonationStatus, HardSafetyViolation
)
from app.ai.decider import HardSafetyEngine, decider_2b

@pytest.fixture
def base_donation():
    now = datetime.now()
    return Donation(
        id="test_don_1",
        donor_id="d1",
        title="Test Vegetarian Pulao",
        description="Freshly cooked food",
        food_category=FoodCategory.COOKED_MEALS,
        quantity_kg=30.0,
        storage_requirement=StorageRequirement.AMBIENT,
        prepared_at=now - timedelta(hours=1),
        pickup_deadline=now + timedelta(hours=3),
        pickup_address="Banjara Hills, Hyderabad",
        latitude=17.41,
        longitude=78.43,
        status=DonationStatus.PROPOSED,
        created_at=now
    )

@pytest.fixture
def base_recipient():
    now = datetime.now()
    return Recipient(
        id="test_rec_1",
        name="Verified Care Kitchen",
        recipient_type="community_kitchen",
        is_verified=True,
        latitude=17.42,
        longitude=78.44,
        address="Secunderabad",
        contact_person="Staff",
        phone="9876543210",
        email="kitchen@test.org",
        max_daily_capacity_kg=200.0,
        current_day_intake_kg=50.0,
        has_cold_storage=True,
        accepted_categories=[FoodCategory.COOKED_MEALS.value],
        operational_hours="8:00 - 20:00",
        created_at=now
    )

def test_hard_safety_passes_on_valid_match(base_donation, base_recipient):
    passed, violations = HardSafetyEngine.check_hard_safety(base_donation, base_recipient)
    assert passed is True
    assert len(violations) == 0

def test_hard_safety_blocks_expired_deadline(base_donation, base_recipient):
    base_donation.pickup_deadline = datetime.now() - timedelta(minutes=10)
    passed, violations = HardSafetyEngine.check_hard_safety(base_donation, base_recipient)
    assert passed is False
    assert HardSafetyViolation.EXPIRED_DEADLINE.value in violations
    
    # Decider 2B MUST reject this regardless of other parameters
    result = decider_2b.evaluate_policy(base_donation, base_recipient, distance_km=1.0)
    assert result.decision.value == "REJECT"
    assert result.hard_safety_passed is False

def test_hard_safety_blocks_unverified_recipient(base_donation, base_recipient):
    base_recipient.is_verified = False
    passed, violations = HardSafetyEngine.check_hard_safety(base_donation, base_recipient)
    assert passed is False
    assert HardSafetyViolation.UNVERIFIED_RECIPIENT.value in violations

    result = decider_2b.evaluate_policy(base_donation, base_recipient, distance_km=1.0)
    assert result.decision.value == "REJECT"
    assert result.hard_safety_passed is False

def test_hard_safety_blocks_insufficient_capacity(base_donation, base_recipient):
    base_donation.quantity_kg = 180.0  # Recipient only has 150kg remaining (200 - 50)
    passed, violations = HardSafetyEngine.check_hard_safety(base_donation, base_recipient)
    assert passed is False
    assert HardSafetyViolation.INSUFFICIENT_CAPACITY.value in violations

def test_hard_safety_blocks_missing_cold_storage(base_donation, base_recipient):
    base_donation.storage_requirement = StorageRequirement.REFRIGERATED
    base_recipient.has_cold_storage = False
    passed, violations = HardSafetyEngine.check_hard_safety(base_donation, base_recipient)
    assert passed is False
    assert HardSafetyViolation.INCOMPATIBLE_STORAGE.value in violations
