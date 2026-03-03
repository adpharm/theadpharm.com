export interface Service {
  title: string;
  description: string;
  details: string[];
}

export const services: Service[] = [
  {
    title: "Strategy",
    description:
      "Comprehensive market analysis, brand positioning, and campaign architecture designed to penetrate target audiences with surgical precision.",
    details: [
      "Franchise and portfolio planning",
      "Insight generation and creative strategy",
      "Media strategy",
      "Launch, sales and workshop meetings",
      "KOL and stakeholder identification",
    ],
  },
  {
    title: "Creative",
    description:
      "From concept to execution, we craft compelling stories and striking visuals that capture attention and drive results across the channels where your audience spends their time.",
    details: [
      "HCP, Patient, and Consumer Content Development",
      "Regulatory-Compliant Creative (PAAB & ASC Expertise)",
      "Sales Enablement Tools and Marketing Collateral",
      "Booth and Exhibit Design",
      "Corporate Communications and Messaging",
      "Logo and Visual Identity Development",
      "Brand Guidelines and Style Guide Creation",
      "Commercial Print Services (Conference, Sales and Marketing Materials)",
    ],
  },
  {
    title: "Digital & AI",
    description:
      "Cutting-edge digital experiences that merge technological innovation with human-centered design principles.",
    details: [
      "Website and App Design and Development (Full Stack)",
      "Customer Experience (CX), UX, and UI Design and Optimization",
      "CRM Journey Mapping and Development",
      "Email Campaign Design and Deployment",
      "Advanced Analytics and Performance Reporting",
      "AI Tool Design and Development",
      "Personalization & Targeting",
    ],
  },
  {
    title: "Medical Communications",
    description:
      "Translating complex science into clear, compelling narratives that move healthcare professionals to act.",
    details: [
      "Advisory Boards and Consultancy Meetings",
      "Speaker Training and Development Programs",
      "Online Learning Activities (OLAs) and Accredited Continuing Medical Education (CME)",
      "Symposia, Manuscripts, and Medical Slide Deck Development",
      "Ambassador Programs, Stakeholder Mapping, and Asynchronous Engagements",
    ],
  },
];
