from datetime import datetime, timedelta
import pytest
from app.models.schemas import (
    Donation, Recipient, FoodCategory, StorageRequirement,
    DonationStatus, DecisionType
)
from app.ai.agent import strands_agent

@pytest.fixture
def adaptive_donation():
    now = datetime.now()
    return Donation(
        id="d_adapt_test",
        donor_id="donor_001",
        title="50 Servings Vegetable Dum Biryani",
        description="Hot banquet surplus in thermal containers",
        food_category=FoodCategory.COOKED_MEALS,
        quantity_kg=35.0,
        storage_requirement=StorageRequirement.AMBIENT,
        prepared_at=now - timedelta(hours=1),
        pickup_deadline=now + timedelta(hours=4),
        pickup_address="Road No 12, Banjara Hills, Hyderabad",
        latitude=17.4156,
        longitude=78.4357,
        status=DonationStatus.PROPOSED,
        created_at=now
    )

@pytest.fixture
def recipient_network():
    now = datetime.now()
    return [
        Recipient(
            id="rec_001",
            name="Asha Community Kitchen",
            recipient_type="community_kitchen",
            is_verified=True,
            latitude=17.4180,
            longitude=78.4370,
            address="Road No 10, Banjara Hills",
            contact_person="Sister Mary",
            phone="1234567890",
            email="asha@demo.org",
            max_daily_capacity_kg=250.0,
            current_day_intake_kg=40.0,
            has_cold_storage=True,
            accepted_categories=[FoodCategory.COOKED_MEALS.value],
            operational_hours="8:00 - 22:00",
            created_at=now
        ),
        Recipient(
            id="rec_002",
            name="Hope Care Food Bank",
            recipient_type="ngo",
            is_verified=True,
            latitude=17.4580,
            longitude=78.4800,
            address="Secunderabad North",
            contact_person="Dr. Farooq",
            phone="1234567891",
            email="hopecare@demo.org",
            max_daily_capacity_kg=150.0,
            current_day_intake_kg=30.0,
            has_cold_storage=True,
            accepted_categories=[FoodCategory.COOKED_MEALS.value],
            operational_hours="8:00 - 20:00",
            created_at=now
        )
    ]

def test_adaptive_agent_handles_ngo_decline(adaptive_donation, recipient_network):
    # 1. Normal matching selects primary candidate rec_001
    initial_match = strands_agent.coordinate_donation_matching(
        donation=adaptive_donation,
        candidate_recipients=recipient_network
    )
    assert initial_match.recommended_recipient_id == "rec_001"
    assert initial_match.adapted_action == "APPROVE"

    # 2. When rec_001 declines, agent DOES NOT blindly repeat rec_001!
    # It adapts, re-routes to secondary recipient rec_002, and sets action to REROUTE_SECONDARY
    adapted_match = strands_agent.coordinate_donation_matching(
        donation=adaptive_donation,
        candidate_recipients=recipient_network,
        declined_recipient_ids=["rec_001"]
    )
    assert adapted_match.recommended_recipient_id == "rec_002"
    assert adapted_match.adapted_action == "REROUTE_SECONDARY"
    assert adapted_match.adaptation_event == "FIRST_NGO_DECLINED"
    assert "declined allocation" in adapted_match.adaptation_explanation
    assert "Hope Care Food Bank" in adapted_match.adaptation_explanation

def test_adaptive_agent_handles_infeasible_pickup(adaptive_donation, recipient_network):
    # When pickup becomes infeasible (deadline compressed or courier unavailable)
    match_res = strands_agent.coordinate_donation_matching(
        donation=adaptive_donation,
        candidate_recipients=recipient_network,
        infeasible_pickup=True
    )
    assert match_res.adaptation_event == "PICKUP_INFEASIBLE"
    assert match_res.adapted_action == "URGENT_EXPRESS_DISPATCH"
    assert "infeasible" in match_res.adaptation_explanation.lower()

def test_adaptive_agent_handles_missing_information(adaptive_donation, recipient_network):
    # When required information is missing (e.g. storage requirement or quantity)
    match_res = strands_agent.coordinate_donation_matching(
        donation=adaptive_donation,
        candidate_recipients=recipient_network,
        missing_fields=["storage_requirement", "quantity_kg"]
    )
    assert match_res.adaptation_event == "MISSING_REQUIRED_INFO"
    assert match_res.adapted_action == "REQUEST_MISSING_INFO"
    assert match_res.recommended_recipient_id is None
    assert "clarification" in match_res.adaptation_explanation.lower()
