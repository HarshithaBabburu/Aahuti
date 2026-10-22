import React from "react";
import { Mail, Sparkles, Code2, Award, HeartHandshake, ArrowUpRight } from "lucide-react";

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24M7.86 18.5v-8.37H5.07v8.37h2.79z" />
  </svg>
);

export const AboutDeveloperSection: React.FC = () => {
  const developer = {
    name: "Harshitha Babburu",
    role: "Lead Full-Stack AI Engineer & Creator of Aahuti",
    email: "harshithababburu@gmail.com",
    linkedin: "https://www.linkedin.com/in/harshitha-babburu-3b896b37b",
    bio: "Passionate engineer committed to solving real-world challenges through artificial intelligence and empathetic product design. Developed Aahuti (आहुति) to automate surplus food redistribution between commercial donors and non-profit community kitchens, turning avoidable food waste into dignified meals.",
    skills: [
      "Strands Agents & Decider 2B",
      "Amazon Bedrock GenAI",
      "FastAPI & Python",
      "React & TypeScript",
      "Deterministic Safety Gating",
      "Distributed System Design"
    ]
  };

  return (
    <section id="about-developer-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl border border-[#D8CDBA] p-8 sm:p-12 shadow-2xs relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E8E2D5]/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Avatar & Quick Details */}
          <div className="lg:col-span-4 flex flex-col items-center text-center lg:items-start lg:text-left space-y-4 border-b lg:border-b-0 lg:border-r border-[#D8CDBA] pb-6 lg:pb-0 lg:pr-8">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#171914] via-[#74785B] to-[#A65F43] flex items-center justify-center text-white text-3xl font-serif font-bold shadow-card">
                HB
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-2xl shadow-xs border border-[#D8CDBA]">
                <Code2 className="w-5 h-5 text-[#74785B]" />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#171914] bg-[#E8E2D5] px-2.5 py-0.5 rounded-full border border-[#D8CDBA]">
                Developer & Creator
              </span>
              <h3 className="text-2xl font-serif font-normal text-[#171914] mt-2">
                {developer.name}
              </h3>
              <p className="text-xs font-sans text-[#5D6057] font-medium mt-0.5">
                {developer.role}
              </p>
            </div>

            {/* Direct Connect Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2 w-full">
              <a
                href={developer.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#171914] hover:bg-[#74785B] text-white text-xs font-sans font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-[0.98]"
              >
                <LinkedinIcon className="w-4 h-4 fill-white" />
                <span>LinkedIn Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
              </a>

              <a
                href={`mailto:${developer.email}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#D8CDBA] bg-[#F3EEE4] hover:bg-white text-[#171914] text-xs font-sans font-semibold transition-all shadow-2xs active:scale-[0.98]"
              >
                <Mail className="w-4 h-4 text-[#74785B]" />
                <span>Email Harshitha</span>
              </a>
            </div>

            <p className="text-[11px] text-[#5D6057] font-mono break-all pt-1">
              {developer.email}
            </p>
          </div>

          {/* Right Column: Bio & Engineering Architecture */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#74785B] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#A65F43]" />
              <span>About the Developer • Harshitha Babburu</span>
            </div>

            <h4 className="text-xl sm:text-2xl font-serif font-normal text-[#171914] leading-snug">
              Building AI Systems with Compassion & Purpose
            </h4>

            <p className="text-sm font-sans text-[#5D6057] leading-relaxed">
              {developer.bio}
            </p>

            <div className="bg-[#F3EEE4] rounded-2xl border border-[#D8CDBA] p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans font-bold text-[#171914] uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#A65F43]" />
                  Technologies Implemented
                </span>
                <span className="text-[11px] font-sans font-semibold text-[#5D6057]">
                  Full-Stack Architecture
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {developer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-sans font-semibold px-3 py-1 rounded-xl bg-white text-[#171914] border border-[#D8CDBA] shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2 text-xs font-sans text-[#5D6057]">
              <HeartHandshake className="w-4 h-4 text-[#74785B] shrink-0" />
              <span>
                Have feedback, collaboration ideas, or inquiries? Reach out via{" "}
                <a
                  href={developer.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#171914] hover:underline"
                >
                  LinkedIn
                </a>{" "}
                or at{" "}
                <a
                  href={`mailto:${developer.email}`}
                  className="font-bold text-[#171914] hover:underline"
                >
                  {developer.email}
                </a>.
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
