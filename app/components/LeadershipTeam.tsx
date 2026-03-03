import { Linkedin, ExternalLink } from "lucide-react";
import { GlowBorder } from "./GlowBorder";

interface TeamMember {
  name: string;
  title: string;
  image?: string;
  linkedIn?: string;
}

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
    title: "Vice President, Medical Communications",
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
    title: "Vice President, Digital & Innovation",
    image: "/images/headshots/tony-wong.png",
    linkedIn: "https://www.linkedin.com/in/wongtonyt/",
  },
];

export function LeadershipTeam() {
  const renderTeamMemberCard = (member: TeamMember, index: number) => (
    <GlowBorder key={index}>
      <div className="flex flex-col h-full">
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
            <div className="text-white/40 text-xs">{member.title}</div>
          </div>
          {member.linkedIn && (
            <a
              href={member.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-[var(--accent-primary)] transition-colors mt-3"
            >
              <Linkedin className="w-3 h-3" />
              LinkedIn
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </GlowBorder>
  );

  return (
    <div className="mt-10">
      <h3 className="text-2xl tracking-tight uppercase mb-12 mt-0 text-center">Our Leadership Team</h3>

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
