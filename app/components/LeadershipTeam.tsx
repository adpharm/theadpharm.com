import { Linkedin, ExternalLink } from "lucide-react";
import { GlowBorder } from "./GlowBorder";
import { GlowingBox } from "./GlowingBox";
import { browserTrackEvent } from "~/lib/analytics/events.defaults.client";

interface TeamMember {
  name: string;
  title: string;
  image?: string;
  linkedIn?: string;
}

interface Differentiator {
  title: string;
  href: string;
}

const differentiators: Differentiator[] = [
  {
    title: "Commercial strategy",
    href: "strategy",
  },
  {
    title: "Medical communications",
    href: "medical-communications",
  },
  {
    title: "Digital innovation & AI",
    href: "digital-and-ai",
  },
  {
    title: "Award-winning creative",
    href: "creative",
  },
];

const teamMembers: TeamMember[] = [
  {
    name: "Brian Honda",
    title: "President and Owner",
    image: "/images/headshots/brian-honda.png",
    linkedIn: "https://www.linkedin.com/in/brian-honda-84808210/",
  },
  {
    name: "Amy Moriarty",
    title: "SVP, Managing Director",
    image: "/images/headshots/amy-moriarty.jpg",
    linkedIn: "https://www.linkedin.com/in/amy-moriarty/",
  },
  {
    name: "Jai Sharma",
    title: "SVP, Medical Communications",
    image: "/images/headshots/jai-sharma.webp",
    linkedIn: "https://www.linkedin.com/in/jai-sharma-03526a6/",
  },
  {
    name: "Fiona Roossien",
    title: "Vice President, Creative Director",
    image: "/images/headshots/fiona-roossien.jpeg",
    linkedIn: "https://www.linkedin.com/in/fiona-roossien-1b75748/",
  },
  {
    name: "Tony Wong",
    title: "Vice President, Digital, AI & Innovation",
    image: "/images/headshots/tony-wong.png",
    linkedIn: "https://www.linkedin.com/in/wongtonyt/",
  },
];

export function LeadershipTeam() {
  const handleLeaderClick = (member: TeamMember) => {
    if (!member.linkedIn) return;
    browserTrackEvent("Leader LinkedIn Clicked", { leader_name: member.name });
    window.open(member.linkedIn, "_blank", "noopener,noreferrer");
  };

  const renderTeamMemberCard = (member: TeamMember, index: number) => (
    <GlowBorder key={index}>
      <div
        className={`flex flex-col h-full${member.linkedIn ? " cursor-pointer" : ""}`}
        onClick={() => handleLeaderClick(member)}
      >
        <div className="aspect-[3/4] bg-white/5 relative overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
          />
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-white group-hover:text-[var(--accent-primary)] transition-colors uppercase tracking-wide text-sm">
              {member.name}
            </div>
            <div className="text-white/40 text-xs">
              {(() => {
                const idx = member.title.indexOf(",");
                if (idx === -1) return member.title;
                return (
                  <>
                    {member.title.slice(0, idx + 1)}
                    <br />
                    {member.title.slice(idx + 2)}
                  </>
                );
              })()}
            </div>
          </div>
          {member.linkedIn && (
            <span
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-[var(--accent-primary)] transition-colors mt-3 w-fit"
            >
              <Linkedin className="w-3 h-3" />
              LinkedIn
              <ExternalLink className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </GlowBorder>
  );

  return (
    <div className="mt-10">
      <span className="text-[var(--accent-primary)] tracking-[0.3em] uppercase text-xs">Leadership Team</span>
      <div className="h-px w-32 bg-white/20 mt-4" />
      <h2 className="text-5xl lg:text-6xl tracking-tight uppercase mt-8 mb-12">
        Scientific Rigour.
        <br />
        <span className="text-white/40">Innovation by Design.</span>
      </h2>

      <div className="mb-12 space-y-6 text-white/70 leading-relaxed max-w-4xl">
        <p>
          Our leadership team brings decades of deep-rooted experience across the Canadian healthcare, pharmaceutical,
          and advertising landscapes.
        </p>
        <p>
          Our differentiator is our DNA: we combine the specialized knowledge of multinational pharma veterans with the
          cutting-edge engagement strategies of top-tier consumer brands. By injecting consumer-grade innovation and
          advanced AI into highly regulated spaces, our expertise spans every facet of modern marketing:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-start items-start w-fit">
          {differentiators.map((differentiator, index) => (
            <GlowingBox notched contentPadding="p-4" className="w-72 max-w-[80vw]" key={index}>
              <a href={`/services#${differentiator.href}`} className="relative">
                <div className="flex flex-row justify-start items-center gap-2">
                  <span className="h-2 w-2 rounded-none bg-[var(--accent-primary)] shadow-[0_0_10px_rgba(255,140,0,0.55)]" />
                  <div className="text-base leading-snug">{differentiator.title}</div>
                </div>
                {/* <span className="mt-3 block h-px w-12 bg-gradient-to-r from-[var(--accent-primary)] to-transparent" /> */}
              </a>
            </GlowingBox>
          ))}
        </div>
        <p>
          Armed with deep scientific fluency, we have a proven track record of launching and nurturing products in
          complex therapeutic areas, including oncology, hematology, hepatology, dermatology, and rare diseases. Fusing
          this scientific rigour with data-driven execution, we create compliant, unforgettable experiences that connect
          with HCPs and patients where it matters most.
        </p>
      </div>

      {/* Mobile Grid - 2 columns, all members */}
      <div className="grid grid-cols-2 gap-4 md:hidden">
        {teamMembers.map((member, index) => renderTeamMemberCard(member, index))}
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-6">
        {teamMembers.map((member, index) => renderTeamMemberCard(member, index))}
      </div>
    </div>
  );
}
