import { useState } from "react";
import { Send } from "lucide-react";
import { StyledButton } from "../StyledButton";

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
    <div className="bg-[var(--bg-base)] p-8 border border-white/10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-xs text-white/40 tracking-wider uppercase mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-transparent border border-white/20 px-6 py-4 text-white placeholder-white/30 focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="organization" className="block text-xs text-white/40 tracking-wider uppercase mb-2">
            Organization
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            required
            className="w-full bg-transparent border border-white/20 px-6 py-4 text-white placeholder-white/30 focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
            placeholder="Your organization"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs text-white/40 tracking-wider uppercase mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-transparent border border-white/20 px-6 py-4 text-white placeholder-white/30 focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-xs text-white/40 tracking-wider uppercase mb-2">
            How may we help?
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full bg-transparent border border-white/20 px-6 py-4 text-white placeholder-white/30 focus:border-[var(--accent-primary)] focus:outline-none transition-colors resize-none"
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
