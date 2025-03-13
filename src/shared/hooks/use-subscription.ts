import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/shared/lib/supabase/client";
import { useUser } from "./use-user";
import { useState, useEffect } from "react";

export type SubscriptionTier = "personal" | "pro" | null;

export const useSubscription = () => {
  const { user } = useUser();
  const [tier, setTier] = useState<SubscriptionTier>(null);
  const [isFree, setIsFree] = useState(false);

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

  useEffect(() => {
    if (isPending) return;

    if (subscription?.status === "active") {
      if (subscription.tier === "pro") {
        setTier("pro");
      } else if (subscription.tier === "personal") {
        setTier("personal");
      } else {
        setTier(null);
      }
    } else {
      setTier(null);
    }
  }, [isPending, subscription]);

  const isSubscriptionActive = subscription?.status === "active";

  useEffect(() => {
    if (!isPending && !isSubscriptionActive) {
      setIsFree(true);
    }
  }, [isPending, isSubscriptionActive]);

  return {
    subscription,
    isPending,
    tier,
    isPro: tier === "pro",
    isPersonal: tier === "personal",
    isFree,
    isSubscriptionActive,
  };
};
