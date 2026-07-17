export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: string;
  bonusPts: number;
  type: "plastic" | "paper" | "glass" | "organic" | "ewaste" | "any";
  icon: string; // emoji
  difficulty: "easy" | "medium" | "hard";
}

// 7 rotating daily challenges (index by day-of-week 0-6)
export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: "plastic-monday",
    title: "Plastic Patrol",
    description: "Collect and deposit at least 1 kg of plastic bottles today.",
    target: "1.0 kg Plastic",
    bonusPts: 50,
    type: "plastic",
    icon: "🍾",
    difficulty: "easy",
  },
  {
    id: "cardboard-tuesday",
    title: "Cardboard Crush",
    description: "Flatten and recycle 3+ cardboard boxes this Tuesday.",
    target: "3 cardboard boxes",
    bonusPts: 40,
    type: "paper",
    icon: "📦",
    difficulty: "easy",
  },
  {
    id: "zero-day-wednesday",
    title: "Zero Waste Wednesday",
    description: "Deposit waste of at least 2 different types in one session.",
    target: "2 waste types",
    bonusPts: 80,
    type: "any",
    icon: "♻️",
    difficulty: "medium",
  },
  {
    id: "glass-thursday",
    title: "Glass Guardian",
    description: "Return empty glass bottles or jars to a Midori.",
    target: "1.5 kg Glass",
    bonusPts: 60,
    type: "glass",
    icon: "🫙",
    difficulty: "medium",
  },
  {
    id: "ewaste-friday",
    title: "E-Waste Friday",
    description:
      "Find and drop off one old electronic device you no longer use.",
    target: "Any E-waste item",
    bonusPts: 120,
    type: "ewaste",
    icon: "💻",
    difficulty: "hard",
  },
  {
    id: "organic-saturday",
    title: "Compost Saturday",
    description: "Bring your week's food scraps for organic composting today.",
    target: "2 kg Organic",
    bonusPts: 35,
    type: "organic",
    icon: "🌱",
    difficulty: "easy",
  },
  {
    id: "mega-sunday",
    title: "Eco Champion Sunday",
    description: "Deposit 3+ kg of any waste type to earn the weekly bonus.",
    target: "3 kg Any type",
    bonusPts: 150,
    type: "any",
    icon: "🏆",
    difficulty: "hard",
  },
];

export function getTodaysChallenge(): DailyChallenge {
  const dayOfWeek = new Date().getDay(); // 0=Sun, 6=Sat
  return DAILY_CHALLENGES[dayOfWeek];
}
