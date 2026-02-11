import { Linkedin, ChevronLeft, ChevronRight } from "lucide-react";
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
    linkedIn: "https://www.linkedin.com/in/brian-honda-84808210/",
  },
  {
    name: "Amy Moriarty",
    title: "SVP, Managing Director",
    image: "/images/headshots/amy-moriarty.jpg",
    linkedIn: "https://www.linkedin.com/in/amy-moriarty/",
  },
  {
    name: "Fiona Roossien",
    title: "Vice President, Creative Director",
    image: "/images/headshots/fiona-roossien.png",
    linkedIn: "https://www.linkedin.com/in/fiona-roossien-1b75748/",
  },
  {
    name: "Jai Sharma",
    title: "Vice President, Medical Communications",
    image: "/images/headshots/jai-sharma.png",
    linkedIn: "https://www.linkedin.com/in/jai-sharma-03526a6/",
  },
  {
    name: "Tony Wong",
    title: "Vice President, Digital & Innovation",
    image: "/images/headshots/tony-wong.png",
    linkedIn: "https://www.linkedin.com/in/wongtonyt/",
  },
];

export function LeadershipTeam() {
  const cardsPerPage = 2;
  const totalPages = Math.ceil(teamMembers.length / cardsPerPage);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const handleGoToPage = (page: number) => {
    if (page === currentPage) return;
    setDirection(page > currentPage ? 1 : -1);
    setCurrentPage(page);
  };

  const getCurrentCards = () => {
    const startIndex = currentPage * cardsPerPage;
    return teamMembers.slice(startIndex, startIndex + cardsPerPage);
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

      {/* Mobile Carousel - Two Cards with Navigation */}
      <div className="md:hidden">
        {/* Two Cards with Animation */}
        <div className="relative overflow-hidden mb-6">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentPage}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="grid grid-cols-2 gap-4"
            >
              {getCurrentCards().map((member, idx) => {
                const actualIndex = currentPage * cardsPerPage + idx;
                return renderTeamMemberCard(member, actualIndex);
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls - Below the cards */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrevious}
            className="w-12 h-12 border border-white/20 flex items-center justify-center transition-colors group hover:border-[var(--accent-primary)]"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-6 h-6 transition-colors text-white/60 group-hover:text-[var(--accent-primary)]" />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleGoToPage(idx)}
                className={`h-2 transition-all duration-300 ${
                  idx === currentPage ? "w-8 bg-[var(--accent-primary)]" : "w-2 bg-white/20"
                } ${idx !== currentPage ? "hover:bg-white/40" : ""}`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-12 h-12 border border-white/20 flex items-center justify-center transition-colors group hover:border-[var(--accent-primary)]"
            aria-label="Next page"
          >
            <ChevronRight className="w-6 h-6 transition-colors text-white/60 group-hover:text-[var(--accent-primary)]" />
          </button>
        </div>
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-6">
        {teamMembers.map((member, index) => renderTeamMemberCard(member, index))}
      </div>
    </div>
  );
}
