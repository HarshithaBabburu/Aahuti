import React, { useState } from "react";
import {
  X, MapPin, Clock, Calendar, ShieldCheck,
  Sparkles, CheckCircle2, AlertCircle, ArrowRight,
  Package, ChevronRight, Store, Utensils, AlertTriangle, KeyRound
} from "lucide-react";
import type { Donation, Donor } from "../api";
import type { UserProfile } from "../types";
import { getFoodImage, getFoodAltText } from "../data/foodImages";
import { CyclingFoodImage } from "./CyclingFoodImage";

interface DonationDetailsModalProps {
  donation: Donation | null;
  donor: Donor | undefined;
  onClose: () => void;
  currentUser: UserProfile;
  onAcceptDonation: (donationId: string) => void;
  onOpenAiMatch: (donationId: string) => void;
  onOpenConfirmPickup: (donationId: string) => void;
}

export const DonationDetailsModal: React.FC<DonationDetailsModalProps> = ({
  donation,
  donor,
  onClose,
  currentUser,
  onAcceptDonation,
  onOpenAiMatch,
  onOpenConfirmPickup,
}) => {
  const [requesting, setRequesting] = useState(false);

  if (!donation) return null;

  const imageUrl = getFoodImage(donation.title, donation.food_category, donation.id, (donation as any).image_url);
  const altText = getFoodAltText(donation.title, donation.food_category);
  const now = new Date();
  const deadlineDate = new Date(donation.pickup_deadline);
  const hoursLeft = Math.max(0, (deadlineDate.getTime() - now.getTime()) / (1000 * 3600));
  const isUrgent = hoursLeft < 3 && hoursLeft > 0;
  const isExpired = deadlineDate < now && donation.status !== "COLLECTED";
  const isAvailable = donation.status === "PROPOSED" && !isExpired;

  // 5-Stage Pipeline: Available → Matched → Accepted → Pickup Scheduled → Collected
  const getStageIndex = (d: Donation): number => {
    if (d.status === "COLLECTED") return 4;
    if (d.status === "PICKUP_SCHEDULED") return 3;
    if (d.status === "ACCEPTED") return 2;
    if (d.status === "MATCHED" || (d.matched_recipient_id && d.status === "PROPOSED")) return 1;
    return 0; // AVAILABLE / PROPOSED
  };

  const currentStageIdx = getStageIndex(donation);

  const formatStageTime = (isoString?: string) => {
    if (!isoString) return null;
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const steps = [
    {
      key: "AVAILABLE",
      label: "Available",
      title: "Surplus Registered",
      timestamp: donation.created_at || donation.prepared_at,
      desc: "Logged by donor with FSSAI safety criteria",
    },
    {
      key: "MATCHED",
      label: "Matched",
      title: "AI Policy Matched",
      timestamp: donation.matched_at,
      desc: "Strands Decider 2B matched to verified recipient",
    },
    {
      key: "ACCEPTED",
      label: "Accepted",
      title: "NGO Confirmed",
      timestamp: donation.accepted_at,
      desc: "Recipient kitchen approved allocation",
    },
    {
      key: "PICKUP_SCHEDULED",
      label: "Pickup Scheduled",
      title: "Courier Dispatched",
      timestamp: donation.pickup_scheduled_at,
      desc: "Handover PIN generated & volunteer routed",
    },
    {
      key: "COLLECTED",
      label: "Collected",
      title: "Handover Verified",
      timestamp: donation.collected_at,
      desc: "PIN verified & physical handover recorded",
    },
  ];

  const getStepStatus = (stepIdx: number) => {
    if (donation.status === "EXPIRED" || donation.status === "REJECTED") {
      return "inactive";
    }
    if (stepIdx < currentStageIdx) return "completed";
    if (stepIdx === currentStageIdx) return "current";
    return "upcoming";
  };

  const handleAcceptClick = async () => {
    setRequesting(true);
    try {
      await onAcceptDonation(donation.id);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171914]/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-[#F3EEE4] w-full max-w-2xl rounded-3xl border border-[#D8CDBA] shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Header Hero with Food Image */}
        <div className="relative h-48 sm:h-56 w-full bg-[#E8E2D5] shrink-0">
          <CyclingFoodImage
            title={donation.title}
            category={donation.food_category}
            id={donation.id}
            existingImageUrl={(donation as any).image_url}
            altText={altText}
            intervalMs={5000}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-emerald-800 shadow-xs flex items-center gap-1 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Pure Veg</span>
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8E2D5] text-[#74785B] shadow-xs">
                {donation.food_category}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/20 text-white">
                ID: {donation.id}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display leading-tight">
              {donation.title}
            </h2>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Status Alert Banner if Expired or Assigned */}
          {isExpired && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong>Listing Expired:</strong> This donation has passed its safe collection deadline ({deadlineDate.toLocaleTimeString()}) and can no longer be accepted.
              </span>
            </div>
          )}

          {donation.status === "PICKUP_SCHEDULED" && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Pickup Scheduled:</strong> Courier is en-route. Physical handover verification PIN: <strong className="font-mono text-[#171914] px-1.5 py-0.5 bg-amber-100 rounded">{donation.collection_verification_code || "FB-8942"}</strong>.
              </span>
            </div>
          )}

          {donation.status === "COLLECTED" && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Successfully Collected:</strong> Verified & collected by {donation.authorized_collector_name || "Authorized Volunteer Team"}. Logged in verified impact audit.
              </span>
            </div>
          )}

          {/* Key Quick Info Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-white border border-[#D8CDBA] shadow-xs">
              <span className="text-[11px] font-semibold text-[#5D6057] block">Measured Quantity</span>
              <span className="text-base font-bold text-[#74785B]">{donation.quantity_kg} kg</span>
              <span className="text-[10px] text-[#5D6057] block">~{Math.round(donation.quantity_kg / 0.40)} meals</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-[#D8CDBA] shadow-xs">
              <span className="text-[11px] font-semibold text-[#5D6057] block">Storage Protocol</span>
              <span className="text-base font-bold text-[#171914]">{donation.storage_requirement}</span>
              <span className="text-[10px] text-[#5D6057] block">Temperature rule</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-[#D8CDBA] shadow-xs">
              <span className="text-[11px] font-semibold text-[#5D6057] block">Safe Deadline</span>
              <span className="text-base font-bold text-[#171914]">
                {deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className={`text-[10px] block ${isUrgent ? "text-amber-600 font-bold" : "text-[#5D6057]"}`}>
                {isExpired ? "Expired" : `${hoursLeft.toFixed(1)}h remaining`}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-[#D8CDBA] shadow-xs">
              <span className="text-[11px] font-semibold text-[#5D6057] block">Handover PIN</span>
              <span className="text-base font-bold font-mono text-[#74785B]">
                {donation.collection_verification_code || "Auto-Gen"}
              </span>
              <span className="text-[10px] text-[#5D6057] block">2-Party Verification</span>
            </div>
          </div>

          {/* 5-STAGE PICKUP TRACKING PIPELINE */}
          <div className="bg-white p-5 rounded-2xl border border-[#D8CDBA] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#74785B] block">
                  Pickup Tracking Pipeline
                </span>
                <p className="text-[11px] text-[#5D6057]">
                  Available → Matched → Accepted → Pickup Scheduled → Collected
                </p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E8E2D5] text-[#74785B] border border-[#D8CDBA]">
                Stage {currentStageIdx + 1} of 5 Active
              </span>
            </div>

            {/* Stepper Progress Bar */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {steps.map((step, idx) => {
                const status = getStepStatus(idx);
                const timeStr = formatStageTime(step.timestamp);
                return (
                  <div key={step.key} className="space-y-1.5 flex flex-col items-center text-center">
                    {/* Bar Indicator */}
                    <div className="w-full h-1.5 rounded-full overflow-hidden bg-[#D8CDBA]">
                      <div
                        className={`h-full transition-all duration-500 ${
                          status === "completed"
                            ? "bg-emerald-600"
                            : status === "current"
                            ? "bg-[#74785B]"
                            : "bg-transparent"
                        }`}
                        style={{ width: status === "upcoming" ? "0%" : "100%" }}
                      />
                    </div>

                    {/* Step Icon / Number */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        status === "completed"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : status === "current"
                          ? "bg-[#74785B] text-white shadow-xs scale-105"
                          : "bg-[#F3EEE4] text-[#5D6057] border border-[#D8CDBA]"
                      }`}
                    >
                      {status === "completed" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        idx + 1
                      )}
                    </div>

                    {/* Stage Label */}
                    <p
                      className={`text-[10px] sm:text-[11px] font-bold leading-tight ${
                        status === "current"
                          ? "text-[#74785B]"
                          : status === "completed"
                          ? "text-[#171914]"
                          : "text-[#5D6057]"
                      }`}
                    >
                      {step.label}
                    </p>

                    {/* Stage Timestamp */}
                    <span className="text-[9px] font-mono leading-none text-[#5D6057] block">
                      {timeStr ? (
                        <span className="text-emerald-700 font-semibold">{timeStr}</span>
                      ) : (
                        <span className="italic text-gray-400">Pending</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Detailed Stage Timestamps & Audit Trail */}
            <div className="pt-3 border-t border-[#D8CDBA]/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#171914] block mb-2">
                Stage Execution & Timestamps Audit
              </span>
              <div className="space-y-1.5 bg-[#F3EEE4] p-3 rounded-xl border border-[#D8CDBA] text-xs">
                {steps.map((step, idx) => {
                  const status = getStepStatus(idx);
                  const timeStr = formatStageTime(step.timestamp);
                  return (
                    <div key={step.key} className="flex items-center justify-between py-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            status === "completed"
                              ? "bg-emerald-600"
                              : status === "current"
                              ? "bg-[#74785B] animate-pulse"
                              : "bg-gray-300"
                          }`}
                        />
                        <span className={`font-semibold ${status === "current" ? "text-[#74785B]" : "text-[#171914]"}`}>
                          {step.label}:
                        </span>
                        <span className="text-[#5D6057] text-[11px]">{step.desc}</span>
                      </div>
                      <span className="font-mono text-[10px] text-right font-medium">
                        {timeStr ? (
                          <span className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {timeStr}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Awaiting trigger</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pickup Verification & Custody Audit Card */}
            <div className="bg-[#F3EEE4] p-4 rounded-xl border border-[#D8CDBA] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#74785B]" />
                  <span className="text-xs font-bold text-[#171914]">
                    Pickup Verification & Handover Custody
                  </span>
                </div>
                {donation.status === "COLLECTED" ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified & Closed
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Verification Required
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-[#D8CDBA]">
                  <span className="text-[10px] font-semibold text-[#5D6057] block">Handover Verification Code</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#A65F43]" />
                    <span className="font-mono font-bold text-sm text-[#74785B]">
                      {donation.collection_verification_code || "FB-8942"}
                    </span>
                  </div>
                  <span className="text-[9px] text-[#5D6057]">Presented by courier at physical pickup</span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-[#D8CDBA]">
                  <span className="text-[10px] font-semibold text-[#5D6057] block">Authorized Collector</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Utensils className="w-3.5 h-3.5 text-[#74785B]" />
                    <span className="font-bold text-xs text-[#171914]">
                      {donation.authorized_collector_name || "Assigned Field Courier"}
                    </span>
                  </div>
                  <span className="text-[9px] text-[#5D6057]">Identity verified against recipient NGO roster</span>
                </div>
              </div>
            </div>

          </div>

          {/* Description & Packaging Notes */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5D6057] block">
              Description & Handling Details
            </span>
            <div className="bg-white p-4 rounded-2xl border border-[#D8CDBA] text-xs text-[#171914] leading-relaxed space-y-2">
              <p>{donation.description}</p>
              {donation.special_instructions && (
                <div className="pt-2 border-t border-[#D8CDBA]/60 flex items-start gap-1.5 text-amber-800">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                  <span><strong>Loading Note:</strong> {donation.special_instructions}</span>
                </div>
              )}
            </div>
          </div>

          {/* Donor Information */}
          <div className="p-4 rounded-2xl bg-white border border-[#D8CDBA] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8E2D5] flex items-center justify-center text-[#74785B] font-bold">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#171914]">
                  {donor ? donor.name : "Verified Food Provider"}
                </h4>
                <p className="text-[11px] text-[#5D6057] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#74785B]" />
                  <span>{donation.pickup_address}</span>
                </p>
              </div>
            </div>

            {donor && (
              <div className="text-right text-[11px] text-[#5D6057]">
                <span>{donor.contact_person}</span>
                <p className="font-semibold text-[#171914]">{donor.phone}</p>
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#D8CDBA] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#5D6057]">
            Viewing as: <strong className="text-[#171914]">{currentUser.name} ({currentUser.role.toUpperCase()})</strong>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* View AI Match Decision */}
            <button
              onClick={() => {
                onClose();
                onOpenAiMatch(donation.id);
              }}
              className="px-4 py-2.5 rounded-xl border border-[#D8CDBA] bg-[#F3EEE4] hover:bg-[#E8E2D5]/50 text-[#171914] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#74785B]" />
              <span>Inspect AI Match</span>
            </button>

            {/* Accept / Request Action based on role & availability */}
            {isAvailable ? (
              currentUser.role === "ngo" ? (
                <button
                  onClick={handleAcceptClick}
                  disabled={requesting}
                  className="px-5 py-2.5 rounded-xl bg-[#74785B] hover:bg-[#5F634A] text-white text-xs font-bold shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#F3EEE4]" />
                  <span>{requesting ? "Confirming Request..." : "Request Food Collection"}</span>
                </button>
              ) : (
                <button
                  disabled
                  title="Switch to an NGO profile to request pickup"
                  className="px-5 py-2.5 rounded-xl bg-[#D8CDBA]/50 text-[#5D6057] text-xs font-semibold cursor-not-allowed"
                >
                  Available for NGOs
                </button>
              )
            ) : (donation.status === "ACCEPTED" || donation.status === "PICKUP_SCHEDULED") ? (
              <button
                onClick={() => onOpenConfirmPickup(donation.id)}
                className="px-5 py-2.5 rounded-xl bg-[#A65F43] hover:bg-[#8C4D34] text-white text-xs font-bold shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-white" />
                <span>Verify Handover PIN</span>
              </button>
            ) : isExpired ? (
              <button
                disabled
                className="px-5 py-2.5 rounded-xl bg-rose-100 text-rose-700 text-xs font-semibold cursor-not-allowed"
              >
                Collection Window Expired
              </button>
            ) : (
              <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center gap-1.5 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Food Rescued & Logged</span>
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
