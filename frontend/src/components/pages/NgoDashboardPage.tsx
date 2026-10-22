import React, { useState } from "react";
import {
  Building2, ShieldCheck, CheckCircle2, Clock, MapPin,
  Truck, ArrowRight, XCircle, AlertCircle, KeyRound,
  RefreshCw, Utensils, Check, Scale, PackageCheck, Send
} from "lucide-react";
import type { Donation, Recipient } from "../../api";
import type { UserProfile } from "../../types";

interface NgoDashboardPageProps {
  donations: Donation[];
  recipients: Recipient[];
  currentUser: UserProfile;
  onAcceptDonation: (donationId: string) => Promise<void>;
  onSelectDonation: (donation: Donation) => void;
  onOpenConfirmPickup: (donationId: string) => void;
  onOpenAiMatch: (donationId: string) => void;
}

export const NgoDashboardPage: React.FC<NgoDashboardPageProps> = ({
  donations,
  recipients,
  currentUser,
  onAcceptDonation,
  onSelectDonation,
  onOpenConfirmPickup,
  onOpenAiMatch,
}) => {
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Find the recipient entity matching current user
  const myRecipient = recipients.find(
    (r) => r.id === currentUser.id || r.name.toLowerCase().includes(currentUser.entityName.toLowerCase())
  ) || recipients[0]; // fallback to Asha Kitchen for demo

  // 1. Available Food Nearby (PROPOSED)
  const incomingDonations = donations.filter((d) => d.status === "PROPOSED");

  // 2. Pending Collection Requests (ACCEPTED - dispatch requested)
  const pendingRequests = donations.filter(
    (d) => d.status === "ACCEPTED" && (d.accepted_by_recipient_id === myRecipient?.id || !d.accepted_by_recipient_id)
  );

  // 3. Confirmed Pickups (PICKUP_SCHEDULED - courier assigned and en route)
  const confirmedPickups = donations.filter(
    (d) => d.status === "PICKUP_SCHEDULED" && (d.accepted_by_recipient_id === myRecipient?.id || !d.accepted_by_recipient_id)
  );

  // 4. Completed Collections (COLLECTED)
  const completedCollections = donations.filter(
    (d) => d.status === "COLLECTED" && (d.accepted_by_recipient_id === myRecipient?.id || !d.accepted_by_recipient_id)
  );

  // 5. Total Food Received (kg)
  const totalFoodReceivedKg = completedCollections.reduce((sum, d) => sum + d.quantity_kg, 0);
  const totalMealsReceived = Math.round(totalFoodReceivedKg / 0.40);

  const capacityPct = myRecipient
    ? Math.min(100, Math.round((myRecipient.current_day_intake_kg / myRecipient.max_daily_capacity_kg) * 100))
    : 0;

  const handleAccept = async (donationId: string) => {
    setActionInProgress(donationId);
    try {
      await onAcceptDonation(donationId);
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Profile & Capacity Card */}
      {myRecipient && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D8CDBA] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#74785B] bg-[#E8E2D5]/70 border border-[#D8CDBA]/60 px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#74785B]" />
                <span>Aahuti Verified NGO Kitchen Hub</span>
              </span>
              {myRecipient.has_cold_storage && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  ❄️ Cold Storage Facility Active
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171914]">
              {myRecipient.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#5D6057] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#74785B]" />
              <span>{myRecipient.address} • Operating Hours: {myRecipient.operational_hours}</span>
            </p>
          </div>

          {/* Daily Capacity Meter Card */}
          <div className="bg-[#F3EEE4] p-4 sm:p-5 rounded-2xl border border-[#D8CDBA] min-w-[280px]">
            <div className="flex items-center justify-between text-xs font-bold text-[#171914] mb-2">
              <span>Today's Kitchen Intake</span>
              <span>{myRecipient.current_day_intake_kg} / {myRecipient.max_daily_capacity_kg} kg ({capacityPct}%)</span>
            </div>

            <div className="w-full h-3 rounded-full bg-[#D8CDBA] overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  capacityPct > 90
                    ? "bg-rose-500"
                    : capacityPct > 70
                    ? "bg-amber-500"
                    : "bg-[#74785B]"
                }`}
                style={{ width: `${capacityPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#5D6057] mt-2">
              <span>Remaining Capacity Buffer:</span>
              <span className="font-bold text-[#74785B]">
                {Math.max(0, myRecipient.max_daily_capacity_kg - myRecipient.current_day_intake_kg)} kg
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5-Metric NGO Dashboard Overview (Section 7 Specification) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {/* 1. Available Food Nearby */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D8CDBA] shadow-subtle">
          <div className="flex items-center justify-between text-[#74785B] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5D6057]">Available Nearby</span>
            <Utensils className="w-4 h-4 text-[#74785B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-extrabold text-[#171914]">
            {incomingDonations.length}
          </p>
          <p className="text-[11px] text-[#5D6057] mt-1">Ready for immediate claim</p>
        </div>

        {/* 2. Pending Collection Requests */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D8CDBA] shadow-subtle">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5D6057]">Pending Requests</span>
            <Send className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-600">
            {pendingRequests.length}
          </p>
          <p className="text-[11px] text-[#5D6057] mt-1">Awaiting driver departure</p>
        </div>

        {/* 3. Confirmed Pickups */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D8CDBA] shadow-subtle">
          <div className="flex items-center justify-between text-indigo-600 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5D6057]">Confirmed Pickups</span>
            <Truck className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-extrabold text-indigo-600">
            {confirmedPickups.length}
          </p>
          <p className="text-[11px] text-[#5D6057] mt-1">Courier actively en route</p>
        </div>

        {/* 4. Completed Collections */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D8CDBA] shadow-subtle">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5D6057]">Completed Rescues</span>
            <PackageCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-extrabold text-emerald-700">
            {completedCollections.length}
          </p>
          <p className="text-[11px] text-[#5D6057] mt-1">Safely handed over</p>
        </div>

        {/* 5. Total Food Received */}
        <div className="col-span-2 md:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-[#D8CDBA] shadow-subtle">
          <div className="flex items-center justify-between text-[#74785B] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5D6057]">Total Food Received</span>
            <Scale className="w-4 h-4 text-[#74785B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-extrabold text-[#74785B]">
            {totalFoodReceivedKg.toFixed(0)} <span className="text-xs font-normal text-[#5D6057]">kg</span>
          </p>
          <p className="text-[11px] text-[#5D6057] mt-1">~{totalMealsReceived} meals served</p>
        </div>
      </div>

      {/* Confirmed Pickups & Active Transit (Pending Code Verification) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-serif text-[#171914]">
              Confirmed Pickups in Transit ({confirmedPickups.length + pendingRequests.length})
            </h2>
            <p className="text-xs text-[#5D6057] mt-0.5">
              Pickup team dispatched. Enter donor's 6-character code upon arrival.
            </p>
          </div>
        </div>

        {confirmedPickups.length === 0 && pendingRequests.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-[#D8CDBA] text-center text-[#5D6057] text-xs">
            No active collections in transit right now. Review available surplus offers below.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...confirmedPickups, ...pendingRequests].map((d) => {
              const deadlineDate = new Date(d.pickup_deadline);

              return (
                <div
                  key={d.id}
                  className="bg-white rounded-3xl border border-amber-200 p-5 shadow-subtle space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Truck className="w-3 h-3 text-amber-600" />
                        <span>Pickup Dispatched</span>
                      </span>
                      <span className="font-bold text-[#74785B]">
                        {d.quantity_kg} kg (~{Math.round(d.quantity_kg / 0.40)} meals)
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#171914] line-clamp-1">
                      {d.title}
                    </h3>
                    <p className="text-xs text-[#5D6057] flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-3 h-3 text-[#74785B] shrink-0" />
                      <span>{d.pickup_address}</span>
                    </p>

                    <div className="pt-2 text-xs text-[#5D6057] space-y-1">
                      <p className="flex items-center justify-between text-[11px]">
                        <span>Pickup window ends:</span>
                        <strong className="text-amber-800">
                          {deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </strong>
                      </p>
                      <p className="flex items-center justify-between text-[11px]">
                        <span>Storage protocol:</span>
                        <span className="font-medium text-[#171914]">{d.storage_requirement}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#D8CDBA] flex items-center gap-2">
                    <button
                      onClick={() => onOpenConfirmPickup(d.id)}
                      className="flex-1 py-2 rounded-full bg-[#171914] text-white text-xs font-semibold hover:bg-[#74785B] shadow-subtle transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#E8E2D5]" />
                      <span>Verify & Receive</span>
                    </button>
                    <button
                      onClick={() => onSelectDonation(d)}
                      className="px-3 py-2 rounded-xl border border-[#D8CDBA] bg-white text-xs font-semibold text-[#171914] hover:bg-[#F3EEE4]"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Surplus Food in Area */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold font-serif text-[#171914]">
            Available Surplus Food Nearby ({incomingDonations.length})
          </h2>
          <p className="text-xs text-[#5D6057] mt-0.5">
            Surplus food ready for rescue within your community coverage radius.
          </p>
        </div>

        {incomingDonations.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-[#D8CDBA] text-center text-[#5D6057] text-xs">
            No pending surplus offers right now. Check back shortly.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {incomingDonations.map((d) => {
              const isUrgent = new Date(d.pickup_deadline).getTime() - Date.now() < 3 * 3600 * 1000;
              const isProcessing = actionInProgress === d.id;

              return (
                <div
                  key={d.id}
                  className="bg-white rounded-3xl border border-[#D8CDBA] p-5 shadow-subtle hover:shadow-card transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8E2D5] text-[#74785B]">
                        {d.food_category}
                      </span>
                      {isUrgent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Urgent Window
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-[#171914] line-clamp-1">
                      {d.title}
                    </h3>
                    <p className="text-xs text-[#5D6057] line-clamp-2 leading-relaxed">
                      {d.description}
                    </p>

                    <div className="pt-2 text-xs text-[#5D6057] space-y-1">
                      <p className="flex items-center justify-between text-[11px]">
                        <span>Quantity:</span>
                        <strong className="text-[#74785B]">{d.quantity_kg} kg (~{Math.round(d.quantity_kg / 0.40)} meals)</strong>
                      </p>
                      <p className="flex items-center justify-between text-[11px]">
                        <span>Location:</span>
                        <span className="line-clamp-1 max-w-[170px]">{d.pickup_address}</span>
                      </p>
                      <p className="flex items-center justify-between text-[11px]">
                        <span>Deadline:</span>
                        <span>{new Date(d.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#D8CDBA] flex items-center gap-2">
                    <button
                      onClick={() => handleAccept(d.id)}
                      disabled={isProcessing}
                      className="flex-1 py-2 rounded-full bg-[#171914] text-white text-xs font-semibold hover:bg-[#74785B] shadow-subtle transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      {isProcessing ? "Accepting..." : "Accept & Dispatch Pickup"}
                    </button>
                    <button
                      onClick={() => onOpenAiMatch(d.id)}
                      className="px-3 py-2 rounded-xl border border-[#D8CDBA] bg-white text-xs font-semibold text-[#171914] hover:bg-[#F3EEE4]"
                      title="Inspect AI match policy"
                    >
                      Inspect AI
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Collections Log */}
      <div className="bg-white rounded-3xl border border-[#D8CDBA] shadow-subtle overflow-hidden">
        <div className="p-6 border-b border-[#D8CDBA] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-serif text-[#171914]">
              Completed Food Collections ({completedCollections.length})
            </h2>
            <p className="text-xs text-[#5D6057] mt-0.5">
              Verified food received and served at this facility.
            </p>
          </div>
        </div>

        {completedCollections.length === 0 ? (
          <div className="p-8 text-center text-[#5D6057] text-xs">
            No completed pickups recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F3EEE4] uppercase text-[10px] text-[#5D6057] border-b border-[#D8CDBA] font-bold">
                <tr>
                  <th className="py-3 px-4">Food Item</th>
                  <th className="py-3 px-4">Rescued (kg)</th>
                  <th className="py-3 px-4">Est. Meals</th>
                  <th className="py-3 px-4">Authorized Collector</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8CDBA] font-medium">
                {completedCollections.map((d) => (
                  <tr key={d.id} className="hover:bg-[#F3EEE4]/50">
                    <td className="py-3 px-4 font-bold text-[#171914]">
                      {d.title}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#74785B]">
                      {d.quantity_kg} kg
                    </td>
                    <td className="py-3 px-4 text-[#171914]">
                      ~{Math.round(d.quantity_kg / 0.40)}
                    </td>
                    <td className="py-3 px-4 text-[#5D6057]">
                      {d.authorized_collector_name || "Volunteer Dispatch"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> Handover Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
