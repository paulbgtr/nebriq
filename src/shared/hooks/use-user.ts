import { userSchema } from "@/shared/lib/schemas/userSchema";
import { createClient } from "@/shared/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  const { data: user, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        throw new Error("User not found");
      }

      return userSchema.parse({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: new Date(user.created_at),
      });
    },
  });

  const { data: isNewUser } = useQuery({
    queryKey: ["isNewUser", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const supabase = createClient();

      const stored = localStorage.getItem(`onboarding-${user.id}`);
      if (stored) return false;

      const { data: notes } = await supabase
        .from("notes")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      const isNew = !notes || notes.length === 0;

      if (!isNew) {
        localStorage.setItem(`onboarding-${user.id}`, "completed");
      }

      return isNew;
    },
    enabled: !!user?.id,
  });

  return {
    user,
    isPending,
    isNewUser: isNewUser ?? false,
  };
};
