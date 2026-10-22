import React, { useState, useMemo } from "react";
import {
  Search, MapPin, Filter, Clock, ArrowRight,
  ShieldCheck, RefreshCw, X, SlidersHorizontal, Sparkles,
  Store, Utensils, ArrowUpDown, Tag, Leaf
} from "lucide-react";
import type { Donation, Donor } from "../../api";
import { FOOD_CATEGORIES, getFoodImage, getFoodAltText } from "../../data/foodImages";
import { CyclingFoodImage } from "../CyclingFoodImage";

interface DiscoveryPageProps {
  donations: Donation[];
  donors: Donor[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectDonation: (donation: Donation) => void;
  onOpenAiMatch: (donationId: string) => void;
}

export const DiscoveryPage: React.FC<DiscoveryPageProps> = ({
  donations,
  donors,
  selectedCategory,
  onSelectCategory,
  onSelectDonation,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [quantityFilter, setQuantityFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [storageFilter, setStorageFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"deadline" | "quantity" | "newest">("deadline");

  const getDonor = (donorId: string) => donors.find((d) => d.id === donorId);

  // Helper to extract dietary tag if present in description or title
  const extractDietaryTag = (item: Donation) => {
    const text = `${item.title} ${item.description}`.toLowerCase();
    if (text.includes("veg") && !text.includes("non-veg")) return "Vegetarian";
    if (text.includes("vegan")) return "Vegan";
    if (text.includes("dairy") || text.includes("curd") || text.includes("paneer")) return "Contains Dairy";
    if (text.includes("bread") || text.includes("bakery")) return "Artisanal Wheat";
    return "Standard Pack";
  };

  const getStageBadge = (item: Donation) => {
    if (item.status === "COLLECTED") {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          Collected
        </span>
      );
    }
    if (item.status === "PICKUP_SCHEDULED") {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
          Pickup Scheduled
        </span>
      );
    }
    if (item.status === "ACCEPTED") {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
          Accepted
        </span>
      );
    }
    if (item.status === "MATCHED" || item.matched_recipient_id) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
          Matched
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8E2D5] text-[#74785B] border border-[#D8CDBA]">
        Available
      </span>
    );
  };

  // Filter & Sort logic
  const filteredDonations = useMemo(() => {
    const list = donations.filter((item) => {
      const donor = getDonor(item.donor_id);
      const donorName = donor ? donor.name.toLowerCase() : "";

      // 1. Category
      if (selectedCategory !== "all" && item.food_category !== selectedCategory) {
        return false;
      }

      // 2. Search term (by food name or donor)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(term);
        const matchesDesc = item.description.toLowerCase().includes(term);
        const matchesDonor = donorName.includes(term);
        const matchesAddress = item.pickup_address.toLowerCase().includes(term);
        if (!matchesTitle && !matchesDesc && !matchesDonor && !matchesAddress) {
          return false;
        }
      }

      // 3. Location filter
      if (locationFilter !== "all") {
        if (!item.pickup_address.toLowerCase().includes(locationFilter.toLowerCase())) {
          return false;
        }
      }

      // 4. Quantity filter
      if (quantityFilter !== "all") {
        if (quantityFilter === "small" && item.quantity_kg >= 25) return false;
        if (quantityFilter === "medium" && (item.quantity_kg < 25 || item.quantity_kg > 50)) return false;
        if (quantityFilter === "large" && item.quantity_kg <= 50) return false;
      }

      // 5. Urgency / Deadline filter
      const hoursUntilDeadline = (new Date(item.pickup_deadline).getTime() - Date.now()) / (3600 * 1000);
      if (urgencyFilter !== "all") {
        if (urgencyFilter === "urgent" && hoursUntilDeadline > 3) return false;
        if (urgencyFilter === "approaching" && hoursUntilDeadline > 6) return false;
      }

      // 6. Storage filter
      if (storageFilter !== "all" && item.storage_requirement !== storageFilter) {
        return false;
      }

      // 7. Status filter
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      return true;
    });

    // Sort
    return list.sort((a, b) => {
      if (sortBy === "deadline") {
        return new Date(a.pickup_deadline).getTime() - new Date(b.pickup_deadline).getTime();
      }
      if (sortBy === "quantity") {
        return b.quantity_kg - a.quantity_kg;
      }
      // newest
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [donations, selectedCategory, searchTerm, locationFilter, quantityFilter, urgencyFilter, storageFilter, statusFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Search Controls */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D8CDBA] shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#74785B] uppercase tracking-wider">
              Searchable Surplus Network
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171914] mt-1">
              Surplus Food Discovery Feed
            </h1>
            <p className="text-xs sm:text-sm text-[#5D6057] mt-1">
              Explore available batches from certified restaurants, hotels, hostels, and venues across Hyderabad.
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <ArrowUpDown className="w-4 h-4 text-[#5D6057]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-[#D8CDBA] text-xs font-semibold bg-[#F3EEE4] focus:bg-white focus:border-[#74785B] outline-none text-[#171914]"
            >
              <option value="deadline">Sort: Earliest Deadline</option>
              <option value="quantity">Sort: Highest Quantity</option>
              <option value="newest">Sort: Recently Added</option>
            </select>
          </div>
        </div>

        {/* Search & Main Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search by Food Name or Donor */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-[#5D6057] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by food name, donor, or area..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D8CDBA] text-xs bg-[#F3EEE4] focus:bg-white focus:border-[#74785B] outline-none text-[#171914]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5D6057] hover:text-[#171914]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location Area Filter */}
          <div className="md:col-span-2">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D8CDBA] text-xs bg-[#F3EEE4] focus:bg-white focus:border-[#74785B] outline-none text-[#171914]"
            >
              <option value="all">All Locations</option>
              <option value="Banjara Hills">Banjara Hills</option>
              <option value="Jubilee Hills">Jubilee Hills</option>
              <option value="Gachibowli">Gachibowli</option>
              <option value="Secunderabad">Secunderabad</option>
            </select>
          </div>

          {/* Quantity Filter */}
          <div className="md:col-span-2">
            <select
              value={quantityFilter}
              onChange={(e) => setQuantityFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D8CDBA] text-xs bg-[#F3EEE4] focus:bg-white focus:border-[#74785B] outline-none text-[#171914]"
            >
              <option value="all">All Quantities</option>
              <option value="small">Small (&lt; 25 kg)</option>
              <option value="medium">Medium (25–50 kg)</option>
              <option value="large">Large (&gt; 50 kg)</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div className="md:col-span-2">
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D8CDBA] text-xs bg-[#F3EEE4] focus:bg-white focus:border-[#74785B] outline-none text-[#171914]"
            >
              <option value="all">All Timelines</option>
              <option value="urgent">Urgent (&lt; 3h left)</option>
              <option value="approaching">Approaching (&lt; 6h left)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D8CDBA] text-xs bg-[#F3EEE4] focus:bg-white focus:border-[#74785B] outline-none text-[#171914]"
            >
              <option value="all">All Statuses</option>
              <option value="PROPOSED">Available Only</option>
              <option value="PICKUP_SCHEDULED">Pickup Scheduled</option>
              <option value="COLLECTED">Collected</option>
            </select>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => onSelectCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-[#74785B] text-white shadow-xs"
                : "bg-[#E8E2D5] text-[#171914] hover:bg-[#D8CDBA]"
            }`}
          >
            All Categories ({donations.length})
          </button>
          {FOOD_CATEGORIES.map((cat) => {
            const count = donations.filter((d) => d.food_category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#74785B] text-white shadow-xs"
                    : "bg-[#E8E2D5] text-[#171914] hover:bg-[#D8CDBA]"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-[#5D6057]">
            Showing {filteredDonations.length} of {donations.length} verified listings
          </p>
          {(searchTerm || selectedCategory !== "all" || locationFilter !== "all" || quantityFilter !== "all" || urgencyFilter !== "all" || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                onSelectCategory("all");
                setLocationFilter("all");
                setQuantityFilter("all");
                setUrgencyFilter("all");
                setStatusFilter("all");
              }}
              className="text-xs font-semibold text-[#74785B] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredDonations.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#D8CDBA] text-[#5D6057] space-y-2">
            <Utensils className="w-8 h-8 mx-auto text-[#74785B]/60" />
            <p className="text-sm font-semibold text-[#171914]">No listings match your search criteria.</p>
            <p className="text-xs">Try relaxing your filters or searching with a different term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDonations.map((d) => {
              const donor = getDonor(d.donor_id);
              const imgUrl = getFoodImage(d.title, d.food_category, d.id, (d as any).image_url);
              const altText = getFoodAltText(d.title, d.food_category);
              const deadlineDate = new Date(d.pickup_deadline);
              const hoursLeft = (deadlineDate.getTime() - Date.now()) / (3600 * 1000);
              const isUrgent = hoursLeft < 3 && hoursLeft > 0;
              const isExpired = deadlineDate.getTime() < Date.now();
              const dietaryTag = extractDietaryTag(d);

              return (
                <div
                  key={d.id}
                  className="bg-white rounded-3xl border border-[#D8CDBA] overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Food Image with Badges */}
                    <div className="h-44 w-full overflow-hidden relative bg-[#E8E2D5]">
                      <CyclingFoodImage
                        title={d.title}
                        category={d.food_category}
                        id={d.id}
                        existingImageUrl={(d as any).image_url}
                        altText={altText}
                        className="group-hover:scale-105 transition-transform duration-500"
                        intervalMs={5000}
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-emerald-800 shadow-xs flex items-center gap-1 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          <span>Pure Veg</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[#74785B] shadow-xs">
                          {d.food_category}
                        </span>
                      </div>
                      {isUrgent && d.status === "PROPOSED" && (
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                            Urgent Window
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-2.5">
                      {/* Quantity & Units + Stage Badge */}
                      <div className="flex items-center justify-between text-xs text-[#74785B] font-bold">
                        <div className="flex items-center gap-1.5">
                          <span>{d.quantity_kg} kg</span>
                          <span className="text-[#5D6057] text-[11px] font-normal">
                            (~{Math.round(d.quantity_kg / 0.40)} meals)
                          </span>
                        </div>
                        {getStageBadge(d)}
                      </div>

                      {/* Food Name */}
                      <h3 className="text-sm font-bold text-[#171914] line-clamp-1 group-hover:text-[#74785B] transition-colors">
                        {d.title}
                      </h3>

                      {/* Dietary Information */}
                      <div className="flex items-center gap-1.5 text-[10px] text-[#74785B] font-semibold">
                        <Tag className="w-3 h-3 text-[#5D6057]" />
                        <span className="bg-[#E8E2D5] px-2 py-0.5 rounded-md">
                          {dietaryTag}
                        </span>
                        <span className="text-[#5D6057] font-normal">• {d.storage_requirement}</span>
                      </div>

                      {/* Donor Name & Location */}
                      <div className="pt-1 text-xs text-[#5D6057] space-y-1">
                        <p className="flex items-center gap-1.5 line-clamp-1">
                          <Store className="w-3.5 h-3.5 text-[#74785B] shrink-0" />
                          <span className="font-medium text-[#171914]">{donor ? donor.name : "Verified Donor"}</span>
                        </p>
                        <p className="flex items-center gap-1.5 line-clamp-1 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-[#5D6057] shrink-0" />
                          <span>{d.pickup_address}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Action & Availability Status Footer */}
                  <div className="p-4 pt-2 border-t border-[#D8CDBA] flex items-center justify-between text-xs gap-2">
                    <span className="text-[11px] text-[#5D6057] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#74785B]" />
                      <span>{isExpired ? "Expired" : `${hoursLeft > 0 ? hoursLeft.toFixed(1) : 0}h left`}</span>
                    </span>

                    <button
                      onClick={() => onSelectDonation(d)}
                      className="px-3.5 py-1.5 rounded-full bg-[#171914] text-white text-[11px] font-sans font-semibold hover:bg-[#74785B] transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
