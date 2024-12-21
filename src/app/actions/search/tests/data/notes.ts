import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";

export const notes: z.infer<typeof noteSchema>[] = [
  // Technology
  {
    id: "1",
    user_id: "user123",
    title: "JavaScript Basics",
    content:
      "JavaScript is a versatile programming language used for web development. Key concepts include variables, functions, and DOM manipulation.",
    tags: ["JavaScript", "Programming", "Web"],
    linked_notes: ["2", "6"],
    created_at: new Date("2024-01-01T10:00:00Z"),
  },
  {
    id: "2",
    user_id: "user123",
    title: "Quantum Computing Fundamentals",
    content:
      "Quantum computers use quantum bits (qubits) to perform calculations exponentially faster than classical computers. Applications include cryptography and molecular simulation.",
    tags: ["Quantum", "Physics", "Computing"],
    linked_notes: ["8"],
    created_at: new Date("2024-01-02T11:00:00Z"),
  },
  // Science
  {
    id: "3",
    user_id: "user456",
    title: "Climate Change Impact",
    content:
      "Global warming affects weather patterns, sea levels, and ecosystems worldwide. Key factors include greenhouse gas emissions and deforestation.",
    tags: ["Climate", "Environment", "Science"],
    linked_notes: ["9"],
    created_at: new Date("2024-01-03T12:00:00Z"),
  },
  // Arts
  {
    id: "4",
    user_id: "user123",
    title: "Renaissance Art History",
    content:
      "The Renaissance period marked a revival of classical learning and artistic innovation. Notable artists include Leonardo da Vinci and Michelangelo.",
    tags: ["Art", "History", "Culture"],
    linked_notes: ["7"],
    created_at: new Date("2024-01-04T13:00:00Z"),
  },
  // Business
  {
    id: "5",
    user_id: "user456",
    title: "Investment Strategies",
    content:
      "Diversification and long-term planning are key to successful investing. Understanding market trends and risk management is essential.",
    tags: ["Finance", "Investment", "Business"],
    linked_notes: ["10"],
    created_at: new Date("2024-01-05T14:00:00Z"),
  },
  // Health
  {
    id: "6",
    user_id: "user123",
    title: "Nutrition Fundamentals",
    content:
      "Balanced nutrition includes proper ratios of proteins, carbohydrates, and fats. Micronutrients play crucial roles in body functions.",
    tags: ["Health", "Nutrition", "Wellness"],
    linked_notes: [],
    created_at: new Date("2024-01-06T15:00:00Z"),
  },
  // Music
  {
    id: "7",
    user_id: "user789",
    title: "Classical Music Theory",
    content:
      "Music theory covers harmony, rhythm, and composition techniques. Understanding scales and chord progressions is fundamental.",
    tags: ["Music", "Theory", "Arts"],
    linked_notes: ["4"],
    created_at: new Date("2024-01-07T16:00:00Z"),
  },
  // Physics
  {
    id: "8",
    user_id: "user789",
    title: "String Theory Basics",
    content:
      "String theory suggests that all matter consists of tiny vibrating strings. It attempts to unify quantum mechanics and gravity.",
    tags: ["Physics", "Science", "Theory"],
    linked_notes: ["2"],
    created_at: new Date("2024-01-08T17:00:00Z"),
  },
  // Environmental
  {
    id: "9",
    user_id: "user456",
    title: "Sustainable Living",
    content:
      "Sustainable practices include renewable energy use, waste reduction, and conscious consumption. Individual actions impact global sustainability.",
    tags: ["Environment", "Lifestyle", "Sustainability"],
    linked_notes: ["3"],
    created_at: new Date("2024-01-09T18:00:00Z"),
  },
  // Economics
  {
    id: "10",
    user_id: "user123",
    title: "Macroeconomics Principles",
    content:
      "Macroeconomics studies economy-wide phenomena including inflation, GDP, and unemployment. Policy decisions affect economic indicators.",
    tags: ["Economics", "Finance", "Business"],
    linked_notes: ["5"],
    created_at: new Date("2024-01-10T19:00:00Z"),
  },
  {
    id: "11",
    user_id: "user456",
    title: "Python for Data Science",
    content:
      "Python is a popular language for data analysis, machine learning, and visualization. Key libraries include NumPy, Pandas, and Matplotlib.",
    tags: ["Python", "Data", "Science"],
    linked_notes: [],
    created_at: new Date("2024-01-11T20:00:00Z"),
  },
];
