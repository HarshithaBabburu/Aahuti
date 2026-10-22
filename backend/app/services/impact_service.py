from app.config import settings
from app.database.repository import repo
from app.models.schemas import DonationStatus, DecisionType, ImpactMetricsResponse

class ImpactService:
    def calculate_metrics(self) -> ImpactMetricsResponse:
        all_donations = repo.donations.list_all()
        all_audits = repo.audits.list_all()

        total_donations = len(all_donations)
        completed_pickups = 0
        active_offers_pending = 0
        rejected_donations = 0
        expired_donations = 0
        total_rescued_kg = 0.0

        for d in all_donations:
            if d.status == DonationStatus.COLLECTED:
                completed_pickups += 1
                total_rescued_kg += d.quantity_kg
            elif d.status in [DonationStatus.PROPOSED, DonationStatus.ACCEPTED, DonationStatus.PICKUP_SCHEDULED]:
                active_offers_pending += 1
            elif d.status == DonationStatus.REJECTED:
                rejected_donations += 1
            elif d.status == DonationStatus.EXPIRED:
                expired_donations += 1

        # Collection rate: collected / (collected + expired + rejected) or collected / total
        finished_cases = completed_pickups + expired_donations + rejected_donations
        collection_rate_pct = (completed_pickups / finished_cases * 100.0) if finished_cases > 0 else (100.0 if completed_pickups > 0 else 0.0)

        # Configurable serving size calculation (e.g. 0.40 kg / meal)
        # Note: ONLY collected donations contribute to meals served and CO2 saved!
        serving_size = settings.MEAL_SERVING_SIZE_KG
        estimated_meals = int(total_rescued_kg / serving_size) if serving_size > 0 else 0
        co2_saved = total_rescued_kg * settings.CO2_KG_PER_KG_FOOD

        human_reviews_pending = len([
            a for a in all_audits 
            if a.decision == DecisionType.HUMAN_REVIEW and not a.is_human_reviewed
        ])

        return ImpactMetricsResponse(
            total_donations=total_donations,
            completed_pickups=completed_pickups,
            active_offers_pending=active_offers_pending,
            human_reviews_pending=human_reviews_pending,
            rejected_donations=rejected_donations,
            expired_donations=expired_donations,
            total_rescued_kg=round(total_rescued_kg, 2),
            collection_rate_pct=round(collection_rate_pct, 1),
            estimated_meals_served=estimated_meals,
            serving_size_kg_assumption=serving_size,
            co2e_avoided_kg=round(co2_saved, 2)
        )

impact_service = ImpactService()
