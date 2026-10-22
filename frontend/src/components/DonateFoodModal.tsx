import React, { useState } from "react";
import { X, Send, HeartHandshake, ShieldCheck, Clock, MapPin } from "lucide-react";
import type { Donor } from "../api";
import type { UserProfile } from "../types";
import { AahutiLogo } from "./AahutiLogo";

interface DonateFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  donors: Donor[];
  currentUser: UserProfile;
  onSubmitDonation: (data: any) => Promise<void>;
}

export const DonateFoodModal: React.FC<DonateFoodModalProps> = ({
  isOpen,
  onClose,
  donors,
  currentUser,
  onSubmitDonation,
}) => {
  const [donorId, setDonorId] = useState(currentUser.id.startsWith("donor") ? currentUser.id : "donor_001");
  const [title, setTitle] = useState("45 Portions Fresh Vegetable Biryani & Raita");
  const [description, setDescription] = useState("Surplus wedding banquet dinner, hygienically sealed in food-grade thermal vessels.");
  const [category, setCategory] = useState("Cooked Meals");
  const [quantityKg, setQuantityKg] = useState<number>(32);
  const [storage, setStorage] = useState("Ambient");
  const [deadlineHours, setDeadlineHours] = useState<number>(4);
  const [address, setAddress] = useState(currentUser.address || "Road No 12, Banjara Hills, Hyderabad");
  const [dietaryInfo, setDietaryInfo] = useState("Vegetarian • Contains Dairy");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const now = new Date();
      const prepTime = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      const deadline = new Date(now.getTime() + deadlineHours * 3600 * 1000).toISOString();

      await onSubmitDonation({
        donor_id: donorId,
        title,
        description: `${description} [Dietary: ${dietaryInfo}]`,
        food_category: category,
        quantity_kg: Number(quantityKg),
        storage_requirement: storage,
        prepared_at: prepTime,
        pickup_deadline: deadline,
        pickup_address: address,
        latitude: 17.4156,
        longitude: 78.4357,
        special_instructions: "Kitchen entrance loading dock.",
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171914]/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-[#F3EEE4] w-full max-w-xl rounded-3xl border border-[#D8CDBA] shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#171914] px-6 py-5 text-[#F3EEE4] flex items-center justify-between border-b border-[#5F634A]/40">
          <div className="flex items-center gap-3">
            <AahutiLogo size="sm" theme="dark" showTagline={false} />
            <div>
              <h3 className="text-base font-bold font-display leading-tight text-white">
                Donate Surplus Food • आहुति
              </h3>
              <p className="text-xs text-[#E8E2D5]">
                Aahuti — Every offering matters. AI routing to verified kitchens.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 transition-colors text-white/80 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#171914] mb-1">
              Donor Organization
            </label>
            <select
              value={donorId}
              onChange={(e) => setDonorId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#D8CDBA] bg-white text-xs font-medium text-[#171914] focus:border-[#74785B] outline-none"
            >
              {donors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.address})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171914] mb-1">
              Food Item Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#D8CDBA] bg-white text-xs font-medium text-[#171914] focus:border-[#74785B] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171914] mb-1">
                Food Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D8CDBA] bg-white text-xs font-medium text-[#171914] focus:border-[#74785B] outline-none"
              >
                <option value="Cooked Meals">Cooked Meals</option>
                <option value="Bakery & Breads">Bakery & Breads</option>
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Dairy & Packaged">Dairy & Packaged</option>
                <option value="Desserts & Beverages">Desserts & Beverages</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171914] mb-1">
                Quantity (kg) *
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                required
                value={quantityKg}
                onChange={(e) => setQuantityKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D8CDBA] bg-white text-xs font-medium text-[#171914] focus:border-[#74785B] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171914] mb-1">
                Storage Method
              </label>
              <select
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D8CDBA] bg-white text-xs font-medium text-[#171914] focus:border-[#74785B] outline-none"
              >
                <option value="Ambient">Ambient</option>
                <option value="Refrigerated">Refrigerated (Cold Chain)</option>
                <option value="Frozen">Frozen</option>
                <option value="Heated/Insulated">Heated / Insulated</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171914] mb-1">
                Pickup Window
              </label>
              <select
                value={deadlineHours}
                onChange={(e) => setDeadlineHours(parseInt(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D8CDBA] bg-white text-xs font-medium text-[#171914] focus:border-[#74785B] outline-none"
              >
                <option value="2">Within 2 hours</option>
                <option value="3">Within 3 hours</option>
                <option value="4">Within 4 hours (Recommended)</option>
                <option value="6">Within 6 hours</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171914] mb-1">
              Dietary Information
            </label>
            <input
              type="text"
              value={dietaryInfo}
              onChange={(e) => setDietaryInfo(e.target.value)}
              placeholder="e.g. Vegetarian, Halal, Nut-free"
              className="w-full px-3.5 py-2 rounded-xl border border-[#D8CDBA] bg-white text-xs font-medium text-[#171914] focus:border-[#74785B] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171914] mb-1">
              Pickup Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#D8CDBA] bg-white text-xs font-medium text-[#171914] focus:border-[#74785B] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171914] mb-1">
              Description & Packaging Details
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#D8CDBA] bg-white text-xs font-medium text-[#171914] focus:border-[#74785B] outline-none"
            />
          </div>

          {/* Safety Notice */}
          <div className="p-3 rounded-2xl bg-[#E8E2D5]/50 border border-[#D8CDBA] text-xs text-[#5D6057] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#74785B] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Aahuti Sacred Offering & Hygiene Guarantee:</strong> By submitting, you confirm the surplus food is prepared under hygienic safety conditions and stored at appropriate temperatures.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#5D6057] hover:text-[#171914] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#74785B] hover:bg-[#5F634A] text-white text-xs font-bold transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              {submitting ? "Posting..." : "Submit Sacred Offering"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
