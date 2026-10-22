import React from "react";
import { ShieldCheck, Mail, ArrowUpRight, Sparkles } from "lucide-react";
import { AahutiLogo } from "./AahutiLogo";

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24M7.86 18.5v-8.37H5.07v8.37h2.79z" />
  </svg>
);

interface FooterProps {
  onSelectTab: (tab: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-[#171914] text-[#F3EEE4] pt-16 pb-12 border-t border-[#D8CDBA]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-[#D8CDBA]/20">
          
          {/* Brand & Mission Statement */}
          <div className="md:col-span-5 space-y-4">
            <AahutiLogo theme="dark" size="lg" showWordmark={true} />
            <p className="text-xs font-serif font-medium text-[#D8CDBA] tracking-wide">
              Aahuti (आहुति) — <span className="italic">“An offering or a sacred contribution.”</span>
            </p>
            <p className="text-sm font-sans text-[#F3EEE4]/90 max-w-sm leading-relaxed">
              <strong className="text-white">From Surplus to Someone's Supper. Aahuti — Every offering matters.</strong> When surplus food becomes available, Aahuti decides what should happen next, explains why, and adapts when circumstances change.
            </p>
            <div className="pt-2 flex flex-col gap-1.5 text-xs text-[#D8CDBA]/90 font-sans">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D8CDBA]" />
                <span>FSSAI Food Safety Compliance & Verified NGO Network</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#A65F43]" />
                <span>AWS Bedrock & Strands Agents Decider 2B Autonomous Dispatch</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-[#D8CDBA]">
              Platform
            </h4>
            <ul className="space-y-2 text-sm font-sans text-[#F3EEE4]/85">
              <li>
                <button
                  onClick={() => {
                    onSelectTab("home");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTab("discover");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Discover Available Food
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTab("home");
                    setTimeout(() => {
                      const el = document.getElementById("how-it-works-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTab("impact");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Impact Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTab("reviews");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Reviews & Reports
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTab("ai-match");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  AI Match Lab <ArrowUpRight className="w-3 h-3 text-[#D8CDBA]" />
                </button>
              </li>
            </ul>
          </div>

          {/* Portals & Operations */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-[#D8CDBA]">
              Portals
            </h4>
            <ul className="space-y-2 text-sm font-sans text-[#F3EEE4]/85">
              <li>
                <button
                  onClick={() => onSelectTab("donor-dashboard")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Food Donor Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("ngo-dashboard")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  NGO & Kitchen Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("reviews")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Donation Reports
                </button>
              </li>
            </ul>
          </div>

          {/* About the Developer */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-[#D8CDBA]">
              Creator
            </h4>
            <div className="text-sm font-sans text-[#F3EEE4]/90 space-y-2">
              <p className="font-serif font-bold text-white text-base">
                Harshitha Babburu
              </p>
              
              <p>
                <a
                  href="mailto:harshithababburu@gmail.com"
                  className="inline-flex items-center gap-1.5 text-xs text-[#D8CDBA] hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#A65F43]" />
                  <span>harshithababburu@gmail.com</span>
                </a>
              </p>

              <p>
                <a
                  href="https://www.linkedin.com/in/harshitha-babburu-3b896b37b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#D8CDBA] hover:text-white transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-[#A65F43] fill-current" />
                  <span>LinkedIn Profile</span>
                  <ArrowUpRight className="w-3 h-3 text-[#D8CDBA]" />
                </a>
              </p>

              <p className="text-[11px] text-[#D8CDBA]/70 pt-0.5 leading-snug">
                Lead AI Architect & Full-Stack Developer • Hyderabad
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-[#D8CDBA]/80 gap-4">
          <p>
            © {new Date().getFullYear()} Aahuti (आहुति). Developed with purpose by{" "}
            <a
              href="https://www.linkedin.com/in/harshitha-babburu-3b896b37b"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-bold hover:underline"
            >
              Harshitha Babburu
            </a>.
          </p>
          <div className="flex items-center gap-5 text-[#D8CDBA]/80">
            <a
              href="mailto:harshithababburu@gmail.com"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
            <a
              href="https://www.linkedin.com/in/harshitha-babburu-3b896b37b"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <LinkedinIcon className="w-3.5 h-3.5 fill-current" />
              <span>LinkedIn</span>
            </a>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
