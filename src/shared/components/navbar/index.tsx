"use client";

import * as React from "react";
import { useUser } from "@/hooks/use-user";
import { NoteTabs } from "./note-tabs";
import { Navigation } from "./navigation";

export default function Navbar() {
  const { user } = useUser();

  return (
    <nav>
      <Navigation email={user?.email} />
      <NoteTabs />
    </nav>
  );
}
