import { Linkedin, MapPin } from "lucide-react";
import { Spacer } from "./misc/spacer";
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
    linkedIn: "#", // Replace with actual LinkedIn URL
  },
  {
    name: "Amy Moriarty",
    title: "SVP, Managing Director",
    linkedIn: "#", // Replace with actual LinkedIn URL
  },
  {
    name: "Fiona Roossien",
    title: "Vice President, Creative Director",
    linkedIn: "#", // Replace with actual LinkedIn URL
  },
  {
    name: "Jai Sharma",
    title: "Vice President, Medical Communications",
    linkedIn: "#", // Replace with actual LinkedIn URL
  },
  {
    name: "Tony Wong",
    title: "Vice President, Digital & Innovation",
    linkedIn: "#", // Replace with actual LinkedIn URL
  },
];

export function LeadershipTeam() {
  return (
    <div className="mt-24">
      <h3 className="text-2xl tracking-tight uppercase mb-12 mt-0 text-center">Leadership Team</h3>

      {/* Carousel Container */}
      <div className="relative">
        {/* Grid Layout for Leadership Team */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 overflow-hidden">
          {teamMembers.map((member, index) => (
            <GlowBorder key={index}>
              <div className="flex flex-col h-full">
                {/* Image Placeholder */}
                <div className="aspect-[3/4] bg-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-base)]" />
                  <div className="absolute inset-0 flex items-center justify-center text-white/20">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  {/* LinkedIn Button - always visible on mobile, hover on desktop */}
                  <a
                    href={member.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 w-8 h-8 bg-[var(--bg-base)]/80 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>

                {/* Member Info */}
                <div className="p-4 space-y-1 flex-1">
                  <div className="text-white group-hover:text-[var(--accent-primary)] transition-colors uppercase tracking-wide text-sm">
                    {member.name}
                  </div>
                  <div className="text-white/40 text-xs">{member.title}</div>
                </div>
              </div>
            </GlowBorder>
          ))}
        </div>
      </div>

      <Spacer size="lg" />

      <div className="group relative border border-white/10 hover:border-[var(--accent-primary)]/30 transition-all duration-500 overflow-hidden">
        <img src="/images/full-group-photo-bw.png" alt="Gray BG Group Photo" className="w-full h-auto object-cover" />

        {/* Tint Overlay on Hover */}
        <div className="absolute inset-0 bg-[var(--bg-black)]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--bg-base)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-2 text-white">
            <span className="text-xl">
              <MapPin className="w-4 h-4" />
            </span>
            <span className="text-sm tracking-wide">2025, Office Christmas Party</span>
          </div>
        </div>
      </div>
    </div>
  );
}
