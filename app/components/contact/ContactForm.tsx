import { useRef } from "react";
import { useFetcher } from "react-router";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { useLocation } from "react-router";
import { StyledButton } from "../StyledButton";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { browserTrackEvent } from "~/lib/analytics/events.defaults.client";
import type { TrackEvents } from "~/lib/analytics/events.defaults.client";

function getPageSection(pathname: string): TrackEvents["Contact Form Started"]["page_section"] {
  if (pathname.includes("/about")) return "about";
  if (pathname.includes("/services")) return "services";
  if (pathname.includes("/insights")) return "insights";
  return "home";
}

type ContactActionData = { success: true } | { error: string };

export function ContactForm() {
  const location = useLocation();
  const hasTrackedStart = useRef(false);
  const fetcher = useFetcher<ContactActionData>();

  const isSubmitting = fetcher.state === "submitting";
  const isSuccess = fetcher.data && "success" in fetcher.data && fetcher.data.success;
  const errorMessage = fetcher.data && "error" in fetcher.data ? fetcher.data.error : null;

  const handleFirstInteraction = () => {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    browserTrackEvent("Contact Form Started", { page_section: getPageSection(location.pathname) });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    browserTrackEvent("Contact Form Submitted", {
      page_section: getPageSection(location.pathname),
      has_organization: (formData.get("organization") as string)?.trim().length > 0,
    });
  };

  if (isSuccess) {
    return (
      <div className="bg-[var(--bg-base)] p-6 md:p-8 border border-white/10 flex flex-col items-center justify-center gap-4 min-h-[300px] text-center">
        <CheckCircle className="text-[var(--accent-primary)] w-10 h-10" />
        <p className="text-white text-lg font-medium">Message sent!</p>
        <p className="text-white/50 text-sm">We'll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-base)] p-6 md:p-8 border border-white/10">
      <fetcher.Form
        method="post"
        action="/api/contact"
        onSubmit={handleSubmit}
        onFocus={handleFirstInteraction}
        className="space-y-6"
      >
        <div>
          <Label htmlFor="name" className="block text-xs text-white/40 tracking-wider uppercase mb-2">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            required
            className="bg-transparent border-white/20 px-4 md:px-6 py-3 md:py-4 text-white placeholder-white/30 focus-visible:border-[var(--accent-primary)] h-auto"
            placeholder="Your name"
          />
        </div>

        <div>
          <Label htmlFor="organization" className="block text-xs text-white/40 tracking-wider uppercase mb-2">
            Organization
          </Label>
          <Input
            type="text"
            id="organization"
            name="organization"
            required
            className="bg-transparent border-white/20 px-4 md:px-6 py-3 md:py-4 text-white placeholder-white/30 focus-visible:border-[var(--accent-primary)] h-auto"
            placeholder="Your organization"
          />
        </div>

        <div>
          <Label htmlFor="email" className="block text-xs text-white/40 tracking-wider uppercase mb-2">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            required
            className="bg-transparent border-white/20 px-4 md:px-6 py-3 md:py-4 text-white placeholder-white/30 focus-visible:border-[var(--accent-primary)] h-auto"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <Label htmlFor="message" className="block text-xs text-white/40 tracking-wider uppercase mb-2">
            How may we help?
          </Label>
          <Textarea
            id="message"
            name="message"
            required
            rows={6}
            className="bg-transparent border-white/20 px-4 md:px-6 py-3 md:py-4 text-white placeholder-white/30 focus-visible:border-[var(--accent-primary)] resize-none min-h-[150px]"
            placeholder="Tell us about your project..."
          />
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <StyledButton type="submit" icon={Send} className="w-full justify-center" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </StyledButton>
      </fetcher.Form>
    </div>
  );
}
