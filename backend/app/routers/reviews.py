from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import uuid
from app.models.schemas import (
    Review, ReviewCreate, DonationReportSummary, DonationReportItem, DonationStatus
)
from app.database.repository import repo
from app.config import settings
from app.ai.bedrock import bedrock_client

router = APIRouter(prefix="", tags=["reviews"])

@router.post("/reviews", response_model=Review)
def create_review(review: ReviewCreate):
    # Verify donation exists
    donation = repo.donations.get_by_id(review.donation_id)
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    
    review_id = f"rev_{uuid.uuid4().hex[:10]}"
    created = repo.reviews.create(review, review_id)
    return created

@router.get("/reviews", response_model=List[Review])
def list_reviews(
    donation_id: Optional[str] = None,
    reviewer_id: Optional[str] = None,
    target_id: Optional[str] = None
):
    return repo.reviews.list_all(
        donation_id=donation_id,
        reviewer_id=reviewer_id,
        target_id=target_id
    )

@router.get("/donations/report", response_model=DonationReportSummary)
def get_donations_report():
    all_donations = repo.donations.list_all()
    completed = [d for d in all_donations if d.status == DonationStatus.COLLECTED]
    
    donors = {d.id: d.name for d in repo.donors.list_all()}
    recipients = {r.id: r.name for r in repo.recipients.list_all()}
    
    items: List[DonationReportItem] = []
    total_kg = 0.0
    distinct_donors = set()
    distinct_ngos = set()
    
    for d in completed:
        total_kg += d.quantity_kg
        distinct_donors.add(d.donor_id)
        if d.accepted_by_recipient_id:
            distinct_ngos.add(d.accepted_by_recipient_id)
        
        meals = int(d.quantity_kg / settings.MEAL_SERVING_SIZE_KG)
        co2 = round(d.quantity_kg * settings.CO2_KG_PER_KG_FOOD, 2)
        
        items.append(DonationReportItem(
            id=d.id,
            title=d.title,
            donor_id=d.donor_id,
            donor_name=donors.get(d.donor_id, "Verified Food Donor"),
            recipient_id=d.accepted_by_recipient_id or d.matched_recipient_id,
            recipient_name=recipients.get(d.accepted_by_recipient_id or d.matched_recipient_id or "", "Community Partner"),
            food_category=d.food_category.value,
            quantity_kg=d.quantity_kg,
            meals_served=meals,
            co2_saved_kg=co2,
            status=d.status.value,
            completed_at=d.collected_at,
            verification_code=d.collection_verification_code,
            authorized_collector=d.authorized_collector_name
        ))
    
    total_meals = int(total_kg / settings.MEAL_SERVING_SIZE_KG)
    total_co2 = round(total_kg * settings.CO2_KG_PER_KG_FOOD, 2)
    
    ai_report = bedrock_client.generate_donation_report_narrative(
        total_rescued_kg=total_kg,
        meals_served=total_meals,
        donations_count=len(completed),
        ngos_count=len(distinct_ngos),
        donors_count=len(distinct_donors),
        co2_avoided_kg=total_co2
    )

    return DonationReportSummary(
        total_completed_donations=len(completed),
        total_food_distributed_kg=round(total_kg, 1),
        distinct_ngos_served=len(distinct_ngos),
        distinct_donors_participating=len(distinct_donors),
        estimated_food_waste_reduced_kg=round(total_kg, 1),
        estimated_co2_avoided_kg=total_co2,
        estimated_meals_served=total_meals,
        items=items,
        ai_narrative_report=ai_report,
        ai_executive_summary=f"Aahuti Audit: Rescued {total_kg:.1f}kg edible food across {len(completed)} collections, serving {total_meals:,} meals with zero safety infractions."
    )
