import {
  MOCK_DONORS, MOCK_RECIPIENTS, MOCK_DONATIONS,
  MOCK_IMPACT, MOCK_IMPACT_SUMMARY,
  MOCK_AUDIT_LOGS, MOCK_BENCHMARK, getMockMatches,
  MOCK_REVIEWS, MOCK_DONATION_REPORT
} from "./mockData";
import type { Review, ReviewCreate, DonationReportItem, DonationReportSummary } from "./types";
export type { Review, ReviewCreate, DonationReportItem, DonationReportSummary };


const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? "/api" : "http://localhost:8000/api");

// ── Types ────────────────────────────────────────────────────────────────

export interface ImpactMetrics {
  total_donations: number;
  completed_pickups: number;
  active_offers_pending: number;
  human_reviews_pending: number;
  rejected_donations: number;
  expired_donations: number;
  total_rescued_kg: number;
  collection_rate_pct: number;
  estimated_meals_served: number;
  serving_size_kg_assumption: number;
  co2e_avoided_kg: number;
  fictional_demo_disclaimer: string;
}

export interface ImpactSummaryResponse {
  metrics: ImpactMetrics;
  ai_narrative_report: string;
  serving_size_basis: string;
}

export interface Donor {
  id: string;
  name: string;
  donor_type: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface Recipient {
  id: string;
  name: string;
  recipient_type: string;
  is_verified: boolean;
  latitude: number;
  longitude: number;
  address: string;
  contact_person: string;
  phone: string;
  email: string;
  max_daily_capacity_kg: number;
  current_day_intake_kg: number;
  remaining_capacity_kg: number;
  has_cold_storage: boolean;
  accepted_categories: string[];
  operational_hours: string;
  created_at: string;
}

export interface Donation {
  id: string;
  donor_id: string;
  title: string;
  description: string;
  food_category: string;
  quantity_kg: number;
  storage_requirement: string;
  prepared_at: string;
  pickup_deadline: string;
  pickup_address: string;
  latitude: number;
  longitude: number;
  special_instructions?: string;
  status: string;
  created_at: string;
  matched_recipient_id?: string;
  matched_at?: string;
  accepted_by_recipient_id?: string;
  accepted_at?: string;
  pickup_scheduled_at?: string;
  collected_at?: string;
  collection_verification_code?: string;
  authorized_collector_name?: string;
  pickup_verified?: boolean;
}

export interface PolicyInputs {
  donation_id: string;
  recipient_id: string;
  distance_km: number;
  donation_quantity_kg: number;
  recipient_remaining_capacity_kg: number;
  capacity_utilization_after_pct: number;
  hours_until_deadline: number;
  hours_since_prepared: number;
  storage_compatible: boolean;
  category_accepted: boolean;
  recipient_verified: boolean;
  is_urgent: boolean;
}

export interface DeciderEvaluation {
  decision: "APPROVE" | "REJECT" | "HUMAN_REVIEW";
  confidence: number;
  hard_safety_passed: boolean;
  hard_safety_violations: string[];
  policy_inputs: PolicyInputs;
  reasoning: string;
  decider_latency_ms: number;
  bedrock_explanation?: string;
  bedrock_latency_ms: number;
  is_simulated_ai: boolean;
}

export interface MatchProposal {
  recipient: Recipient;
  evaluation: DeciderEvaluation;
}

export interface ProposedMatchesResponse {
  donation: Donation;
  proposals: MatchProposal[];
  recommended_recipient_id?: string;
  adaptation_event?: string;
  adapted_action?: string;
  adaptation_explanation?: string;
  missing_fields?: string[];
  declined_recipient_ids?: string[];
}

export interface DecisionAuditLog {
  id: string;
  donation_id: string;
  recipient_id: string;
  decision: "APPROVE" | "REJECT" | "HUMAN_REVIEW";
  confidence: number;
  hard_safety_passed: boolean;
  hard_safety_violations: string[];
  policy_inputs: any;
  reasoning: string;
  bedrock_explanation?: string;
  decider_latency_ms: number;
  bedrock_latency_ms: number;
  is_human_reviewed: boolean;
  human_reviewer?: string;
  human_override_decision?: "APPROVE" | "REJECT";
  human_notes?: string;
  timestamp: string;
  is_simulated_ai: boolean;
}

export interface ScenarioProofResult {
  id: string;
  category: "APPROPRIATE_ACTION" | "SAFETY_ENFORCEMENT" | "FAILURE_HANDLING" | "SUCCESSFUL_OUTCOME" | string;
  name: string;
  operational_condition: string;
  expected_action: string;
  chosen_action: string;
  safety_rule_respected: boolean;
  adaptation_handled: boolean;
  outcome_status: "PASS" | "FAIL";
  decider_latency_ms: number;
  explanation: string;
}

export interface EvaluationMetrics {
  total_test_cases: number;
  passed_test_cases: number;
  failed_test_cases: number;
  decider_accuracy_pct: number;
  hard_safety_enforcement_pct: number;
  failure_handling_recovery_pct: number;
  avg_decider_latency_ms: number;
  avg_bedrock_latency_ms: number;
  baseline_heuristic_accuracy_pct: number;
  model_name: string;
  generative_model_name: string;
  summary: string;
  timestamp?: string;
  scenario_results?: ScenarioProofResult[];
}


// ── Helper: try fetch, fall back to mock ────────────────────────────────

async function tryFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return fallback;
    return res.json() as Promise<T>;
  } catch {
    return fallback;
  }
}

async function tryPost<T>(url: string, body: unknown, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as any).detail || "Request failed");
    }
    return res.json() as Promise<T>;
  } catch (e) {
    // If offline, return fallback silently
    if (e instanceof TypeError || (e as Error).name === "TimeoutError") return fallback;
    throw e;
  }
}

// In-memory state for demo mode (simulates mutations without a backend)
let _donations = [...MOCK_DONATIONS];

// ── API ──────────────────────────────────────────────────────────────────

export const api = {
  async getImpact(): Promise<ImpactMetrics> {
    return tryFetch(`${API_BASE}/impact`, MOCK_IMPACT);
  },

  async getImpactSummary(): Promise<ImpactSummaryResponse> {
    return tryFetch(`${API_BASE}/impact/summary-report`, MOCK_IMPACT_SUMMARY);
  },

  async getDonations(_status?: string): Promise<Donation[]> {
    const url = _status
      ? `${API_BASE}/donations?status=${_status}`
      : `${API_BASE}/donations`;
    const result = await tryFetch<Donation[]>(url, _donations);
    // Keep local copy in sync if we got real data
    if (result !== _donations) _donations = result;
    return _donations;
  },

  async createDonation(data: any): Promise<Donation> {
    const newDon: Donation = {
      id: `don_${Date.now()}`,
      donor_id: data.donor_id || "donor_001",
      title: data.title,
      description: data.description || "",
      food_category: data.food_category || "Cooked Meals",
      quantity_kg: Number(data.quantity_kg),
      storage_requirement: data.storage_requirement || "Ambient",
      prepared_at: data.prepared_at || new Date().toISOString(),
      pickup_deadline: data.pickup_deadline || new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      pickup_address: data.pickup_address || "Hyderabad",
      latitude: data.latitude || 17.4156,
      longitude: data.longitude || 78.4357,
      special_instructions: data.special_instructions,
      status: "PROPOSED",
      created_at: new Date().toISOString(),
      collection_verification_code: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    const result = await tryPost<Donation>(
      `${API_BASE}/donations`,
      data,
      newDon
    );
    // If backend didn't respond, use local mock
    _donations = [result, ..._donations];
    return result;
  },

  async getDonationMatches(
    donationId: string,
    declinedIds?: string[],
    infeasiblePickup?: boolean,
    missingFields?: string[]
  ): Promise<ProposedMatchesResponse> {
    const params = new URLSearchParams();
    if (declinedIds && declinedIds.length > 0) params.append("declined_ids", declinedIds.join(","));
    if (infeasiblePickup) params.append("infeasible_pickup", "true");
    if (missingFields && missingFields.length > 0) params.append("missing_fields", missingFields.join(","));
    const qs = params.toString() ? `?${params.toString()}` : "";
    return tryFetch(
      `${API_BASE}/donations/${donationId}/matches${qs}`,
      getMockMatches(donationId, declinedIds, infeasiblePickup, missingFields)
    );
  },

  async declineDonationMatch(donationId: string, recipientId: string): Promise<ProposedMatchesResponse> {
    return tryPost<ProposedMatchesResponse>(
      `${API_BASE}/donations/${donationId}/decline?recipient_id=${recipientId}`,
      {},
      getMockMatches(donationId, [recipientId])
    );
  },

  async acceptDonation(donationId: string, recipientId: string): Promise<Donation> {
    const fallback = _donations.find((d) => d.id === donationId);
    if (!fallback) throw new Error("Donation not found");
    const updated: Donation = {
      ...fallback,
      status: "PICKUP_SCHEDULED",
      matched_recipient_id: recipientId,
      accepted_by_recipient_id: recipientId,
      accepted_at: new Date().toISOString(),
    };
    const result = await tryPost<Donation>(
      `${API_BASE}/donations/${donationId}/accept`,
      { recipient_id: recipientId },
      updated
    );
    _donations = _donations.map((d) => (d.id === donationId ? result : d));
    return result;
  },

  async confirmPickup(donationId: string, code: string, collectorName: string): Promise<Donation> {
    const fallback = _donations.find((d) => d.id === donationId);
    if (!fallback) throw new Error("Donation not found");
    // Demo: accept any code that starts with "FB-"
    if (!code.toUpperCase().startsWith("FB-") && code !== fallback.collection_verification_code) {
      throw new Error("Invalid verification code. Use the code shown on the listing card.");
    }
    const updated: Donation = {
      ...fallback,
      status: "COLLECTED",
      authorized_collector_name: collectorName,
      collected_at: new Date().toISOString(),
    };
    const result = await tryPost<Donation>(
      `${API_BASE}/donations/${donationId}/confirm-pickup`,
      { verification_code: code, authorized_collector_name: collectorName },
      updated
    );
    _donations = _donations.map((d) => (d.id === donationId ? result : d));
    return result;
  },

  async getRecipients(): Promise<Recipient[]> {
    return tryFetch(`${API_BASE}/recipients`, MOCK_RECIPIENTS);
  },

  async getDonors(): Promise<Donor[]> {
    return tryFetch(`${API_BASE}/donors`, MOCK_DONORS);
  },

  async getAuditLogs(_decision?: string): Promise<DecisionAuditLog[]> {
    return tryFetch(`${API_BASE}/decisions/audit-logs`, MOCK_AUDIT_LOGS);
  },

  async getHumanReviewQueue(): Promise<DecisionAuditLog[]> {
    return tryFetch(`${API_BASE}/decisions/human-review-queue`, []);
  },

  async submitHumanReview(
    auditId: string,
    override: "APPROVE" | "REJECT",
    reviewer: string,
    notes: string
  ): Promise<DecisionAuditLog> {
    const log = MOCK_AUDIT_LOGS.find((l) => l.id === auditId) || MOCK_AUDIT_LOGS[0];
    const fallback: DecisionAuditLog = {
      ...log,
      is_human_reviewed: true,
      human_reviewer: reviewer,
      human_override_decision: override,
      human_notes: notes,
    };
    return tryPost(
      `${API_BASE}/decisions/human-review`,
      { audit_id: auditId, override_decision: override, reviewer_name: reviewer, review_notes: notes },
      fallback
    );
  },

  async runBenchmark(): Promise<EvaluationMetrics> {
    return tryFetch(`${API_BASE}/evaluation/benchmark`, MOCK_BENCHMARK);
  },

  async runScenarioBenchmark(): Promise<EvaluationMetrics> {
    return tryPost(`${API_BASE}/evaluation/run-scenarios`, {}, MOCK_BENCHMARK);
  },

  async getReviews(donationId?: string, reviewerId?: string, targetId?: string): Promise<Review[]> {
    const params = new URLSearchParams();
    if (donationId) params.append("donation_id", donationId);
    if (reviewerId) params.append("reviewer_id", reviewerId);
    if (targetId) params.append("target_id", targetId);
    const qs = params.toString() ? `?${params.toString()}` : "";
    return tryFetch(`${API_BASE}/reviews${qs}`, MOCK_REVIEWS);
  },

  async createReview(data: ReviewCreate): Promise<Review> {
    const fallback: Review = {
      id: `rev_${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
    };
    return tryPost(`${API_BASE}/reviews`, data, fallback);
  },

  async getDonationReport(): Promise<DonationReportSummary> {
    return tryFetch(`${API_BASE}/donations/report`, MOCK_DONATION_REPORT);
  },
};

