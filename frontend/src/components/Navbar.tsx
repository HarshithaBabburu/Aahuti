import React, { useState } from "react";
import {
  Sparkles, Menu, X, ArrowRight, Store
} from "lucide-react";
import type { UserProfile } from "../types";
import { AahutiLogo } from "./AahutiLogo";

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: any) => void;
  currentUser: UserProfile;
  onOpenAuth?: () => void;
  onOpenDonateModal: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenDonateModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Primary navigation items
  const primaryNav = [
    { id: "home", label: "Home" },
    { id: "discover", label: "Discover Food" },
    { id: "ai-match", label: "AI Decision Center" },
    { id: "impact", label: "Impact" },
    { id: "reviews", label: "Reviews & Reports" },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F3EEE4]/95 backdrop-blur-md border-b border-[#D8CDBA] transition-all duration-200 shadow-2xs w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-20 gap-2 lg:gap-3 xl:gap-4">
          
          {/* Top-Left Corner: Aahuti (आहुति) Brand Name + Editorial Details */}
          <div
            onClick={() => onSelectTab("home")}
            className="cursor-pointer group flex flex-col justify-center py-1 select-none shrink-0"
          >
            <div className="flex items-center gap-2 xl:gap-2.5">
              <AahutiLogo showWordmark={true} size="md" />
              
              {/* Meaning & Tagline on wide desktop screens */}
              <div className="hidden 2xl:flex flex-col border-l border-[#D8CDBA] pl-2.5">
                <span className="text-[11px] font-sans font-bold text-[#171914] tracking-tight leading-tight whitespace-nowrap">
                  Aahuti — Every offering matters.
                </span>
                <span className="text-[10px] font-serif italic text-[#5D6057] leading-tight whitespace-nowrap">
                  “An offering or a sacred contribution.”
                </span>
              </div>
            </div>

            {/* AWS Technologies Label: Subtle editorial badge */}
            <div className="mt-1 hidden xs:flex items-center">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-sans font-medium bg-[#E8E2D5] text-[#171914] border border-[#D8CDBA] shadow-2xs transition-colors whitespace-nowrap">
                <Sparkles className="w-2.5 h-2.5 text-[#A65F43] shrink-0" />
                <span className="hidden xl:inline">
                  Strands Agents · Decider 2B · Amazon Bedrock
                </span>
                <span className="xl:hidden font-semibold">
                  AWS AI & Strands Decider 2B
                </span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links: Clean, compact navigation with ink-black text */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink min-w-0">
            {primaryNav.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-sans font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "text-white bg-[#74785B] font-semibold shadow-2xs"
                      : "text-[#171914]/80 hover:text-[#171914] hover:bg-[#E8E2D5]/70"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Area: Donor Hub & Donate Food (Savora-style pill with circular arrow) */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3 shrink-0 ml-auto lg:ml-0">
            {/* Donor Hub: Visually Secondary Action */}
            <button
              onClick={() => onSelectTab("donor-dashboard")}
              className={`inline-flex items-center justify-center gap-1.5 h-9.5 lg:h-10 px-3.5 lg:px-4 rounded-full border border-[#D8CDBA] text-[#171914] bg-white/70 hover:bg-white text-xs lg:text-sm font-sans font-semibold whitespace-nowrap shrink-0 transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-2xs ${
                currentTab === "donor-dashboard" ? "bg-[#E8E2D5] border-[#74785B] text-[#74785B]" : ""
              }`}
            >
              <Store className="w-3.5 h-3.5 text-[#74785B] shrink-0" />
              <span className="whitespace-nowrap">Donor Hub</span>
            </button>

            {/* Donate Food: Primary Editorial Action */}
            <button
              onClick={onOpenDonateModal}
              className="group inline-flex items-center justify-center gap-2 h-9.5 lg:h-10 pl-4.5 pr-3.5 rounded-full bg-[#171914] hover:bg-[#74785B] text-white text-xs lg:text-sm font-sans font-semibold whitespace-nowrap shrink-0 shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <span>Donate Food</span>
              <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3 h-3 text-white" />
              </div>
            </button>
          </div>

          {/* Mobile / Tablet Toggle */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              onClick={onOpenDonateModal}
              className="sm:hidden h-8.5 px-3 text-xs font-semibold bg-[#171914] text-white rounded-full shadow-2xs flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>Donate</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#171914] hover:bg-[#E8E2D5] cursor-pointer border border-[#D8CDBA]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#171914]" /> : <Menu className="w-5 h-5 text-[#171914]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D8CDBA] bg-[#F3EEE4] px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
          <div className="space-y-1">
            {primaryNav.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium ${
                  currentTab === link.id
                    ? "bg-[#74785B] text-white font-bold"
                    : "text-[#171914] hover:bg-[#E8E2D5]"
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick("donor-dashboard")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border border-[#D8CDBA] mt-2 ${
                currentTab === "donor-dashboard"
                  ? "bg-[#74785B] text-white"
                  : "text-[#171914] bg-white/70"
              }`}
            >
              <Store className="w-4 h-4 text-[#74785B]" />
              <span>Donor Hub</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonateModal();
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between bg-[#171914] text-white mt-2 shadow-xs cursor-pointer"
            >
              <span>Donate Surplus Food</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
