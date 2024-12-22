import { userSchema } from "@/shared/lib/schemas/userSchema";
import { createClient } from "@/shared/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  const { data: user, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      const supabase = createClient();
      return userSchema.parse(supabase.auth.getUser());
    },
    select: (user) => {
      if (!user) {
        throw new Error("User not found");
      }

      const userData = {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: new Date(user.createdAt),
      };
      return userData;
    },
  });

  return { user, isPending };
};
