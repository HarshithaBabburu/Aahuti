import React, { useState } from "react";
import { X, KeyRound, ShieldCheck, CheckCircle2, AlertTriangle, Truck } from "lucide-react";

interface CustodyHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  donationId: string;
  expectedCode?: string;
  collectorDefaultName: string;
  onConfirm: (donationId: string, code: string, collectorName: string) => Promise<void>;
}

export const CustodyHandoverModal: React.FC<CustodyHandoverModalProps> = ({
  isOpen,
  onClose,
  donationId,
  expectedCode,
  collectorDefaultName,
  onConfirm,
}) => {
  const [code, setCode] = useState(expectedCode || "");
  const [collectorName, setCollectorName] = useState(collectorDefaultName);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(donationId, code, collectorName);
      onClose();
    } catch (err: any) {
      setError(err.message || "Invalid verification code or collection failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171914]/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#F3EEE4] w-full max-w-md rounded-3xl border border-[#D8CDBA] shadow-2xl overflow-hidden p-6 space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-[#D8CDBA]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8E2D5] text-[#74785B] flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5 text-[#74785B]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#171914] font-display">
                Confirm Physical Custody
              </h3>
              <p className="text-[11px] text-[#5D6057]">
                Batch: {donationId}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-[#E8E2D5]/50 text-[#5D6057] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#171914] mb-1">
              Donor Handover Verification Code
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. FB-8942"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D8CDBA] text-base font-mono font-bold text-[#171914] tracking-wider uppercase focus:border-[#74785B] outline-none bg-white"
            />
            <span className="text-[11px] text-[#5D6057] mt-1 block">
              Ask food donor for the code shown on their listing voucher.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171914] mb-1">
              Authorized Volunteer / Collector Name
            </label>
            <input
              type="text"
              required
              value={collectorName}
              onChange={(e) => setCollectorName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-[#D8CDBA] text-xs font-medium focus:border-[#74785B] outline-none bg-white text-[#171914]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#D8CDBA] text-xs font-semibold text-[#5D6057] hover:bg-[#E8E2D5]/50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-[#74785B] hover:bg-[#5F634A] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#F3EEE4]" />
              <span>{submitting ? "Verifying..." : "Verify & Mark Collected"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
