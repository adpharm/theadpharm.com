import { Linkedin, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Spacer } from "./misc/spacer";
import { GlowBorder } from "./GlowBorder";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    linkedIn: "#", // Replace with actual LinkedIn URL
  },
  {
    name: "Amy Moriarty",
    title: "SVP, Managing Director",
    image: "/images/headshots/amy-moriarty.jpg",
    linkedIn: "#", // Replace with actual LinkedIn URL
  },
  {
    name: "Fiona Roossien",
    title: "Vice President, Creative Director",
    image: "/images/headshots/fiona-roossien.png",
    linkedIn: "#", // Replace with actual LinkedIn URL
  },
  {
    name: "Jai Sharma",
    title: "Vice President, Medical Communications",
    image: "/images/headshots/jai-sharma.png",
    linkedIn: "#", // Replace with actual LinkedIn URL
  },
  {
    name: "Tony Wong",
    title: "Vice President, Digital & Innovation",
    image: "/images/headshots/tony-wong.png",
    linkedIn: "#", // Replace with actual LinkedIn URL
  },
];

export function LeadershipTeam() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1));
  };

  const handleGoToCard = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const renderTeamMemberCard = (member: TeamMember, index: number) => (
    <GlowBorder key={index}>
      <div className="flex flex-col h-full">
        {/* Image Placeholder */}
        <div className="aspect-[3/4] bg-white/5 relative overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
          />

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
  );

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="mt-24">
      <h3 className="text-2xl tracking-tight uppercase mb-12 mt-0 text-center">Leadership Team</h3>

      {/* Mobile Carousel - Single Card with Navigation */}
      <div className="md:hidden">
        {/* Single Card with Animation */}
        <div className="relative overflow-hidden mb-6">
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  {renderTeamMemberCard(teamMembers[currentIndex], currentIndex)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Navigation Controls - Below the card */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrevious}
            className="w-12 h-12 border border-white/20 flex items-center justify-center transition-colors group hover:border-[var(--accent-primary)]"
            aria-label="Previous team member"
          >
            <ChevronLeft className="w-6 h-6 transition-colors text-white/60 group-hover:text-[var(--accent-primary)]" />
          </button>

          <div className="flex gap-2">
            {teamMembers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleGoToCard(idx)}
                className={`h-2 transition-all duration-300 ${
                  idx === currentIndex ? "w-8 bg-[var(--accent-primary)]" : "w-2 bg-white/20"
                } ${idx !== currentIndex ? "hover:bg-white/40" : ""}`}
                aria-label={`Go to team member ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-12 h-12 border border-white/20 flex items-center justify-center transition-colors group hover:border-[var(--accent-primary)]"
            aria-label="Next team member"
          >
            <ChevronRight className="w-6 h-6 transition-colors text-white/60 group-hover:text-[var(--accent-primary)]" />
          </button>
        </div>
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-6">
        {teamMembers.map((member, index) => renderTeamMemberCard(member, index))}
      </div>

      <Spacer size="lg" />

      <div>
        <div className="group relative border border-white/10 hover:border-[var(--accent-primary)]/30 transition-all duration-500 overflow-hidden">
          <img src="/images/full-group-photo-bw.png" alt="Gray BG Group Photo" className="w-full h-auto object-cover" />

          {/* Tint Overlay on Hover - Desktop only */}
          <div className="absolute inset-0 bg-[var(--bg-black)]/60 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />

          {/* Caption on Hover - Desktop only */}
          <div className="hidden md:block absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--bg-base)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-2 text-white">
              <span className="text-xl">
                <MapPin className="w-4 h-4" />
              </span>
              <span className="text-sm tracking-wide">2025, Office Christmas Party</span>
            </div>
          </div>
        </div>

        {/* Mobile Caption - Always visible below image */}
        <div className="md:hidden mt-4 px-4">
          <div className="flex justify-center items-center gap-2 text-white/60">
            <MapPin className="w-3 h-3" />
            <span className="text-xs tracking-wide">2025, Office Christmas Party</span>
          </div>
        </div>
      </div>
    </div>
  );
}
