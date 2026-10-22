from fastapi import APIRouter
from app.models.schemas import ImpactMetricsResponse
from app.services.impact_service import impact_service
from app.ai.bedrock import bedrock_client

router = APIRouter(prefix="/impact", tags=["Impact Analytics"])

@router.get("", response_model=ImpactMetricsResponse)
def get_impact_metrics():
    return impact_service.calculate_metrics()

@router.get("/summary-report")
def get_impact_summary_report():
    metrics = impact_service.calculate_metrics()
    narrative = bedrock_client.generate_impact_narrative(
        total_rescued_kg=metrics.total_rescued_kg,
        meals_served=metrics.estimated_meals_served,
        collection_rate_pct=metrics.collection_rate_pct,
        co2_saved_kg=metrics.co2e_avoided_kg
    )
    return {
        "metrics": metrics,
        "ai_narrative_report": narrative,
        "serving_size_basis": f"Configured at {metrics.serving_size_kg_assumption * 1000:.0f}g ({metrics.serving_size_kg_assumption}kg) per meal equivalent"
    }
