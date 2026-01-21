export interface Service {
  number: string;
  title: string;
  description: string;
  details: string[];
}

export const services: Service[] = [
  {
    number: "01",
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
    number: "02",
    title: "Creative",
    description:
      "From concept to execution, we craft compelling narratives and visual experiences that resonate across all audiences and channels.",
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
    number: "03",
    title: "Technical Capabilities",
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
    number: "04",
    title: "Medical Communications",
    description:
      "Translating complex science into compelling narratives that resonate with healthcare professionals and drive meaningful engagement.",
    details: [
      "Advisory Boards and Consultancy Meetings",
      "Speaker Training and Development Programs",
      "Online Learning Activities (OLAs) and Accredited Continuing Medical Education (CME)",
      "Symposia, Manuscripts, and Medical Slide Deck Development",
      "Ambassador Programs, Stakeholder Mapping, and Asynchronous Engagements",
    ],
  },
];
