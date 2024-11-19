import { Note } from "@/types/note";

export const notes: Note[] = [
  {
    id: "1",
    user_id: "user123",
    title: "JavaScript Basics",
    content:
      "JavaScript is a versatile programming language used for web development.",
    tags: ["JavaScript", "Programming", "Web"],
    linked_notes: ["2", "6"],
    created_at: new Date("2024-01-01T10:00:00Z"),
  },
  {
    id: "2",
    user_id: "user123",
    title: "Introduction to Python",
    content:
      "Python is a popular language for data science, machine learning, and web development.",
    tags: ["Python", "Data Science", "Programming"],
    linked_notes: ["1"],
    created_at: new Date("2024-01-02T11:00:00Z"),
  },
  {
    id: "3",
    user_id: "user456",
    title: "Advanced CSS Techniques",
    content:
      "CSS allows you to style HTML elements, including layout, colors, and animations.",
    tags: ["CSS", "Web Design"],
    linked_notes: [],
    created_at: new Date("2024-01-03T12:00:00Z"),
  },
  {
    id: "4",
    user_id: "user123",
    title: "React for Beginners",
    content: "React is a JavaScript library for building user interfaces.",
    tags: ["React", "JavaScript", "Frontend"],
    linked_notes: ["1", "6"],
    created_at: new Date("2024-01-04T13:00:00Z"),
  },
  {
    id: "5",
    user_id: "user456",
    title: "Databases and SQL",
    content: "SQL is a language for managing and querying databases.",
    tags: ["SQL", "Databases"],
    linked_notes: [],
    created_at: new Date("2024-01-05T14:00:00Z"),
  },
  {
    id: "6",
    user_id: "user123",
    title: "JavaScript and Node.js",
    content:
      "Node.js allows JavaScript to run on the server-side and is popular for building scalable applications.",
    tags: ["JavaScript", "Node.js", "Backend"],
    linked_notes: ["1", "4"],
    created_at: new Date("2024-01-06T15:00:00Z"),
  },
];
