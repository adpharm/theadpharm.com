import { TrendingUp, Users, Lightbulb, Target } from "lucide-react";
import { PhysicianTimeChart } from "~/components/PhysicianTimeChart";

export interface Insight {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  color: string;
  description: string;
  image?: boolean;
  fullContent: React.ReactNode;
}

export const insights: Insight[] = [
  {
    icon: TrendingUp,
    title: "More than just numbers",
    color: "from-[var(--accent-primary)]/20 to-transparent",
    description:
      "Data tells a story, but insight reveals the narrative. We transform analytics into actionable intelligence, connecting dots others don't see.",
    fullContent: (
      <>
        <h3 className="text-2xl font-bold mb-4 text-white">But can data be emotional?</h3>
        <p className="mb-4">Absolutely.</p>
        <p className="mb-4">
          Emotion comes from being able to hit on a truth—so what really matters to our patients is true to all humans,
          and it can't be reduced to a simple activity like gardening or a downward dog.
        </p>
        <p className="mb-4">
          And even if those things were what mattered most, they get us into a PAAB predicament because PAAB will want
          to see QoL or ADL data and, even if we have it, suddenly we're not talking about OS anymore.
        </p>
        <p>
          But I would argue that those things aren't what matters most to patients, to people—there's one thing for
          which they would give up everything to have more time with.
        </p>
      </>
    ),
  },
  {
    icon: Users,
    title: "Physicians are people too",
    color: "from-[var(--accent-primary)]/20 to-transparent",
    image: true,
    description:
      "Beyond the white coat lies human complexity. We unlock the 44% of their day spent in 'blue jeans' moments for deeper brand connection.",
    fullContent: (
      <div className="flex flex-col gap-8 justify-center items-start">
        <div className="">
          <p className="mb-4">
            In Canada, historically there has been no way to target HCPs consistently across apps and domains. As a
            result, most marketing has been limited to reaching physicians only in their "white coat" moments, when they
            are practicing in a professional capacity.
          </p>
          <p className="mb-4">
            But the reality is that their professional time is fragmented across patient care, admin work, and internal
            meetings, leaving little space for focused engagement.
          </p>
          <p className="mb-4">
            Our targeting changes that. We compliantly unlock the 44% of their day spent in "blue jeans" moments, when
            they're online as people, not practitioners—making them more open to awareness messaging and brand
            connection.
          </p>
        </div>

        <PhysicianTimeChart />
      </div>
    ),
  },
  {
    icon: Lightbulb,
    title: "Innovative copywriting: Beyond the straight line",
    color: "from-[var(--accent-primary)]/20 to-transparent",
    description:
      "In regulated environments, we defend strategic intention while maintaining compliance. Clear beats clever. Meaning never compromises.",
    fullContent: (
      <>
        <p className="mb-4">
          In the regulated environment, our approach to copywriting is inherently lateral, not linear. When PAAB
          delivers a curveball, our first step is to defend the original strategic intention—ensuring that meaning is
          never compromised.
        </p>
        <p className="mb-4">
          We do not revise simply for cleverness; we revise to maintain the essential synergy between the headline and
          the visual, recognizing that the visual must powerfully amplify the core message, not just occupy space. If a
          brilliant line loses its meaning, it fails the brand.
        </p>
        <p className="mb-4">
          We hold this truth:{" "}
          <strong>
            It is always better to be clear than to be clever, and better to start over than to compromise the idea's
            integrity.
          </strong>
        </p>
        <p>This discipline guarantees our copy is not only compliant but strategically powerful.</p>
      </>
    ),
  },
  {
    icon: Target,
    title: "Strategic targeting",
    color: "from-[var(--accent-primary)]/20 to-transparent",
    description:
      "New access to HCPs via Google, consented audiences, and CIHI data layering. We focus investment where biomarker-driven decisions are made.",
    fullContent: (
      <>
        <h3 className="text-xl font-bold mb-3 text-white">New access to HCPs via Google</h3>
        <p className="mb-4">
          Historically, Google's ad rules have blocked sensitive health interest categories from being used for
          targeting. That hasn't changed—but in May, Google clarified that these restrictions no longer apply to
          campaigns targeting licensed healthcare professionals in their professional capacity.
        </p>
        <p className="mb-6">
          This change took effect in July 2025, allowing us to use GSK's first-party data to target GYN-ONCs and
          MED-ONCs on Google with search, video and display content.
        </p>

        <h3 className="text-xl font-bold mb-3 text-white">Consented HCP audiences</h3>
        <p className="mb-6">
          In addition to the changes with Google, Adpharm has partnered with a new digital data partner that specializes
          in HCP audience targeting. This partnership allows us to compliantly target Canadian HCPs who have consented
          to advertising and have been validated as a healthcare professional by a provincial college registry, IQVIA,
          OneKey, or MDSelect, bringing new HCPs into GSK's ecosystem.
        </p>

        <h3 className="text-xl font-bold mb-3 text-white">Layering in data to improve targeting effectiveness</h3>
        <p>
          Using Canadian Institute for Health Information (CIHI) data on MMR/MSI biomarker testing, we know that both
          testing and downstream treatment decisions are concentrated in large urban tertiary cancer centres. By
          targeting specialists in these centres and layering in Tier 1 FSA (postal code) clusters, we focus investment
          where biomarker-driven decisions are actually made and significantly increase campaign relevance.
        </p>
      </>
    ),
  },
];
