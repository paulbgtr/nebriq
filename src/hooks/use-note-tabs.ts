"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getNoteTabs,
  createNoteTab,
  deleteNoteTab,
} from "@/app/actions/supabase/note-tabs";
import { useUser } from "./use-user";
import queryClient from "@/shared/lib/react-query";

export const useNoteTabs = () => {
  const { user } = useUser();

  const getTabsQuery = useQuery({
    queryKey: ["note-tabs"],
    queryFn: () => getNoteTabs(user!.id),
    enabled: !!user?.id,
  });

  const createNoteTabMutation = useMutation({
    mutationFn: createNoteTab,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note-tabs"] });
    },
  });

  const deleteNoteTabMutation = useMutation({
    mutationFn: deleteNoteTab,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note-tabs"] });
    },
  });

  return {
    getTabsQuery,
    createNoteTabMutation,
    deleteNoteTabMutation,
  };
};
