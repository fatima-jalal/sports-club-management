// Mock data used across the Student Portal and Admin Workspace.
// In a later phase, this will be replaced by real data from the Flask API.

const mockClubs = [
  {
    clubId: 1,
    name: "Cricket Club",
    coach: "Muhammad Bilal",
    maxCapacity: 20,
    currentMembers: 14,
    timing: "Mon & Wed, 5:00 PM - 7:00 PM",
    description: "Weekly practice sessions focused on batting, bowling, and fielding drills."
  },
  {
    clubId: 2,
    name: "Football Club",
    coach: "Khadija Imran",
    maxCapacity: 18,
    currentMembers: 18,
    timing: "Tue & Thu, 4:30 PM - 6:30 PM",
    description: "Full-pitch training with a focus on teamwork and match strategy."
  },
  {
    clubId: 3,
    name: "Basketball Club",
    coach: "Ahmed Raza",
    maxCapacity: 15,
    currentMembers: 6,
    timing: "Fri, 3:00 PM - 5:00 PM",
    description: "Beginner-friendly sessions covering dribbling, shooting, and defense."
  }
];

const mockMembershipRequests = [
  { requestId: 101, studentName: "Wania Sheeva", club: "Cricket Club", requestedOn: "2026-07-28", status: "Pending" },
  { requestId: 102, studentName: "Ayesha Nafees", club: "Basketball Club", requestedOn: "2026-07-29", status: "Pending" },
  { requestId: 103, studentName: "Zainab Tariq", club: "Football Club", requestedOn: "2026-07-30", status: "Pending" }
];

const mockRoster = [
  { rosterId: 1, studentName: "Fatima Jalal", club: "Cricket Club", joinDate: "2026-06-01" },
  { rosterId: 2, studentName: "Ayesha Nafees", club: "Football Club", joinDate: "2026-06-05" },
  { rosterId: 3, studentName: "Wania Sheeva", club: "Cricket Club", joinDate: "2026-06-01" },
  { rosterId: 4, studentName: "Zainab Tariq", club: "Basketball Club", joinDate: "2026-06-10" }
];