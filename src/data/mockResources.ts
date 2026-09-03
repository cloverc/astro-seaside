export type BodySection = {
  heading: string;
  bullets?: string[];
  text?: string;
};

export type Resource = {
  id: string;
  slug: string;
  title: string;
  format: string;
  audience: string;
  resourceType: string;
  topics: string[];
  description: string;
  thumbnail?: string;
  fileUrl?: string;
  fileSize?: string;
  pageCount?: number;
  producedBy?: string[];
  author?: string;
  published?: string;
  location?: string;
  bodySections?: BodySection[];
  usageNote?: string;
};

export const badgeColors: Record<string, string> = {
  "General Public": "bg-teal-600",
  "Heritage Professionals": "bg-blue-600",
  "Academics & Researchers": "bg-purple-700",
};

export const labelColors: Record<string, string> = {
  "General Public": "text-teal-600",
  "Heritage Professionals": "text-blue-600",
  "Academics & Researchers": "text-purple-700",
};

export const resources: Resource[] = [
  {
    id: "12",
    slug: "art-deco-bournemouth-walking-trail",
    title: "Art Deco Bournemouth Walking Trail",
    format: "PDF",
    audience: "General Public",
    resourceType: "Guides & Factsheets",
    topics: [
      "Architecture & design",
      "Seaside history",
      "Tourism & visitor economy",
    ],
    description:
      "A self-guided 1-hour walking tour of Bournemouth's finest interwar Art Deco and Modernist buildings, from the Pavilion Theatre to the former Odeon Cinema.",
    thumbnail: "/images/resources/art-deco-bournemouth-featured.jpg",
    fileSize: "839 KB",
    pageCount: 11,
    producedBy: ["Seaside Heritage Network", "Bournemouth University"],
    published: "March 2026",
    location: "Bournemouth, Dorset",
    bodySections: [
      {
        heading: "What's in the trail",
        bullets: [
          "Twelve stops with a route map, walkable in about an hour",
          "Short notes on each building: architect, date, and what to look for",
          "Archive and present-day photographs for comparison",
          "Notes on which buildings are listed, and what has been lost",
        ],
      },
    ],
    usageNote:
      "Free to download and print for personal, community and educational use. Please credit the Seaside Heritage Network and Bournemouth University. For commercial reuse, or to request the trail in another format, contact us.",
  },
  {
    id: "13",
    slug: "interwar-seaside-architecture-survey",
    title: "Interwar Seaside Architecture: A Survey of Style and Survival",
    format: "PDF",
    audience: "Academics & Researchers",
    resourceType: "Research & Reports",
    topics: ["Architecture & design", "Seaside history"],
    description:
      "A survey of Art Deco, Modernist and streamline buildings across English and Welsh seaside resorts, examining what survives, what is listed, and what has been lost.",
  },
  {
    id: "1",
    slug: "photographing-the-seaside",
    title: "Photographing the Seaside: A Guide for Heritage Volunteers",
    format: "PDF",
    audience: "Heritage Professionals",
    resourceType: "Guides & Factsheets",
    topics: ["Seaside history"],
    description:
      "Practical guidance on capturing seaside heritage through photography, from funfairs and piers to promenades and beach huts.",
  },
  {
    id: "2",
    slug: "documenting-seaside-amusements",
    title: "Documenting Seaside Amusements",
    format: "Video",
    audience: "Heritage Professionals",
    resourceType: "Guides & Factsheets",
    topics: ["Entertainment & fun", "Seaside history"],
    description:
      "An introduction to methods for documenting and recording amusement parks and funfair heritage on film.",
  },
  {
    id: "3",
    slug: "running-a-seaside-heritage-event",
    title: "Running a Seaside Heritage Event",
    format: "PDF",
    audience: "Heritage Professionals",
    resourceType: "Case Studies",
    topics: ["Arts & culture", "Tourism & visitor economy"],
    description:
      "Case studies and lessons learned from seaside heritage events across UK resorts, covering programming, partnerships, and community involvement.",
  },
  {
    id: "4",
    slug: "margate-old-town-walking-tour",
    title: "Margate Old Town Walking Tour",
    format: "PDF",
    audience: "General Public",
    resourceType: "Guides & Factsheets",
    topics: ["Seaside history", "Tourism & visitor economy"],
    description:
      "A self-guided walking tour exploring the heritage of Margate Old Town, from the Tudor harbour to the seafront.",
  },
  {
    id: "5",
    slug: "funding-your-seaside-heritage-project",
    title: "Funding Your Seaside Heritage Project",
    format: "Article",
    audience: "Heritage Professionals",
    resourceType: "Guides & Factsheets",
    topics: ["Funding & policy"],
    description:
      "An overview of funding sources available to groups and organisations working on seaside heritage projects.",
  },
  {
    id: "6",
    slug: "the-future-of-the-british-pier",
    title: "The Future of the British Pier",
    format: "PDF",
    audience: "Academics & Researchers",
    resourceType: "Research & Reports",
    topics: ["Architecture & design", "Tourism & visitor economy"],
    description:
      "A research report examining the current condition and future prospects of piers in England and Wales.",
  },
  {
    id: "7",
    slug: "volunteer-toolkit-for-seaside-heritage-groups",
    title: "Volunteer Toolkit for Seaside Heritage Groups",
    format: "PDF",
    audience: "Heritage Professionals",
    resourceType: "Toolkits & Templates",
    topics: ["Restoration & regeneration"],
    description:
      "Ready-to-use templates and guidance for managing volunteers, running local heritage surveys, and organising community events.",
  },
  {
    id: "8",
    slug: "blackpool-promenade-walking-tour",
    title: "Blackpool Promenade Walking Tour",
    format: "PDF",
    audience: "General Public",
    resourceType: "Guides & Factsheets",
    topics: ["Tourism & visitor economy", "Seaside history"],
    description:
      "Explore the rich heritage of Blackpool's promenade, from the Tower to the Pleasure Beach.",
  },
  {
    id: "9",
    slug: "engaging-communities-in-seaside-heritage",
    title: "Engaging Communities in Seaside Heritage",
    format: "Video",
    audience: "Heritage Professionals",
    resourceType: "Case Studies",
    topics: ["Arts & culture"],
    description:
      "A filmed panel discussion on approaches to community engagement in seaside heritage projects.",
  },
  {
    id: "10",
    slug: "planning-policy-and-the-seaside",
    title: "Planning Policy and the Seaside",
    format: "Article",
    audience: "Academics & Researchers",
    resourceType: "Research & Reports",
    topics: ["Funding & policy", "Restoration & regeneration"],
    description:
      "An analysis of how national planning policy frameworks address the distinctive challenges of seaside heritage.",
  },
  {
    id: "11",
    slug: "oral-history-methods-for-seaside-research",
    title: "Oral History Methods for Seaside Research",
    format: "PDF",
    audience: "Academics & Researchers",
    resourceType: "Guides & Factsheets",
    topics: ["Seaside history"],
    description:
      "Guidance on using oral history techniques to document personal and community memories of the seaside.",
  },
];
