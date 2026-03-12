import { useState } from "react";
import { Send } from "lucide-react";
import { StyledButton } from "../StyledButton";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // You can add your form submission logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-[var(--bg-base)] p-6 md:p-8 border border-white/10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="block text-xs text-white/40 tracking-wider uppercase mb-2">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
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
            value={formData.organization}
            onChange={handleChange}
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
            value={formData.email}
            onChange={handleChange}
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
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="bg-transparent border-white/20 px-4 md:px-6 py-3 md:py-4 text-white placeholder-white/30 focus-visible:border-[var(--accent-primary)] resize-none min-h-[150px]"
            placeholder="Tell us about your project..."
          />
        </div>

        <StyledButton type="submit" icon={Send} className="w-full justify-center">
          Send Message
        </StyledButton>
      </form>
    </div>
  );
}
