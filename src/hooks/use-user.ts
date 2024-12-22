import { userSchema } from "@/shared/lib/schemas/userSchema";
import { createClient } from "@/shared/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  const { data: user, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      const supabase = createClient();
      return supabase.auth.getUser();
    },
    select: (userData) => {
      const {
        data: { user },
        error,
      } = userData;

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

  return { user, isPending };
};
