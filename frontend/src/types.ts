export interface UserProfile {
  id: string;
  name: string;
  role: "donor" | "ngo" | "admin";
  entityName: string;
  entityType: string;
  address: string;
  phone: string;
  email: string;
  isVerified?: boolean;
}

export const DEMO_USERS: UserProfile[] = [
  {
    id: "donor_001",
    name: "Rajesh Sharma",
    role: "donor",
    entityName: "Grand Palace Banquet & Convention",
    entityType: "event_venue",
    address: "Road No 12, Banjara Hills, Hyderabad",
    phone: "+91 98765 43210",
    email: "banquets@grandpalace.org",
  },
  {
    id: "donor_002",
    name: "Kavita Rao",
    role: "donor",
    entityName: "Central University Dining Mess",
    entityType: "hostel",
    address: "Gachibowli Main Campus, Hyderabad",
    phone: "+91 98765 43211",
    email: "mess@university.edu",
  },
  {
    id: "rec_001",
    name: "Sister Mary",
    role: "ngo",
    entityName: "Asha Community Kitchen",
    entityType: "community_kitchen",
    address: "Secunderabad Clock Tower Enclave, Hyderabad",
    phone: "+91 98220 12345",
    email: "meals@ashakitchen.org",
    isVerified: true,
  },
  {
    id: "rec_002",
    name: "Dr. Farooq Khan",
    role: "ngo",
    entityName: "Hope Care Food Bank & Relief",
    entityType: "ngo",
    address: "Masab Tank Road, Hyderabad",
    phone: "+91 98220 54321",
    email: "help@hopecare.org",
    isVerified: true,
  },
  {
    id: "admin_001",
    name: "Priya Deshmukh (Dispatch Supervisor)",
    role: "admin",
    entityName: "Aahuti Operations Center",
    entityType: "operations",
    address: "HITEC City Phase 2, Hyderabad",
    phone: "+91 98220 99999",
    email: "ops@aahuti.org",
  }
];

export interface Review {
  id: string;
  donation_id: string;
  reviewer_id: string;
  reviewer_name: string;
  reviewer_role: "NGO_TO_DONOR" | "DONOR_TO_NGO";
  target_id: string;
  target_name: string;
  rating: number; // 1-5
  feedback: string;
  created_at: string;
}

export interface ReviewCreate {
  donation_id: string;
  reviewer_id: string;
  reviewer_name: string;
  reviewer_role: "NGO_TO_DONOR" | "DONOR_TO_NGO";
  target_id: string;
  target_name: string;
  rating: number;
  feedback: string;
}

export interface DonationReportItem {
  id: string;
  title: string;
  donor_id: string;
  donor_name: string;
  recipient_id?: string;
  recipient_name?: string;
  food_category: string;
  quantity_kg: number;
  meals_served: number;
  co2_saved_kg: number;
  status: string;
  completed_at?: string;
  verification_code?: string;
  authorized_collector?: string;
}

export interface DonationReportSummary {
  total_completed_donations: number;
  total_food_distributed_kg: number;
  distinct_ngos_served: number;
  distinct_donors_participating: number;
  estimated_food_waste_reduced_kg: number;
  estimated_co2_avoided_kg: number;
  estimated_meals_served: number;
  items: DonationReportItem[];
  ai_narrative_report?: string;
  ai_executive_summary?: string;
}

