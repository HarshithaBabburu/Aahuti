from datetime import datetime, timedelta
import pytest
from app.database.connection import init_db
from app.database.repository import repo
from app.services.impact_service import impact_service
from app.config import settings
from app.models.schemas import (
    DonationCreate, FoodCategory, StorageRequirement, DonationStatus
)

import uuid

@pytest.fixture(autouse=True)
def setup_db():
    init_db()

def test_impact_metrics_exclude_pending_offers():
    now = datetime.now()
    col_id = f"test_col_{uuid.uuid4().hex[:6]}"
    prop_id = f"test_prop_{uuid.uuid4().hex[:6]}"
    
    # Create one COLLECTED donation of 40kg
    d_collected = repo.donations.create(
        DonationCreate(
            donor_id="donor_001", title="Rescued Food", description="Done",
            food_category=FoodCategory.COOKED_MEALS, quantity_kg=40.0,
            storage_requirement=StorageRequirement.AMBIENT,
            prepared_at=now - timedelta(hours=3), pickup_deadline=now - timedelta(hours=1),
            pickup_address="Banjara Hills", latitude=17.41, longitude=78.43
        ),
        donation_id=col_id, verification_code="FB-1111"
    )
    repo.donations.update_status(col_id, DonationStatus.COLLECTED, authorized_collector_name="Staff")

    # Create one PROPOSED donation of 50kg (MUST NOT be counted in rescued kg or meals!)
    d_proposed = repo.donations.create(
        DonationCreate(
            donor_id="donor_001", title="Pending Offer", description="Still pending",
            food_category=FoodCategory.COOKED_MEALS, quantity_kg=50.0,
            storage_requirement=StorageRequirement.AMBIENT,
            prepared_at=now - timedelta(hours=1), pickup_deadline=now + timedelta(hours=2),
            pickup_address="Banjara Hills", latitude=17.41, longitude=78.43
        ),
        donation_id=prop_id, verification_code="FB-2222"
    )

    metrics = impact_service.calculate_metrics()
    
    # Verify that total rescued kg equals only the collected amount (plus any seeded collected)
    # And estimated meals uses serving size 0.40 kg
    assert metrics.active_offers_pending >= 1
    assert metrics.serving_size_kg_assumption == settings.MEAL_SERVING_SIZE_KG
    # Meals = total_rescued_kg / 0.40
    expected_meals = int(metrics.total_rescued_kg / settings.MEAL_SERVING_SIZE_KG)
    assert metrics.estimated_meals_served == expected_meals
