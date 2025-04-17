
// Mock documentation content responses
export const mockDocumentationResponses = {
  overview: {
    title: "Overview Documentation",
    content: "This is the system overview documentation",
    lastUpdated: "2025-04-17T12:00:00Z",
    sections: [
      { title: "About PremiAds", content: "PremiAds is a digital marketing platform..." },
      { title: "System Architecture", content: "The platform is built with a modern architecture..." }
    ]
  },
  users: {
    title: "User Management Documentation",
    content: "Documentation about user management features",
    lastUpdated: "2025-04-16T15:30:00Z",
    sections: [
      { title: "User Types", content: "There are three user types: admin, advertiser, and participant" },
      { title: "User Permissions", content: "Each user type has different permissions..." }
    ]
  },
  dashboard: {
    title: "Dashboard Documentation",
    content: "Documentation for the dashboard features",
    lastUpdated: "2025-04-15T09:45:00Z",
    sections: [
      { title: "Dashboard Overview", content: "The dashboard provides an overview of key metrics..." },
      { title: "Dashboard Widgets", content: "The dashboard includes several widgets..." }
    ]
  }
};

// Mock user data for testing
export const mockUsers = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    lastLogin: "2025-04-16T18:30:00Z"
  },
  {
    id: "user-2",
    name: "Advertiser User",
    email: "advertiser@example.com",
    role: "advertiser",
    lastLogin: "2025-04-15T12:15:00Z"
  },
  {
    id: "user-3",
    name: "Participant User",
    email: "participant@example.com",
    role: "participant",
    lastLogin: "2025-04-17T08:20:00Z"
  }
];

// Mock raffle data for testing
export const mockRaffles = [
  {
    id: "raffle-1",
    title: "Weekly Prize Draw",
    description: "Win exciting prizes every week!",
    status: "active",
    startDate: "2025-04-10T00:00:00Z",
    endDate: "2025-04-17T23:59:59Z",
    drawDate: "2025-04-18T15:00:00Z",
    prizeValue: 1000,
    participants: 128
  },
  {
    id: "raffle-2",
    title: "Monthly Grand Prize",
    description: "Our biggest monthly raffle with amazing prizes!",
    status: "upcoming",
    startDate: "2025-05-01T00:00:00Z",
    endDate: "2025-05-31T23:59:59Z",
    drawDate: "2025-06-01T15:00:00Z",
    prizeValue: 5000,
    participants: 0
  }
];
