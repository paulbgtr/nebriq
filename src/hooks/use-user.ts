import { User } from "@/types/user";
import { createClient } from "@/shared/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  const { data: user, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      const supabase = createClient();
      return supabase.auth.getUser();
    },
    select: ({ data }) => {
      if (!data?.user) return null;
      const userData = {
        id: data?.user?.id,
        email: data?.user?.email,
        role: data?.user?.role,
        createdAt: new Date(data?.user?.created_at),
      } satisfies User;
      return userData;
    },
  });

  return { user, isPending };
};
