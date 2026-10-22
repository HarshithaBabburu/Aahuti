import pytest
from app.routers.evaluation import run_evaluation_benchmark
from app.models.schemas import EvaluationMetrics

def test_evaluation_benchmark_suite():
    metrics: EvaluationMetrics = run_evaluation_benchmark()
    
    # Verify all evaluation requirements from Section 11
    assert metrics.total_test_cases >= 7
    assert metrics.hard_safety_enforcement_pct == 100.0
    assert metrics.decider_accuracy_pct >= 90.0
    # Decider 2B must beat baseline naive distance heuristic
    assert metrics.decider_accuracy_pct > metrics.baseline_heuristic_accuracy_pct
    # Latencies must be reported separately and be positive
    assert metrics.avg_decider_latency_ms > 0
    assert metrics.avg_bedrock_latency_ms > 0
    assert "Strands Decider 2B" in metrics.summary
