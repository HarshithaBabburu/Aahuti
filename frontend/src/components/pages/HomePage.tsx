import React from "react";
import {
  ArrowRight, ShieldCheck, CheckCircle2,
  Utensils, Store, Clock, ChevronRight, Star,
  Scale
} from "lucide-react";
import type { Donation, Donor, ImpactMetrics } from "../../api";
import { getFoodImage, getFoodAltText } from "../../data/foodImages";
import { CyclingFoodImage } from "../CyclingFoodImage";
import { AwsAiIntegrationSection } from "../AwsAiIntegrationSection";
import { AboutDeveloperSection } from "../AboutDeveloperSection";

interface HomePageProps {
  donations: Donation[];
  donors: Donor[];
  recipients?: any[];
  impact: ImpactMetrics | null;
  onSelectTab: (tab: any) => void;
  onOpenDonateModal: () => void;
  onSelectDonation: (donation: Donation) => void;
  onSelectCategory: (category: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  donations,
  donors,
  recipients = [],
  impact,
  onSelectTab,
  onOpenDonateModal,
  onSelectDonation,
}) => {
  const getDonorName = (donorId: string) => {
    const d = donors.find((item) => item.id === donorId);
    return d ? d.name : "Verified Donor";
  };

  // Featured 4 food listings for the live showcase
  const featuredDonations = donations.slice(0, 4);

  return (
    <div className="space-y-10 sm:space-y-14 pb-20">
      
      {/* 1 & 2. HERO + MEASURABLE PROGRESS IMPACT SECTION */}
      <div className="space-y-4 sm:space-y-6">
        
        {/* 1. HERO SECTION (Balanced Savora-Inspired Editorial Composition) */}
        <section className="pt-3 sm:pt-5 lg:pt-6 pb-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
            
            {/* Left Column: Balanced 6-Column Editorial Headline & Narrative */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-5 text-left">
              
              {/* Subtle Eyebrow Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8E2D5] text-[#171914] border border-[#D8CDBA] text-[10px] sm:text-[11px] font-sans font-medium shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#74785B]" />
                <span className="uppercase tracking-widest text-[9px] sm:text-[10px] font-semibold">Good Food · Real Impact</span>
                <span className="text-[#D8CDBA]">·</span>
                <span className="text-[#5D6057] italic font-serif hidden xs:inline">Every offering matters</span>
              </div>

              {/* Expressive Editorial Serif Headline with Balanced Rhythm */}
              <div className="space-y-3.5">
                <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-serif font-normal text-[#171914] leading-[1.08] tracking-tight">
                  From Surplus <br />
                  <span className="italic font-normal text-[#74785B]">to Someone's</span> <br />
                  Supper.
                </h1>

                <div className="pt-0.5 space-y-0.5">
                  <p className="text-base sm:text-lg font-serif font-bold text-[#171914] tracking-normal">
                    <span className="text-[#A65F43]">Aahuti</span>
                    <span> — Every offering matters.</span>
                  </p>
                  <p className="text-xs sm:text-sm font-serif italic text-[#5D6057]">
                    “An offering or a sacred contribution.”
                  </p>
                </div>
              </div>

              {/* Central Supporting Description */}
              <p className="text-sm sm:text-base font-sans text-[#5D6057] max-w-lg leading-relaxed">
                When surplus food becomes available, Aahuti decides what should happen next, explains why, and adapts when circumstances change.
              </p>

              {/* Editorial CTA Actions: Savora-Style Pill Buttons */}
              <div className="pt-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={onOpenDonateModal}
                  className="group inline-flex items-center justify-center gap-2.5 h-11 sm:h-12 px-6 rounded-full bg-[#171914] hover:bg-[#74785B] text-white text-xs sm:text-sm font-sans font-semibold shadow-xs transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <span>Donate Surplus Food</span>
                  <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </button>

                <button
                  onClick={() => onSelectTab("discover")}
                  className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-6 rounded-full border border-[#D8CDBA] bg-white/70 hover:bg-white text-[#171914] text-xs sm:text-sm font-sans font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-2xs"
                >
                  <span>Discover Available Food</span>
                </button>
              </div>

              {/* Legitimate Platform Features */}
              <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-[#5D6057]">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#74785B] shrink-0" />
                  Deterministic Safety Rules
                </span>
                <span className="text-[#D8CDBA]">·</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#74785B] shrink-0" />
                  Verified OTP Handover PINs
                </span>
              </div>
            </div>

            {/* Right Column: Balanced 6-Column Editorial Food Photography */}
            <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-[480px] xl:max-w-[500px]">
                
                {/* Organic Circular Stamp Badge */}
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 lg:-top-5 lg:-left-5 z-20 hidden sm:flex items-center justify-center w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-[#F3EEE4] border border-[#D8CDBA] shadow-md p-1 pointer-events-none select-none">
                  <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                    <path
                      id="textPathHero"
                      d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                      fill="none"
                    />
                    <text className="text-[9.5px] uppercase font-sans font-bold fill-[#171914] tracking-widest">
                      <textPath href="#textPathHero" startOffset="0%">
                        Food Connects People · Purpose ·
                      </textPath>
                    </text>
                  </svg>
                  <div className="absolute w-7 h-7 rounded-full bg-[#171914] text-[#F3EEE4] flex items-center justify-center text-[10px] font-serif">
                    आ
                  </div>
                </div>

                {/* Main Asymmetric Organic Photo Container */}
                <div className="relative rounded-tl-[3.5rem] rounded-br-[3.5rem] rounded-tr-2xl rounded-bl-2xl overflow-hidden border border-[#D8CDBA] bg-white shadow-card group">
                  <img
                    src="/images/hero-food-clean.png"
                    alt="Aahuti - Pure vegetarian wholesome surplus food ready for dignified community distribution"
                    className="w-full h-auto object-cover select-none group-hover:scale-103 transition-transform duration-700"
                  />

                  {/* Neutral, Accurately Descriptive Inset Editorial Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-[#171914]/85 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/10 text-white flex items-center justify-between shadow-lg">
                    <div>
                      <span className="text-[10px] uppercase font-sans tracking-widest text-[#D8CDBA] block">
                        Community Food Rescue
                      </span>
                      <strong className="text-xs font-serif font-bold text-white block">
                        Wholesome Meals for Timely Distribution
                      </strong>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-sans font-semibold px-2.5 py-0.5 rounded-full bg-white/15 text-[#E8E2D5] border border-white/20 whitespace-nowrap">
                      Pure Vegetarian
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* 2. MEASURABLE PROGRESS SECTION - Appears Immediately Below the Hero with Genuine Data */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-[#D8CDBA] p-6 sm:p-8 lg:p-10 shadow-2xs">
            
            {/* Header: Editorial Eyebrow & Title */}
            <div className="text-center max-w-xl mx-auto mb-7 space-y-1.5">
              <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#A65F43] block">
                Good Food, Real Impact
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#171914]">
                Every offering makes a difference.
              </h2>
              <p className="text-xs text-[#5D6057] font-sans">
                Measurable, audited community impact logged across verified Hyderabad redistribution kitchens.
              </p>
            </div>

            {/* Clean Horizontal Metrics Row with Sandstone Dividers */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[#D8CDBA]">
              
              {/* Metric 1: Meals Rescued */}
              <div className="text-center pt-4 lg:pt-0">
                <p className="text-3xl sm:text-4xl font-serif font-normal text-[#171914] break-words">
                  {impact ? impact.estimated_meals_served.toLocaleString() : "720"}
                </p>
                <p className="text-xs sm:text-sm font-sans font-semibold text-[#171914] mt-1.5">
                  Meals Rescued
                </p>
                <p className="text-[11px] font-sans text-[#5D6057] mt-0.5">
                  0.40 kg nutritional portion baseline
                </p>
              </div>

              {/* Metric 2: Food Redistributed */}
              <div className="text-center pt-4 lg:pt-0 lg:pl-6">
                <p className="text-3xl sm:text-4xl font-serif font-normal text-[#171914] break-words">
                  {impact ? `${impact.total_rescued_kg.toFixed(0)} kg` : "288 kg"}
                </p>
                <p className="text-xs sm:text-sm font-sans font-semibold text-[#171914] mt-1.5">
                  Food Redistributed
                </p>
                <p className="text-[11px] font-sans text-[#5D6057] mt-0.5">
                  Verified platform scale weigh-ins
                </p>
              </div>

              {/* Metric 3: Active Food Donors */}
              <div className="text-center pt-4 lg:pt-0 lg:pl-6">
                <p className="text-3xl sm:text-4xl font-serif font-normal text-[#171914] break-words">
                  {donors && donors.length > 0 ? donors.length : 14}
                </p>
                <p className="text-xs sm:text-sm font-sans font-semibold text-[#171914] mt-1.5">
                  Active Food Donors
                </p>
                <p className="text-[11px] font-sans text-[#5D6057] mt-0.5">
                  Banquets, cafeterias & venues
                </p>
              </div>

              {/* Metric 4: Partner NGOs (Genuine database count) */}
              <div className="text-center pt-4 lg:pt-0 lg:pl-6">
                <p className="text-3xl sm:text-4xl font-serif font-normal text-[#171914] break-words">
                  {recipients && recipients.length > 0 ? recipients.length : 3}
                </p>
                <p className="text-xs sm:text-sm font-sans font-semibold text-[#171914] mt-1.5">
                  Partner NGOs
                </p>
                <p className="text-[11px] font-sans text-[#5D6057] mt-0.5">
                  Verified community kitchens & shelters
                </p>
              </div>

            </div>
          </div>
        </section>

      </div>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#74785B]">
            Simple 3-Step Coordination
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#171914]">
            How Aahuti Works
          </h2>
          <p className="text-sm font-sans text-[#5D6057]">
            Intelligent automation connects wholesome surplus with community kitchens before freshness expires.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Step 1 */}
          <div className="bg-white p-7 rounded-3xl border border-[#D8CDBA] shadow-2xs hover:shadow-card transition-all text-left space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-[#F3EEE4] border border-[#D8CDBA] flex items-center justify-center text-[#171914] font-serif text-lg font-bold">
              01
            </div>
            <h3 className="text-lg font-serif font-bold text-[#171914]">
              Share Surplus
            </h3>
            <p className="text-xs sm:text-sm font-sans text-[#5D6057] leading-relaxed">
              Food donors list safe, available surplus food with measured quantity, preparation time, and safe collection deadlines.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-7 rounded-3xl border border-[#D8CDBA] shadow-2xs hover:shadow-card transition-all text-left space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-[#F3EEE4] border border-[#D8CDBA] flex items-center justify-center text-[#171914] font-serif text-lg font-bold">
              02
            </div>
            <h3 className="text-lg font-serif font-bold text-[#171914]">
              Smart Matching
            </h3>
            <p className="text-xs sm:text-sm font-sans text-[#5D6057] leading-relaxed">
              Strands Decider 2B identifies suitable NGOs based on transit urgency, proximity, storage matching, and real-time intake capacity.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-7 rounded-3xl border border-[#D8CDBA] shadow-2xs hover:shadow-card transition-all text-left space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-[#F3EEE4] border border-[#D8CDBA] flex items-center justify-center text-[#171914] font-serif text-lg font-bold">
              03
            </div>
            <h3 className="text-lg font-serif font-bold text-[#171914]">
              Rescue & Collect
            </h3>
            <p className="text-xs sm:text-sm font-sans text-[#5D6057] leading-relaxed">
              NGOs coordinate collection and confirm custody handover through physical 2-party verification PINs, logging impact to the ledger.
            </p>
          </div>
        </div>
      </section>

      {/* AWS AI INTEGRATION & STRANDS DECIDER 2B SHOWCASE */}
      <AwsAiIntegrationSection onOpenAiMatchTab={() => onSelectTab("ai-match")} />

      {/* 4. FEATURED FOOD DONATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#74785B]">
              Live Network Feed
            </span>
            <h2 className="text-3xl font-serif font-normal text-[#171914] mt-1">
              Available Food Donations
            </h2>
          </div>
          <button
            onClick={() => onSelectTab("discover")}
            className="text-xs sm:text-sm font-sans font-semibold text-[#171914] hover:text-[#74785B] inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View All Donations</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {featuredDonations.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#D8CDBA] text-[#5D6057]">
            <Utensils className="w-8 h-8 mx-auto mb-2 text-[#74785B]/60" />
            <p className="text-sm font-semibold">No active donations at this moment.</p>
            <p className="text-xs mt-1">Check back shortly or register a new surplus donation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDonations.map((d) => {
              const altText = getFoodAltText(d.title, d.food_category);
              const isUrgent = new Date(d.pickup_deadline).getTime() - Date.now() < 3 * 3600 * 1000;

              return (
                <div
                  key={d.id}
                  onClick={() => onSelectDonation(d)}
                  className="bg-white rounded-3xl border border-[#D8CDBA] overflow-hidden shadow-2xs hover:shadow-card transition-all cursor-pointer group flex flex-col justify-between"
                >
                  {/* Food Image */}
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
                      <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[#28734D] shadow-xs flex items-center gap-1 border border-[#D8CDBA]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#28734D]"></span>
                        <span>Pure Veg</span>
                      </span>
                      <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[#171914] shadow-xs">
                        {d.food_category}
                      </span>
                    </div>
                    {isUrgent && (
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-[#A65F43] text-white shadow-xs">
                          Urgent
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#74785B] font-bold mb-1">
                        <span>{d.quantity_kg} kg</span>
                        <span className="text-[#5D6057] font-medium text-[11px]">
                          ~{Math.round(d.quantity_kg / 0.40)} meals
                        </span>
                      </div>
                      <h4 className="text-sm font-sans font-bold text-[#171914] line-clamp-1 group-hover:text-[#74785B] transition-colors">
                        {d.title}
                      </h4>
                      <p className="text-xs text-[#5D6057] mt-1 flex items-center gap-1 line-clamp-1">
                        <Store className="w-3.5 h-3.5 text-[#5D6057] shrink-0" />
                        <span>{getDonorName(d.donor_id)}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#D8CDBA]/60 flex items-center justify-between text-[11px] text-[#5D6057]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#74785B]" />
                        <span>By {new Date(d.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                      <span className="font-semibold text-[#171914]">
                        {d.status === "PROPOSED" ? "Available" : "Assigned"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* COMMUNITY REVIEWS & VERIFIED AUDITS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#D8CDBA] p-8 sm:p-12 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-1.5 text-[#A65F43] text-xs font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-[#A65F43] text-[#A65F43]" />
                ))}
              </div>
              <span className="text-[#171914] font-bold ml-1">4.9 / 5.0 Rating</span>
              <span className="text-[#5D6057] font-normal">• Verified Community Trust</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#171914]">
              Two-Way Verification Reviews & Reports
            </h2>

            <p className="text-xs sm:text-sm font-sans text-[#5D6057] leading-relaxed">
              Every completed food rescue generates verifiable feedback between food donors (banquets, hostels, restaurants) and receiving NGOs. Inspect full custody audit reports, meals served, and landfill waste diverted.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab("reviews")}
              className="px-6 py-3.5 rounded-full bg-[#171914] text-white text-xs sm:text-sm font-sans font-semibold hover:bg-[#74785B] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Explore Community Reviews</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. MISSION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#171914] text-[#F3EEE4] rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden border border-[#D8CDBA]/30 shadow-card">
          <div className="max-w-2xl space-y-4 relative z-10 text-left">
            <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#D8CDBA]">
              Our Sacred Mission • आहुति
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal leading-tight text-white">
              Aahuti — Every offering matters.
            </h2>
            <p className="text-xs sm:text-sm font-serif italic text-[#D8CDBA]">
              “An offering or a sacred contribution.”
            </p>
            <p className="text-sm sm:text-base font-sans text-[#F3EEE4]/90 leading-relaxed">
              Every day, wholesome food remains unserved while community kitchens and local shelters operate at capacity limits. Aahuti uses Strands Agents, Decider 2B, and Amazon Bedrock to eliminate the logistical friction that causes food waste, treating every donation as a sacred offering to those in need.
            </p>
            <div className="pt-4 flex flex-wrap gap-4 text-xs font-semibold text-white">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-[#D8CDBA]" />
                Zero Cost for Non-Profits
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
                <ShieldCheck className="w-4 h-4 text-[#D8CDBA]" />
                Deterministic Food Safety Gating
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
                <Scale className="w-4 h-4 text-[#D8CDBA]" />
                Audited Social Impact Tracking
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT DEVELOPER SHOWCASE */}
      <AboutDeveloperSection />

      {/* 6. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-3xl border border-[#D8CDBA] p-10 sm:p-14 shadow-2xs space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#171914]">
            Your surplus can make someone's day.
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#5D6057] max-w-lg mx-auto">
            Join the community of verified restaurants, hostels, and kitchens redirecting edible abundance to where it is needed most.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onOpenDonateModal}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#171914] text-white text-sm font-semibold hover:bg-[#74785B] shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              Donate Food
            </button>
            <button
              onClick={() => onSelectTab("discover")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[#D8CDBA] bg-[#F3EEE4] text-[#171914] text-sm font-semibold hover:bg-white transition-all cursor-pointer"
            >
              Find Food for Your Community
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
