from datetime import datetime
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class FoodCategory(str, Enum):
    COOKED_MEALS = "Cooked Meals"
    BAKERY_BREADS = "Bakery & Breads"
    FRESH_PRODUCE = "Fresh Produce"
    DAIRY_PACKAGED = "Dairy & Packaged"
    RAW_INGREDIENTS = "Raw Ingredients"
    DESSERTS_BEVERAGES = "Desserts & Beverages"

class StorageRequirement(str, Enum):
    AMBIENT = "Ambient"
    REFRIGERATED = "Refrigerated"
    FROZEN = "Frozen"
    HEATED_INSULATED = "Heated/Insulated"

class DonationStatus(str, Enum):
    DRAFT = "DRAFT"
    PROPOSED = "PROPOSED"
    ACCEPTED = "ACCEPTED"
    PICKUP_SCHEDULED = "PICKUP_SCHEDULED"
    COLLECTED = "COLLECTED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"

class DecisionType(str, Enum):
    APPROVE = "APPROVE"
    REJECT = "REJECT"
    HUMAN_REVIEW = "HUMAN_REVIEW"
    REROUTE_SECONDARY = "REROUTE_SECONDARY"
    REQUEST_MISSING_INFO = "REQUEST_MISSING_INFO"
    URGENT_EXPRESS_DISPATCH = "URGENT_EXPRESS_DISPATCH"

class HardSafetyViolation(str, Enum):
    EXPIRED_DEADLINE = "EXPIRED_DEADLINE"
    MISSING_REQUIRED_DATA = "MISSING_REQUIRED_DATA"
    UNVERIFIED_RECIPIENT = "UNVERIFIED_RECIPIENT"
    FAILED_SAFETY_CHECK = "FAILED_SAFETY_CHECK"
    INSUFFICIENT_CAPACITY = "INSUFFICIENT_CAPACITY"
    INCOMPATIBLE_STORAGE = "INCOMPATIBLE_STORAGE"
    DISTANCE_EXCEEDED = "DISTANCE_EXCEEDED"

# --- Donor Models ---
class DonorBase(BaseModel):
    name: str = Field(..., examples=["Grand Palace Banquet Hall"])
    donor_type: str = Field(..., examples=["event_venue"])  # restaurant, hostel, event_venue, cafeteria
    contact_person: str = Field(..., examples=["Rajesh Sharma"])
    phone: str = Field(..., examples=["+91 98765 43210"])
    email: str = Field(..., examples=["rajesh@grandpalace.org"])
    address: str = Field(..., examples=["Road No 12, Banjara Hills, Hyderabad"])
    latitude: float = Field(..., examples=[17.4156])
    longitude: float = Field(..., examples=[78.4357])

class DonorCreate(DonorBase):
    pass

class Donor(DonorBase):
    id: str
    created_at: datetime

# --- Recipient Models ---
class RecipientBase(BaseModel):
    name: str = Field(..., examples=["Asha Community Kitchen"])
    recipient_type: str = Field(..., examples=["community_kitchen"])  # ngo, community_kitchen, shelter
    is_verified: bool = Field(default=True)
    latitude: float = Field(..., examples=[17.4289])
    longitude: float = Field(..., examples=[78.4482])
    address: str = Field(..., examples=["Near Jubilee Bus Station, Secunderabad"])
    contact_person: str = Field(..., examples=["Sister Mary"])
    phone: str = Field(..., examples=["+91 98220 12345"])
    email: str = Field(..., examples=["contact@ashakitchen.org"])
    max_daily_capacity_kg: float = Field(..., examples=[250.0])
    current_day_intake_kg: float = Field(default=0.0, examples=[45.0])
    has_cold_storage: bool = Field(default=True)
    accepted_categories: List[str] = Field(default_factory=lambda: [FoodCategory.COOKED_MEALS.value, FoodCategory.BAKERY_BREADS.value])
    operational_hours: str = Field(default="08:00 - 22:00")

class RecipientCreate(RecipientBase):
    pass

class Recipient(RecipientBase):
    id: str
    remaining_capacity_kg: float = 0.0
    created_at: datetime

# --- Donation Models ---
class DonationBase(BaseModel):
    donor_id: str
    title: str = Field(..., examples=["50 Portions Veg Biryani & Paneer Curry"])
    description: str = Field(..., examples=["Surplus fresh banquet food prepared 2 hours ago. Kept in food-grade steel containers."])
    food_category: FoodCategory
    quantity_kg: float = Field(..., gt=0, examples=[35.0])
    storage_requirement: StorageRequirement = Field(default=StorageRequirement.AMBIENT)
    prepared_at: datetime
    pickup_deadline: datetime
    pickup_address: str
    latitude: float
    longitude: float
    special_instructions: Optional[str] = None

class DonationCreate(DonationBase):
    pass

class Donation(DonationBase):
    id: str
    status: DonationStatus = DonationStatus.PROPOSED
    created_at: datetime
    matched_recipient_id: Optional[str] = None
    accepted_by_recipient_id: Optional[str] = None
    accepted_at: Optional[datetime] = None
    collected_at: Optional[datetime] = None
    collection_verification_code: Optional[str] = None
    authorized_collector_name: Optional[str] = None

# --- AI Decider & Matching ---
class PolicyInputState(BaseModel):
    donation_id: str
    recipient_id: str
    distance_km: float
    donation_quantity_kg: float
    recipient_remaining_capacity_kg: float
    capacity_utilization_after_pct: float
    hours_until_deadline: float
    hours_since_prepared: float
    storage_compatible: bool
    category_accepted: bool
    recipient_verified: bool
    is_urgent: bool

class DeciderEvaluationResult(BaseModel):
    decision: DecisionType
    confidence: float
    hard_safety_passed: bool
    hard_safety_violations: List[str]
    policy_inputs: PolicyInputState
    reasoning: str
    decider_latency_ms: float
    bedrock_explanation: Optional[str] = None
    bedrock_latency_ms: float = 0.0
    is_simulated_ai: bool = False

class MatchProposal(BaseModel):
    recipient: Recipient
    evaluation: DeciderEvaluationResult

class ProposedMatchesResponse(BaseModel):
    donation: Donation
    proposals: List[MatchProposal]
    recommended_recipient_id: Optional[str] = None
    adaptation_event: Optional[str] = None
    adapted_action: Optional[str] = None
    adaptation_explanation: Optional[str] = None
    missing_fields: Optional[List[str]] = None
    declined_recipient_ids: Optional[List[str]] = None

# --- Decision Audit Log ---
class DecisionAuditLog(BaseModel):
    id: str
    donation_id: str
    recipient_id: str
    decision: DecisionType
    confidence: float
    hard_safety_passed: bool
    hard_safety_violations: List[str]
    policy_inputs: Dict[str, Any]
    reasoning: str
    bedrock_explanation: Optional[str] = None
    decider_latency_ms: float
    bedrock_latency_ms: float
    is_human_reviewed: bool = False
    human_reviewer: Optional[str] = None
    human_override_decision: Optional[DecisionType] = None
    human_notes: Optional[str] = None
    timestamp: datetime
    is_simulated_ai: bool = False

class HumanReviewActionRequest(BaseModel):
    audit_id: str
    override_decision: DecisionType  # APPROVE or REJECT
    reviewer_name: str
    review_notes: str

class DonationAcceptRequest(BaseModel):
    recipient_id: str
    estimated_arrival_minutes: int = 30
    authorized_driver_name: str = "Self / Volunteer"

class PickupConfirmationRequest(BaseModel):
    verification_code: str
    authorized_collector_name: str
    actual_quantity_collected_kg: Optional[float] = None
    collector_signature_notes: Optional[str] = None

# --- Impact Metrics ---
class ImpactMetricsResponse(BaseModel):
    total_donations: int
    completed_pickups: int
    active_offers_pending: int
    human_reviews_pending: int
    rejected_donations: int
    expired_donations: int
    total_rescued_kg: float
    collection_rate_pct: float
    estimated_meals_served: int
    serving_size_kg_assumption: float
    co2e_avoided_kg: float
    fictional_demo_disclaimer: str = "Demo data is labeled as fictional. Impact metrics use a standard serving size assumption (0.40kg/meal) and strictly count completed collections."

# --- Evaluation & Benchmark Models ---
class ScenarioProofResult(BaseModel):
    id: str
    category: str  # "APPROPRIATE_ACTION", "SAFETY_ENFORCEMENT", "FAILURE_HANDLING", "SUCCESSFUL_OUTCOME"
    name: str
    operational_condition: str
    expected_action: str
    chosen_action: str
    safety_rule_respected: bool
    adaptation_handled: bool
    outcome_status: str  # "PASS" or "FAIL"
    decider_latency_ms: float
    explanation: str

class EvaluationMetrics(BaseModel):
    total_test_cases: int
    passed_test_cases: int = 0
    failed_test_cases: int = 0
    decider_accuracy_pct: float
    hard_safety_enforcement_pct: float
    failure_handling_recovery_pct: float = 100.0
    avg_decider_latency_ms: float
    avg_bedrock_latency_ms: float
    baseline_heuristic_accuracy_pct: float
    model_name: str = "Strands Decider 2B (Policy Classifier)"
    generative_model_name: str = "Amazon Bedrock (Claude 3 Haiku)"
    summary: str
    timestamp: str = ""
    scenario_results: List[ScenarioProofResult] = Field(default_factory=list)

# --- Reviews & Feedback Models ---
class ReviewRole(str, Enum):
    NGO_TO_DONOR = "NGO_TO_DONOR"
    DONOR_TO_NGO = "DONOR_TO_NGO"

class ReviewCreate(BaseModel):
    donation_id: str
    reviewer_id: str
    reviewer_name: str
    reviewer_role: ReviewRole
    target_id: str
    target_name: str
    rating: int = Field(..., ge=1, le=5)
    feedback: str = Field(..., min_length=3)

class Review(ReviewCreate):
    id: str
    created_at: datetime

# --- Donation Reports ---
class DonationReportItem(BaseModel):
    id: str
    title: str
    donor_id: str
    donor_name: str
    recipient_id: Optional[str]
    recipient_name: Optional[str]
    food_category: str
    quantity_kg: float
    meals_served: int
    co2_saved_kg: float
    status: str
    completed_at: Optional[datetime]
    verification_code: Optional[str]
    authorized_collector: Optional[str]

class DonationReportSummary(BaseModel):
    total_completed_donations: int
    total_food_distributed_kg: float
    distinct_ngos_served: int
    distinct_donors_participating: int
    estimated_food_waste_reduced_kg: float
    estimated_co2_avoided_kg: float
    estimated_meals_served: int
    items: List[DonationReportItem]
    ai_narrative_report: Optional[str] = None
    ai_executive_summary: Optional[str] = None

