import React, { useState } from "react";
import {
  Package, PlusCircle, CheckCircle2, Clock,
  Calendar, MapPin, AlertCircle, ArrowRight, ShieldCheck,
  Send, RefreshCw, KeyRound, Store, Utensils, Info, X
} from "lucide-react";
import type { Donation, Donor } from "../../api";
import type { UserProfile } from "../../types";

interface DonorDashboardPageProps {
  donations: Donation[];
  donors: Donor[];
  currentUser: UserProfile;
  onCreateDonation: (data: any) => Promise<void>;
  onSelectDonation: (donation: Donation) => void;
  onOpenAiMatch: (donationId: string) => void;
}

export const DonorDashboardPage: React.FC<DonorDashboardPageProps> = ({
  donations,
  currentUser,
  onCreateDonation,
  onSelectDonation,
  onOpenAiMatch,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("40 Servings Dal Makhani & Jeera Rice");
  const [description, setDescription] = useState("Surplus buffet lunch, hygienically packed in food-grade thermal containers.");
  const [category, setCategory] = useState("Cooked Meals");
  const [quantityKg, setQuantityKg] = useState<number>(25);
  const [storage, setStorage] = useState("Ambient");
  const [dietaryInfo, setDietaryInfo] = useState("Vegetarian • Contains Dairy");
  const [prepMinutesAgo, setPrepMinutesAgo] = useState<number>(60);
  const [deadlineHoursAhead, setDeadlineHoursAhead] = useState<number>(4);
  const [address, setAddress] = useState(currentUser.address);
  const [specialInstructions, setSpecialInstructions] = useState("Loading bay #2 at venue rear. Security will guide courier.");

  // Filter donor's own donations
  const donorDonations = donations.filter(
    (d) => d.donor_id === currentUser.id || currentUser.role === "admin"
  );

  const activeDonations = donorDonations.filter(
    (d) => d.status === "PROPOSED"
  );
  const pendingCollections = donorDonations.filter(
    (d) => d.status === "ACCEPTED" || d.status === "PICKUP_SCHEDULED"
  );
  const completedDonations = donorDonations.filter(
    (d) => d.status === "COLLECTED"
  );

  const totalKgRescued = completedDonations.reduce((sum, d) => sum + d.quantity_kg, 0);
  const estimatedMeals = Math.round(totalKgRescued / 0.40);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const now = new Date();
      const prepDate = new Date(now.getTime() - prepMinutesAgo * 60 * 1000).toISOString();
      const deadlineDate = new Date(now.getTime() + deadlineHoursAhead * 3600 * 1000).toISOString();

      await onCreateDonation({
        donor_id: currentUser.id,
        title,
        description: `${description} [Dietary: ${dietaryInfo}]`,
        food_category: category,
        quantity_kg: Number(quantityKg),
        storage_requirement: storage,
        prepared_at: prepDate,
        pickup_deadline: deadlineDate,
        pickup_address: address,
        latitude: 17.4156,
        longitude: 78.4357,
        special_instructions: specialInstructions,
      });

      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D8CDBA] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#74785B] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#74785B]" />
            <span>Aahuti Donor Portal • {currentUser.entityType.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171914]">
            {currentUser.entityName}
          </h1>
          <p className="text-xs sm:text-sm text-[#5D6057] mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#74785B]" />
            <span>{currentUser.address}</span>
            <span>•</span>
            <span>Contact: {currentUser.name}</span>
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#171914] text-white text-sm font-semibold hover:bg-[#74785B] shadow-subtle transition-all active:scale-[0.98]"
        >
          {showForm ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4 text-[#E8E2D5]" />}
          <span>{showForm ? "Close Form" : "Add Sacred Surplus Offering"}</span>
        </button>
      </div>

      {/* 4 Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-3xl border border-[#D8CDBA] shadow-subtle">
          <p className="text-xs font-semibold text-[#5D6057]">Active Listings</p>
          <p className="text-2xl sm:text-3xl font-serif font-extrabold text-[#171914] mt-1">
            {activeDonations.length}
          </p>
          <p className="text-[11px] text-[#5D6057] mt-0.5">Awaiting NGO assignment</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#D8CDBA] shadow-subtle">
          <p className="text-xs font-semibold text-[#5D6057]">Pending Collections</p>
          <p className="text-2xl sm:text-3xl font-serif font-extrabold text-[#A65F43] mt-1">
            {pendingCollections.length}
          </p>
          <p className="text-[11px] text-[#5D6057] mt-0.5">Pickup in transit</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#D8CDBA] shadow-subtle">
          <p className="text-xs font-semibold text-[#5D6057]">Completed Pickups</p>
          <p className="text-2xl sm:text-3xl font-serif font-extrabold text-[#74785B] mt-1">
            {completedDonations.length}
          </p>
          <p className="text-[11px] text-[#5D6057] mt-0.5">Safely collected</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#D8CDBA] shadow-subtle">
          <p className="text-xs font-semibold text-[#5D6057]">Meals Redistributed</p>
          <p className="text-2xl sm:text-3xl font-serif font-extrabold text-[#74785B] mt-1">
            {estimatedMeals}
          </p>
          <p className="text-[11px] text-[#5D6057] mt-0.5">{totalKgRescued.toFixed(0)} kg food rescued</p>
        </div>
      </div>

      {/* Inline Registration Form */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-[#D8CDBA] p-6 sm:p-8 shadow-card space-y-6 animate-fade-in">
          <div className="border-b border-[#D8CDBA] pb-4">
            <h2 className="text-lg font-bold font-serif text-[#171914]">
              Register Surplus Food Batch
            </h2>
            <p className="text-xs text-[#5D6057] mt-0.5">
              Provide accurate food safety and logistical details for instant AI matching.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#171914] mb-1">
                  Food Name & Summary *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 50 Servings Veg Biryani & Curry"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8CDBA] bg-[#F3EEE4] focus:bg-white focus:outline-none focus:border-[#74785B] text-[#171914]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171914] mb-1">
                  Food Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8CDBA] bg-[#F3EEE4] focus:bg-white focus:outline-none focus:border-[#74785B] text-[#171914]"
                >
                  <option value="Cooked Meals">Cooked Meals (Buffet / Banquet)</option>
                  <option value="Bakery & Breads">Bakery & Breads</option>
                  <option value="Fresh Produce">Fresh Produce (Fruits / Vegetables)</option>
                  <option value="Dairy & Packaged">Dairy & Packaged</option>
                  <option value="Desserts & Beverages">Desserts & Beverages</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171914] mb-1">
                  Quantity (Kilograms) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  required
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8CDBA] bg-[#F3EEE4] focus:bg-white focus:outline-none focus:border-[#74785B] text-[#171914]"
                />
                <p className="text-[11px] text-[#5D6057] mt-1">
                  Estimated portions: ~{Math.round(quantityKg / 0.40)} meals
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171914] mb-1">
                  Storage & Handling Requirement *
                </label>
                <select
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8CDBA] bg-[#F3EEE4] focus:bg-white focus:outline-none focus:border-[#74785B] text-[#171914]"
                >
                  <option value="Ambient">Ambient (Room Temperature)</option>
                  <option value="Refrigerated">Refrigerated (Requires Cold Storage)</option>
                  <option value="Frozen">Frozen</option>
                  <option value="Heated/Insulated">Heated / Thermal Insulated</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171914] mb-1">
                  Prepared How Long Ago? *
                </label>
                <select
                  value={prepMinutesAgo}
                  onChange={(e) => setPrepMinutesAgo(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8CDBA] bg-[#F3EEE4] focus:bg-white focus:outline-none focus:border-[#74785B] text-[#171914]"
                >
                  <option value="30">30 minutes ago (Freshly prepared)</option>
                  <option value="60">1 hour ago</option>
                  <option value="120">2 hours ago</option>
                  <option value="180">3 hours ago</option>
                  <option value="240">4 hours ago</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171914] mb-1">
                  Pickup Deadline Window *
                </label>
                <select
                  value={deadlineHoursAhead}
                  onChange={(e) => setDeadlineHoursAhead(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8CDBA] bg-[#F3EEE4] focus:bg-white focus:outline-none focus:border-[#74785B] text-[#171914]"
                >
                  <option value="2">Within 2 hours (Urgent window)</option>
                  <option value="3">Within 3 hours</option>
                  <option value="4">Within 4 hours (Standard)</option>
                  <option value="6">Within 6 hours</option>
                  <option value="8">Within 8 hours</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#171914] mb-1">
                  Dietary / Allergen Information
                </label>
                <input
                  type="text"
                  value={dietaryInfo}
                  onChange={(e) => setDietaryInfo(e.target.value)}
                  placeholder="e.g. Pure Vegetarian, Gluten-Free, Contains Nuts"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8CDBA] bg-[#F3EEE4] focus:bg-white focus:outline-none focus:border-[#74785B] text-[#171914]"
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
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8CDBA] bg-[#F3EEE4] focus:bg-white focus:outline-none focus:border-[#74785B] text-[#171914]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171914] mb-1">
                Detailed Packaging & Loading Instructions
              </label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Special notes for volunteer pickup dispatch..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#D8CDBA] bg-[#F3EEE4] focus:bg-white focus:outline-none focus:border-[#74785B] text-[#171914]"
              />
            </div>

            {/* Food Safety Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-[#E8E2D5] border border-[#D8CDBA] text-xs text-[#5D6057] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#74785B] shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Food Safety Requirement:</strong> All donated items must be handled under clean, food-grade conditions. AI policy classifications assist logistics and dispatch prioritization, but do not replace donor safety compliance.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-xs font-semibold text-[#5D6057] hover:text-[#171914]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-full bg-[#171914] text-white text-xs font-semibold hover:bg-[#74785B] transition-all shadow-subtle"
              >
                {submitting ? "Registering..." : "Submit Surplus Listing"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Donation Management Table */}
      <div className="bg-white rounded-3xl border border-[#D8CDBA] shadow-subtle overflow-hidden">
        <div className="p-6 border-b border-[#D8CDBA] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-serif text-[#171914]">
              Your Food Donations
            </h2>
            <p className="text-xs text-[#5D6057] mt-0.5">
              Track lifecycle, collection codes, and matched organizations.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#5D6057]">
            {donorDonations.length} total entries
          </span>
        </div>

        {donorDonations.length === 0 ? (
          <div className="p-12 text-center text-[#5D6057] space-y-3">
            <Utensils className="w-8 h-8 mx-auto text-[#74785B]/60" />
            <p className="text-sm font-semibold text-[#171914]">No donations logged yet.</p>
            <p className="text-xs">Click "Add Surplus Food" above to post your first batch.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F3EEE4] text-[#5D6057] border-b border-[#D8CDBA] uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-4">Food Item</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Storage</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Handover Code</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8CDBA] text-[#171914] font-medium">
                {donorDonations.map((d) => {
                  const deadlineDate = new Date(d.pickup_deadline);
                  const isExpired = deadlineDate.getTime() < Date.now();

                  return (
                    <tr key={d.id} className="hover:bg-[#F3EEE4]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#171914] line-clamp-1">{d.title}</p>
                        <p className="text-[11px] text-[#5D6057]">{d.food_category}</p>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#74785B]">
                        {d.quantity_kg} kg
                      </td>
                      <td className="py-3.5 px-4 text-[#5D6057]">
                        {d.storage_requirement}
                      </td>
                      <td className="py-3.5 px-4 text-[#5D6057]">
                        {deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-4">
                        {d.status === "COLLECTED" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Collected
                          </span>
                        ) : d.status === "PICKUP_SCHEDULED" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" /> Pickup Scheduled
                          </span>
                        ) : isExpired ? (
                          <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            Expired
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-[#74785B] bg-[#E8E2D5] px-2 py-0.5 rounded-full border border-[#D8CDBA]">
                            Available
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#171914]">
                        {d.collection_verification_code || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => onSelectDonation(d)}
                          className="px-2.5 py-1 rounded-lg border border-[#D8CDBA] bg-white hover:bg-[#E8E2D5] text-[11px] font-semibold text-[#171914] transition-colors"
                        >
                          Details
                        </button>
                        {d.status === "PROPOSED" && (
                          <button
                            onClick={() => onOpenAiMatch(d.id)}
                            className="px-2.5 py-1 rounded-lg bg-[#74785B] hover:bg-[#5F634A] text-white text-[11px] font-semibold transition-colors"
                          >
                            AI Match
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
