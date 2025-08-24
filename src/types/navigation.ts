// Breadcrumb segment interface
export interface BreadcrumbSegment {
  name: string;
  href: string;
}

// Page name mapping for breadcrumbs
export const PAGE_NAME_MAP: Record<string, string> = {
  about: "About",
  markets: "Markets",
  careers: "Careers",
  contact: "Contact Us",
  "request-a-quote": "Request a Quote",
  "part-number-builders": "Part Number Builders",
  glossary: "Glossary",
  "knowledge-base": "Knowledge Base",
  "health-safety": "Health & Safety",
  leadership: "Leadership",
  partnerships: "Partnerships",
  "n1-max-calculator": "N1 Max Calculator",
  "thank-you": "Thank You",
  "tape-wrapped-litz-wire": "Tape-Wrapped Litz Wire",
};

// Known materials for product filtering
export const KNOWN_MATERIALS = ["ETFE", "FEP", "PFA", "TCA"] as const;
export type KnownMaterial = typeof KNOWN_MATERIALS[number];
