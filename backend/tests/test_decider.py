from datetime import datetime, timedelta
import pytest
from app.models.schemas import (
    Donation, Recipient, FoodCategory, StorageRequirement,
    DonationStatus, DecisionType
)
from app.ai.decider import decider_2b

@pytest.fixture
def valid_donation():
    now = datetime.now()
    return Donation(
        id="d_test",
        donor_id="donor_1",
        title="50 Servings Biryani",
        description="Freshly cooked banquet meal",
        food_category=FoodCategory.COOKED_MEALS,
        quantity_kg=25.0,
        storage_requirement=StorageRequirement.AMBIENT,
        prepared_at=now - timedelta(hours=1),
        pickup_deadline=now + timedelta(hours=4),
        pickup_address="Banjara Hills",
        latitude=17.41,
        longitude=78.43,
        status=DonationStatus.PROPOSED,
        created_at=now
    )

@pytest.fixture
def valid_recipient():
    now = datetime.now()
    return Recipient(
        id="r_test",
        name="Asha Kitchen",
        recipient_type="community_kitchen",
        is_verified=True,
        latitude=17.42,
        longitude=78.44,
        address="Secunderabad",
        contact_person="Staff",
        phone="1234567890",
        email="info@asha.org",
        max_daily_capacity_kg=200.0,
        current_day_intake_kg=20.0,
        has_cold_storage=True,
        accepted_categories=[FoodCategory.COOKED_MEALS.value],
        operational_hours="8-22",
        created_at=now
    )

def test_decider_approves_ideal_candidate(valid_donation, valid_recipient):
    # Proximity 2.5km, plenty of capacity, safety checks pass
    res = decider_2b.evaluate_policy(valid_donation, valid_recipient, distance_km=2.5)
    assert res.decision == DecisionType.APPROVE
    assert res.confidence >= 0.75
    assert res.hard_safety_passed is True

def test_decider_escalates_to_human_review_for_tight_capacity(valid_donation, valid_recipient):
    # If adding this donation pushes utilization over 90%
    valid_recipient.current_day_intake_kg = 170.0 # 170 + 25 = 195 / 200 = 97.5%
    res = decider_2b.evaluate_policy(valid_donation, valid_recipient, distance_km=3.0)
    assert res.decision == DecisionType.HUMAN_REVIEW
    assert "Capacity utilization will reach" in res.reasoning

def test_decider_escalates_to_human_review_for_high_volume(valid_donation, valid_recipient):
    valid_donation.quantity_kg = 120.0 # > 100kg
    valid_recipient.max_daily_capacity_kg = 500.0
    res = decider_2b.evaluate_policy(valid_donation, valid_recipient, distance_km=4.0)
    assert res.decision == DecisionType.HUMAN_REVIEW
    assert "High-volume donation" in res.reasoning
