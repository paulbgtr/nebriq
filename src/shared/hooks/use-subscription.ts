import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/shared/lib/supabase/client";
import { useUser } from "./use-user";

export const useSubscription = async () => {
  const { user } = useUser();

  const { data: subscription, isPending } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const supabase = createClient();
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        return null;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const isPro =
    subscription?.tier === "pro" && subscription?.status === "active";

  return {
    subscription,
    isPending,
    isPro,
    tier: subscription?.tier,
  };
};
