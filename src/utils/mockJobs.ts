export const MOCK_JOBS = [
  {
    jobId: "6900973fdaee6de24981cd2f",
    jobTitle: "Website Redesign & Frontend Implementation",
    category: {
      categoryId: "68d1cd0e0edd9b7f23374478",
      categoryName: "Web, Mobile & Software Dev",
    },
    totalProposal: 0,
    status: "pending_verification",
    budget: {
      rateType: "fixed",
      min: 500,
      max: 600,
      currency: "USD",
    },
    // full document/detail fields you can use in a job detail page
    description: `We need a modern responsive redesign of our marketing website and
implementation in React + Tailwind. The scope includes:

- New visual design for Home, About, Services, Contact pages
- Responsive layouts (mobile, tablet, desktop)
- Accessible components and SEO-friendly markup
- Light CMS integration for editable content sections

Deliverables: Figma mockups for desktop + mobile, and a working React app with documented run/build steps.`,
    client: {
      clientId: "5f8d0d55b54764421b7156c1",
      companyName: "Acme Co.",
      contactName: "Leo Das",
      contactEmail: "leo.das@acme.example",
      verified: false,
    },
    skills: ["react", "tailwindcss", "responsive-design", "accessibility"],
    attachments: [
      {
        id: "att-1",
        name: "requirements.pdf",
        url: "/static/mock/requirements.pdf",
      },
    ],
    location: {
      type: "remote",
      timezone: "UTC",
    },
    duration: {
      type: "short-term",
      estimatedWeeks: 4,
    },
    visibility: "public",
    proposals: [],
    createdAt: "2025-10-31T12:34:56.000Z",
    updatedAt: "2025-10-31T12:34:56.000Z",
    // raw: keep the original server-shaped object if needed by callers
    raw: null,
  },
];

export function getMockJobById(id: string) {
  return MOCK_JOBS.find((j) => j.jobId === id || (j as any).id === id) ?? null;
}

export default MOCK_JOBS;
