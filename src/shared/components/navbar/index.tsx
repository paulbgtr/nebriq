"use client";

import * as React from "react";
import { useUser } from "@/hooks/use-user";
import { NoteTabs } from "./note-tabs";
import { Navigation } from "./navigation";

export default function Navbar() {
  const { user, isPending } = useUser();

  // todo: get note ids from local-storage

  const notes = [
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

  return (
    <nav>
      <Navigation email={user?.email} />
      <NoteTabs />
    </nav>
  );
}
