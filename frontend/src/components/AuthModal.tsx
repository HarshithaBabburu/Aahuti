import React, { useState } from "react";
import {
  X, UserCheck, ShieldCheck, ArrowRight, Building, Sparkles,
  Eye, EyeOff, Lock, Mail, CheckCircle2, Store, HeartHandshake,
  ChevronDown, KeyRound
} from "lucide-react";
import { DEMO_USERS } from "../types";
import type { UserProfile } from "../types";
import { AahutiLogo } from "./AahutiLogo";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");
  
  // Sign in state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoLogins, setShowDemoLogins] = useState(false);

  // Register state
  const [regName, setRegName] = useState("");
  const [regEntity, setRegEntity] = useState("");
  const [regRole, setRegRole] = useState<"donor" | "ngo">("donor");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Check if matches demo user email
      const matched = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === signInEmail.toLowerCase().trim()
      );
      if (matched) {
        onSelectUser(matched);
        onClose();
      } else {
        // Fallback: create dynamic session for credentials
        const newSession: UserProfile = {
          id: `usr_${Date.now()}`,
          name: signInEmail.split("@")[0] || "Active Member",
          role: "donor",
          entityName: "Partner Organization",
          entityType: "donor",
          address: "Hyderabad Central, Telangana",
          phone: "+91 98000 00000",
          email: signInEmail || "user@aahuti.org",
        };
        onSelectUser(newSession);
        onClose();
      }
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEntity.trim()) {
      setAuthError("Please fill in all required fields.");
      return;
    }
    const newUser: UserProfile = {
      id: `custom_${Date.now()}`,
      name: regName,
      role: regRole,
      entityName: regEntity,
      entityType: regRole === "donor" ? "restaurant" : "community_kitchen",
      address: regAddress || "Hyderabad, Telangana",
      phone: "+91 98000 12345",
      email: regEmail || `${regName.toLowerCase().replace(/\s+/g, "")}@aahuti-partner.org`,
      isVerified: regRole === "ngo",
    };
    onSelectUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171914]/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#F3EEE4] w-full max-w-md rounded-3xl border border-[#D8CDBA] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#74785B] px-6 py-5 text-[#F3EEE4] flex items-center justify-between border-b border-[#5F634A]/40">
          <div className="flex items-center gap-3">
            <AahutiLogo size="sm" theme="dark" showTagline={false} />
            <div>
              <h3 className="text-base font-bold font-display leading-tight text-white">
                Aahuti Account Portal
              </h3>
              <p className="text-xs text-[#E8E2D5]">
                Aahuti — Every offering matters.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 transition-colors text-white/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#D8CDBA] px-6 pt-3 bg-white">
          <button
            onClick={() => {
              setActiveTab("signin");
              setAuthError("");
            }}
            className={`pb-3 px-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === "signin"
                ? "border-[#74785B] text-[#74785B]"
                : "border-transparent text-[#5D6057] hover:text-[#171914]"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab("register");
              setAuthError("");
            }}
            className={`pb-3 px-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === "register"
                ? "border-[#74785B] text-[#74785B]"
                : "border-transparent text-[#5D6057] hover:text-[#171914]"
            }`}
          >
            Register Partner Organization
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 bg-[#F3EEE4]/60">
          {authError && (
            <div className="p-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              {authError}
            </div>
          )}

          {activeTab === "signin" ? (
            <div className="space-y-5">
              
              {/* Primary Email / Password Form */}
              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5D6057] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#74785B] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="organization@aahuti.org"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#D8CDBA] bg-white focus:outline-none focus:border-[#74785B] text-[#171914] shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5D6057]">
                      Password
                    </label>
                    <span className="text-[11px] text-[#74785B] hover:underline cursor-pointer">
                      Forgot?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#74785B] absolute left-3 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2.5 text-xs rounded-xl border border-[#D8CDBA] bg-white focus:outline-none focus:border-[#74785B] text-[#171914] shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#5D6057] hover:text-[#171914]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 mt-1 bg-[#74785B] hover:bg-[#5F634A] text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? "Authenticating..." : "Sign In to Aahuti"}
                </button>
              </form>

              {/* Discreet, Collapsible Demo Credentials Drawer */}
              <div className="pt-3 border-t border-[#D8CDBA]">
                <button
                  type="button"
                  onClick={() => setShowDemoLogins(!showDemoLogins)}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#F3EEE4] border border-[#D8CDBA] flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5 text-[#A65F43]" />
                    <span className="text-xs font-bold text-[#171914]">
                      Demo Accounts (1-Click Switch)
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#5D6057] transition-transform duration-200 ${
                    showDemoLogins ? "rotate-180" : ""
                  }`} />
                </button>

                {showDemoLogins && (
                  <div className="mt-2 space-y-1.5 p-2 rounded-2xl bg-white border border-[#D8CDBA] animate-fade-in">
                    <p className="text-[11px] text-[#5D6057] px-1 pb-1">
                      Click any verified role below to switch active session:
                    </p>
                    {DEMO_USERS.map((user) => {
                      const isSelected = currentUser.id === user.id;
                      return (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            onSelectUser(user);
                            onClose();
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? "border-[#74785B] bg-[#E8E2D5]/60 font-bold"
                              : "border-[#D8CDBA] hover:bg-[#F3EEE4]"
                          }`}
                        >
                          <div>
                            <span className="font-semibold text-[#171914] block line-clamp-1">
                              {user.entityName}
                            </span>
                            <span className="text-[10px] text-[#74785B] uppercase tracking-wider font-bold">
                              {user.role === "donor" ? "Donor Partner" : user.role === "ngo" ? "Verified NGO Kitchen" : "Dispatcher"}
                            </span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#74785B] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5D6057] mb-2">
                  Organization Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegRole("donor")}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      regRole === "donor"
                        ? "border-[#74785B] bg-[#E8E2D5]/60 text-[#74785B] font-bold ring-1 ring-[#74785B]"
                        : "border-[#D8CDBA] bg-white text-[#171914] hover:bg-[#F3EEE4]"
                    }`}
                  >
                    <Store className="w-5 h-5 mx-auto mb-1 text-[#74785B]" />
                    <span className="text-xs">Food Donor</span>
                    <p className="text-[10px] text-[#5D6057] font-normal mt-0.5">Banquet, Hostel, Hotel</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole("ngo")}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      regRole === "ngo"
                        ? "border-[#74785B] bg-[#E8E2D5]/60 text-[#74785B] font-bold ring-1 ring-[#74785B]"
                        : "border-[#D8CDBA] bg-white text-[#171914] hover:bg-[#F3EEE4]"
                    }`}
                  >
                    <HeartHandshake className="w-5 h-5 mx-auto mb-1 text-[#74785B]" />
                    <span className="text-xs">NGO Partner</span>
                    <p className="text-[10px] text-[#5D6057] font-normal mt-0.5">Shelter, Community Kitchen</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#171914] mb-1">
                  Representative Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Anand Varma"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D8CDBA] bg-white focus:outline-none focus:border-[#74785B] text-[#171914]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#171914] mb-1">
                  Organization / Entity Name *
                </label>
                <input
                  type="text"
                  required
                  value={regEntity}
                  onChange={(e) => setRegEntity(e.target.value)}
                  placeholder="e.g. Hyderabad Catering Co or Seva Shelter"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D8CDBA] bg-white focus:outline-none focus:border-[#74785B] text-[#171914]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#171914] mb-1">
                  Work Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="contact@aahuti.org"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D8CDBA] bg-white focus:outline-none focus:border-[#74785B] text-[#171914]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#171914] mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? "text" : "password"}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full pl-3 pr-9 py-2 text-xs rounded-xl border border-[#D8CDBA] bg-white focus:outline-none focus:border-[#74785B] text-[#171914]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-2.5 text-[#5D6057] hover:text-[#171914]"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#171914] mb-1">
                  Facility Address / Locality
                </label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="Banjara Hills, Hyderabad"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D8CDBA] bg-white focus:outline-none focus:border-[#74785B] text-[#171914]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-[#74785B] hover:bg-[#5F634A] text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                Register & Start Sacred Offerings
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
