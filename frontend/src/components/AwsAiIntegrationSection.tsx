import React, { useState } from "react";
import {
  Sparkles, ShieldCheck, Cpu, ArrowRight, CheckCircle2,
  Zap
} from "lucide-react";

interface AwsAiIntegrationSectionProps {
  onOpenAiMatchTab: () => void;
}

export const AwsAiIntegrationSection: React.FC<AwsAiIntegrationSectionProps> = ({
  onOpenAiMatchTab,
}) => {
  const [activeScenario, setActiveScenario] = useState<"urgent_meals" | "cold_storage" | "bulk_hostel">("urgent_meals");

  const scenarios = {
    urgent_meals: {
      name: "Urgent Cooked Meals",
      donation: "60 Portions Veg Pulao & Dal Makhani (48 kg)",
      donor: "Grand Palace Banquet Hall (Banjara Hills)",
      prepTime: "Prepared 1.5h ago",
      storage: "Ambient (Insulated Steel Containers)",
      deadline: "2.5 hours remaining",
      decision: "APPROVE",
      confidence: "96.4%",
      matchedNgo: "Asha Community Kitchen (2.1 km)",
      hardSafety: "6 / 6 Deterministic Safety Rules Passed",
      bedrockText:
        "Amazon Bedrock: Candidate satisfies proximity (2.1km) and daily intake headroom (215kg remaining). Ambient cooked meal is fresh (1.5h since preparation) and well within the 6-hour safety cutoff. High-priority dispatch recommended.",
      badgeColor: "bg-[#28734D]/10 text-[#28734D] border-[#28734D]/30",
      latencyDecider: "14.2 ms",
      latencyBedrock: "182 ms",
    },
    cold_storage: {
      name: "Chilled Dairy Surplus",
      donation: "25 kg Fresh Paneer Blocks & Curd Cans",
      donor: "TechNova Campus Cafeteria (HITEC City)",
      prepTime: "Chilled 2h ago",
      storage: "Refrigerated (4°C Active Cold Chain)",
      deadline: "5.0 hours remaining",
      decision: "APPROVE",
      confidence: "91.8%",
      matchedNgo: "Asha Community Kitchen (Equipped with Walk-in Chiller)",
      hardSafety: "Cold-Storage Facility Enforced; Unrefrigerated NGOs Safely Bypassed",
      bedrockText:
        "Amazon Bedrock: Enforced deterministic storage constraint. Hope Care Food Bank lacked refrigerated storage and was safely excluded. Asha Community Kitchen has verified cold storage capacity and is matched with 91.8% confidence.",
      badgeColor: "bg-[#28734D]/10 text-[#28734D] border-[#28734D]/30",
      latencyDecider: "12.8 ms",
      latencyBedrock: "165 ms",
    },
    bulk_hostel: {
      name: "High-Volume Mess Batch",
      donation: "140 Portions Rice, Sambar & Dal (75 kg)",
      donor: "Gachibowli Student Hostel Mess",
      prepTime: "Prepared 2h ago",
      storage: "Ambient (Food Grade Stainless Drums)",
      deadline: "3.0 hours remaining",
      decision: "HUMAN_REVIEW",
      confidence: "74.2%",
      matchedNgo: "Hope Care Food Bank (Capacity buffer marginal)",
      hardSafety: "Flagged: Quantity exceeds 60% of single recipient remaining daily capacity",
      bedrockText:
        "Amazon Bedrock: High-volume batch (75kg) will consume 68% of recipient's remaining daily capacity. Strands Decider 2B automatically escalated to Human Dispatch Supervisor for van split confirmation.",
      badgeColor: "bg-[#B7791F]/10 text-[#B7791F] border-[#B7791F]/30",
      latencyDecider: "16.1 ms",
      latencyBedrock: "194 ms",
    },
  };

  const current = scenarios[activeScenario];

  return (
    <section className="py-16 sm:py-20 bg-[#F3EEE4] border-y border-[#D8CDBA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8E2D5] text-[#171914] border border-[#D8CDBA] text-xs font-sans font-medium uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-[#74785B]" />
            <span>AWS AI & Strands Agents Integration</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#171914] tracking-tight">
            How Aahuti Matches Surplus Food in Real-Time
          </h2>

          <p className="text-sm sm:text-base font-sans text-[#5D6057] leading-relaxed">
            Surplus food cannot wait. We combine <strong className="text-[#171914]">Strands Agents</strong> for multi-signal orchestration, the <strong className="text-[#171914]">Strands Decider 2B model</strong> for deterministic policy safety, and <strong className="text-[#171914]">Amazon Bedrock</strong> for plain-language operational handover explanations.
          </p>
        </div>

        {/* 3 Pillars Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1 */}
          <div className="bg-white p-7 rounded-3xl border border-[#D8CDBA] shadow-2xs hover:shadow-card transition-all duration-300 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-[#F3EEE4] border border-[#D8CDBA] flex items-center justify-center text-[#171914]">
                <Zap className="w-5 h-5 text-[#74785B]" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#5D6057]">Step 1 · Orchestration</span>
                <h3 className="text-lg font-serif font-bold text-[#171914]">
                  Strands Agent Coordinator
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-sans text-[#5D6057] leading-relaxed">
                Continuously monitors donation events from banquet halls, college canteens, and restaurants. Computes real-time proximity matrices, intake hours, and transit deadlines across active partner kitchens.
              </p>
            </div>

            <div className="pt-3 border-t border-[#D8CDBA] flex items-center justify-between text-xs font-sans font-semibold text-[#171914]">
              <span>Telemetry Ingestion</span>
              <span className="text-[11px] bg-[#E8E2D5] text-[#171914] px-2 py-0.5 rounded-md font-mono">Real-Time</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-7 rounded-3xl border border-[#D8CDBA] shadow-2xs hover:shadow-card transition-all duration-300 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-[#A65F43]/10 border border-[#A65F43]/20 flex items-center justify-center text-[#A65F43]">
                <ShieldCheck className="w-5 h-5 text-[#A65F43]" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#A65F43]">Step 2 · Safety Classification</span>
                <h3 className="text-lg font-serif font-bold text-[#171914]">
                  Strands Decider 2B + Safety Engine
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-sans text-[#5D6057] leading-relaxed">
                Zero-hallucination deterministic gatekeeper. Validates 6 un-overridable food safety rules (refrigeration match, cooked food &lt;6h, NGO verification, capacity limits) and scores decisions (<span className="font-mono text-[#171914]">APPROVE / REVIEW / REJECT</span>).
              </p>
            </div>

            <div className="pt-3 border-t border-[#D8CDBA] flex items-center justify-between text-xs font-sans font-semibold text-[#171914]">
              <span>Deterministic Enforcement</span>
              <span className="text-[11px] bg-[#A65F43]/10 text-[#A65F43] font-mono px-2 py-0.5 rounded-md">100% Policy Pass</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-7 rounded-3xl border border-[#D8CDBA] shadow-2xs hover:shadow-card transition-all duration-300 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-[#74785B]/10 border border-[#74785B]/20 flex items-center justify-center text-[#74785B]">
                <Sparkles className="w-5 h-5 text-[#74785B]" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#74785B]">Step 3 · Generative Explanation</span>
                <h3 className="text-lg font-serif font-bold text-[#171914]">
                  Amazon Bedrock (Claude 3 / Titan)
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-sans text-[#5D6057] leading-relaxed">
                Converts raw policy evaluations into plain-language handover briefs for dispatchers, drivers, and shelter coordinators. Explains why a match was chosen and produces verified pickup custody slips.
              </p>
            </div>

            <div className="pt-3 border-t border-[#D8CDBA] flex items-center justify-between text-xs font-sans font-semibold text-[#171914]">
              <span>Natural-Language Rationale</span>
              <span className="text-[11px] bg-[#E8E2D5] text-[#171914] font-mono px-2 py-0.5 rounded-md">boto3 Bedrock</span>
            </div>
          </div>

        </div>

        {/* Interactive Live Scenario Simulator */}
        <div className="bg-white rounded-3xl border border-[#D8CDBA] shadow-card overflow-hidden">
          
          {/* Simulator Bar */}
          <div className="bg-[#171914] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-[#D8CDBA] mb-1">
                <Cpu className="w-4 h-4 text-[#D8CDBA]" />
                <span>Interactive Policy Simulator</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-normal">
                Simulate Live Strands Decider 2B & Bedrock Matching
              </h3>
              <p className="text-xs text-[#D8CDBA]/80 mt-0.5 font-sans">
                Select an operational food scenario below to see how our AI evaluates constraints:
              </p>
            </div>

            {/* Scenario Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {(["urgent_meals", "cold_storage", "bulk_hostel"] as const).map((scKey) => (
                <button
                  key={scKey}
                  onClick={() => setActiveScenario(scKey)}
                  className={`px-3.5 py-2 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer ${
                    activeScenario === scKey
                      ? "bg-[#74785B] text-white shadow-xs font-bold"
                      : "bg-white/10 hover:bg-white/20 text-white/90"
                  }`}
                >
                  {scenarios[scKey].name}
                </button>
              ))}
            </div>
          </div>

          {/* Simulator Results Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Donation State */}
              <div className="lg:col-span-5 space-y-4 bg-[#F3EEE4] p-5 rounded-2xl border border-[#D8CDBA]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#5D6057]">
                    Incoming Donation Telemetry
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#E8E2D5] text-[#171914]">
                    Input State
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-[#171914] font-sans">
                  <div>
                    <span className="text-[#5D6057] block text-[11px]">Surplus Title</span>
                    <strong className="text-sm font-semibold">{current.donation}</strong>
                  </div>
                  <div>
                    <span className="text-[#5D6057] block text-[11px]">Donor Facility</span>
                    <span>{current.donor}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#D8CDBA]">
                    <div>
                      <span className="text-[#5D6057] block text-[11px]">Storage Req.</span>
                      <span className="font-semibold">{current.storage}</span>
                    </div>
                    <div>
                      <span className="text-[#5D6057] block text-[11px]">Pickup Urgency</span>
                      <span className="font-semibold text-[#A65F43]">{current.deadline}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#D8CDBA] flex items-center justify-between text-[11px] text-[#5D6057] font-medium font-sans">
                  <span>Prepared: {current.prepTime}</span>
                  <span className="text-[#28734D] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Fresh
                  </span>
                </div>
              </div>

              {/* Right Column: AI Model Output */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#5D6057]">
                      Decider 2B Classification:
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-sans font-bold border ${current.badgeColor}`}>
                      {current.decision} ({current.confidence})
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-[#5D6057] font-mono">
                    <span>Decider: {current.latencyDecider}</span>
                    <span>•</span>
                    <span>Bedrock: {current.latencyBedrock}</span>
                  </div>
                </div>

                {/* Matched Recipient */}
                <div className="p-3.5 rounded-xl bg-[#E8E2D5] border border-[#D8CDBA] text-xs flex items-center justify-between font-sans">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#74785B] shrink-0" />
                    <div>
                      <span className="text-[11px] text-[#74785B] font-semibold block">Target Recommended NGO</span>
                      <strong className="text-[#171914] text-xs">{current.matchedNgo}</strong>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#74785B] uppercase tracking-wider">Top Match</span>
                </div>

                {/* Hard Safety Engine Verification */}
                <div className="p-3.5 rounded-xl bg-white border border-[#D8CDBA] text-xs space-y-1 font-sans">
                  <div className="flex items-center gap-2 text-[#171914] font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#74785B]" />
                    <span>Deterministic Policy Safety Gate</span>
                  </div>
                  <p className="text-[11px] text-[#5D6057] pl-6">
                    {current.hardSafety}
                  </p>
                </div>

                {/* Amazon Bedrock Generated Explanation */}
                <div className="p-4 rounded-xl bg-[#F3EEE4] border border-[#D8CDBA] text-xs space-y-1.5 font-sans">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#171914]">
                    <Sparkles className="w-3.5 h-3.5 text-[#A65F43]" />
                    <span>Amazon Bedrock Generated Dispatch Explanation:</span>
                  </div>
                  <p className="text-xs text-[#171914] leading-relaxed pl-5 font-normal">
                    {current.bedrockText}
                  </p>
                </div>

              </div>

            </div>

            {/* Bottom Call to Action */}
            <div className="pt-4 border-t border-[#D8CDBA] flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
              <span className="text-xs text-[#5D6057]">
                Want to evaluate your own surplus donations with live model weights?
              </span>
              <button
                onClick={onOpenAiMatchTab}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#171914] text-white text-xs font-semibold hover:bg-[#74785B] transition-all shadow-xs cursor-pointer active:scale-[0.98]"
              >
                <span>Launch Interactive AI Match Lab</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
