import { LeadershipTeam } from "./LeadershipTeam";

export function LeadershipSection() {
  return (
    <section className="relative py-12 lg:py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <LeadershipTeam />
      </div>
    </section>
  );
}
