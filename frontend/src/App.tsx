import React, { useState, useEffect } from "react";
import { api } from "./api";
import type {
  ImpactMetrics, ImpactSummaryResponse, Donation, Recipient, Donor
} from "./api";
import { DEMO_USERS } from "./types";
import type { UserProfile } from "./types";

// Components
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AuthModal } from "./components/AuthModal";
import { DonationDetailsModal } from "./components/DonationDetailsModal";
import { DonateFoodModal } from "./components/DonateFoodModal";
import { CustodyHandoverModal } from "./components/CustodyHandoverModal";

// Pages
import { HomePage } from "./components/pages/HomePage";
import { DiscoveryPage } from "./components/pages/DiscoveryPage";
import { DonorDashboardPage } from "./components/pages/DonorDashboardPage";
import { NgoDashboardPage } from "./components/pages/NgoDashboardPage";
import { AiMatchingPage } from "./components/pages/AiMatchingPage";
import { ImpactDashboardPage } from "./components/pages/ImpactDashboardPage";
import { ReviewsAndReportsPage } from "./components/pages/ReviewsAndReportsPage";

import { CheckCircle2, XCircle, Sparkles } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    "home" | "discover" | "ai-match" | "impact" | "donor-dashboard" | "ngo-dashboard" | "reviews"
  >("home");

  // Core Data
  const [impact, setImpact] = useState<ImpactMetrics | null>(null);
  const [impactReport, setImpactReport] = useState<ImpactSummaryResponse | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // User session
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]);

  // Modals & Selectors
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [custodyModalDonationId, setCustodyModalDonationId] = useState<string | null>(null);
  const [aiMatchDonationId, setAiMatchDonationId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Fetch initial data
  const loadData = async () => {
    try {
      const [imp, impRep, dons, recs, donsList] = await Promise.all([
        api.getImpact(),
        api.getImpactSummary(),
        api.getDonations(),
        api.getRecipients(),
        api.getDonors(),
      ]);
      setImpact(imp);
      setImpactReport(impRep);
      setDonations(dons);
      setRecipients(recs);
      setDonors(donsList);
    } catch (err) {
      console.error("Data load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Actions
  const handleCreateDonation = async (data: any) => {
    try {
      const created = await api.createDonation(data);
      showToast(`Surplus food registered! ID: ${created.id}. Handover code: ${created.collection_verification_code}`);
      await loadData();
      setAiMatchDonationId(created.id);
      setCurrentTab("ai-match");
    } catch (err: any) {
      showToast(err.message || "Failed to register donation", "error");
    }
  };

  const handleAcceptDonation = async (donationId: string) => {
    try {
      // Find matching recipient ID or use current user if NGO
      const recId = currentUser.role === "ngo" ? currentUser.id : "rec_001";
      await api.acceptDonation(donationId, recId);
      showToast("Donation accepted! Pickup logistics assigned.");
      await loadData();
      if (selectedDonation && selectedDonation.id === donationId) {
        const updated = donations.find((d) => d.id === donationId);
        if (updated) setSelectedDonation({ ...updated, status: "PICKUP_SCHEDULED" });
      }
    } catch (err: any) {
      showToast(err.message || "Could not accept donation", "error");
    }
  };

  const handleConfirmPickup = async (donationId: string, code: string, collectorName: string) => {
    try {
      await api.confirmPickup(donationId, code, collectorName);
      showToast(`Pickup verified! Rescued food handed over to ${collectorName}. Impact logged.`);
      await loadData();
      if (selectedDonation && selectedDonation.id === donationId) {
        const updated = donations.find((d) => d.id === donationId);
        if (updated) setSelectedDonation({ ...updated, status: "COLLECTED" });
      }
    } catch (err: any) {
      showToast(err.message || "Verification code failed", "error");
      throw err;
    }
  };

  const getCustodyTargetDonation = () => {
    if (!custodyModalDonationId) return undefined;
    return donations.find((d) => d.id === custodyModalDonationId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3EEE4] text-[#171914] selection:bg-[#D8CDBA] selection:text-[#171914] overflow-x-hidden">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 max-w-md animate-fade-in">
          <div className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 ${
            toastMessage.type === "success"
              ? "bg-[#74785B] text-white border-[#5F634A]"
              : "bg-[#B33A32] text-white border-[#8C2821]"
          }`}>
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-[#E8E2D5] shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-200 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-semibold">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDonateModal={() => setDonateModalOpen(true)}
        onLogout={() => {
          showToast("Signed out successfully. Click 'Sign In' anytime to access your portal.");
          setAuthModalOpen(true);
        }}
      />

      {/* Main Pages */}
      <main className="flex-1">
        {currentTab === "home" && (
          <HomePage
            donations={donations}
            donors={donors}
            recipients={recipients}
            impact={impact}
            onSelectTab={setCurrentTab}
            onOpenDonateModal={() => setDonateModalOpen(true)}
            onSelectDonation={(d) => setSelectedDonation(d)}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setCurrentTab("discover");
            }}
          />
        )}

        {currentTab === "discover" && (
          <DiscoveryPage
            donations={donations}
            donors={donors}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectDonation={(d) => setSelectedDonation(d)}
            onOpenAiMatch={(dId) => {
              setAiMatchDonationId(dId);
              setCurrentTab("ai-match");
            }}
          />
        )}

        {currentTab === "donor-dashboard" && (
          <DonorDashboardPage
            donations={donations}
            donors={donors}
            currentUser={currentUser}
            onCreateDonation={handleCreateDonation}
            onSelectDonation={(d) => setSelectedDonation(d)}
            onOpenAiMatch={(dId) => {
              setAiMatchDonationId(dId);
              setCurrentTab("ai-match");
            }}
          />
        )}

        {currentTab === "ngo-dashboard" && (
          <NgoDashboardPage
            donations={donations}
            recipients={recipients}
            currentUser={currentUser}
            onAcceptDonation={handleAcceptDonation}
            onSelectDonation={(d) => setSelectedDonation(d)}
            onOpenConfirmPickup={(dId) => setCustodyModalDonationId(dId)}
            onOpenAiMatch={(dId) => {
              setAiMatchDonationId(dId);
              setCurrentTab("ai-match");
            }}
          />
        )}

        {currentTab === "ai-match" && (
          <AiMatchingPage
            donations={donations}
            initialDonationId={aiMatchDonationId}
            currentUser={currentUser}
            onAcceptMatch={async (dId, rId) => {
              await api.acceptDonation(dId, rId);
              showToast("Offer accepted! Scheduled for pickup.");
              await loadData();
            }}
            onSelectDonation={(d) => setSelectedDonation(d)}
          />
        )}

        {currentTab === "impact" && (
          <ImpactDashboardPage
            impact={impact}
            impactReport={impactReport}
            donations={donations}
            donors={donors}
            onRefresh={loadData}
          />
        )}

        {currentTab === "reviews" && (
          <ReviewsAndReportsPage
            currentUser={currentUser}
            donations={donations}
            donors={donors}
            recipients={recipients}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={setCurrentTab} />

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={(u) => {
          setCurrentUser(u);
          showToast(`Switched active profile to ${u.entityName} (${u.role.toUpperCase()})`);
        }}
      />

      <DonateFoodModal
        isOpen={donateModalOpen}
        onClose={() => setDonateModalOpen(false)}
        donors={donors}
        currentUser={currentUser}
        onSubmitDonation={handleCreateDonation}
      />

      <DonationDetailsModal
        donation={selectedDonation}
        donor={donors.find((d) => d.id === selectedDonation?.donor_id)}
        onClose={() => setSelectedDonation(null)}
        currentUser={currentUser}
        onAcceptDonation={handleAcceptDonation}
        onOpenAiMatch={(dId) => {
          setAiMatchDonationId(dId);
          setCurrentTab("ai-match");
        }}
        onOpenConfirmPickup={(dId) => setCustodyModalDonationId(dId)}
      />

      <CustodyHandoverModal
        isOpen={Boolean(custodyModalDonationId)}
        onClose={() => setCustodyModalDonationId(null)}
        donationId={custodyModalDonationId || ""}
        expectedCode={getCustodyTargetDonation()?.collection_verification_code}
        collectorDefaultName={currentUser.role === "ngo" ? currentUser.name : "Volunteer Dispatch Team"}
        onConfirm={handleConfirmPickup}
      />

    </div>
  );
}
