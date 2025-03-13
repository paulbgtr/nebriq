import { Webhooks } from "@polar-sh/nextjs";
import { createAdminClient } from "@/shared/lib/supabase/admin";

if (!process.env.POLAR_WEBHOOK_SECRET) {
  throw new Error("POLAR_WEBHOOK_SECRET is not set");
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
  onPayload: async (payload) => {
    const supabase = createAdminClient();

    // @ts-expect-error - metadata is available at runtime but might not be in type definition
    const metadata = payload.data.metadata;

    if (!metadata) {
      console.error("No metadata found");
      return;
    }

    const { data: userData, error } = await supabase.auth.admin.getUserById(
      metadata.userId
    );

    if (!userData) {
      console.error("No user found");
      return;
    }

    if (error) {
      console.error(error);
      return;
    }

    // @ts-expect-error - product name is available at runtime but might not be in type definition
    const productName = payload.data.product.name;

    if (!productName) {
      console.error("No product name found");
      return;
    }

    // const tier = productName.split(" ")[1].toLowerCase();
    const tier = productName;

    switch (payload.type) {
      case "subscription.created":
        const { error: subscriptionError } = await supabase
          .from("subscriptions")
          .insert({
            user_id: userData.user.id,
            status: "pending",
            tier,
          });

        if (subscriptionError) {
          console.error(subscriptionError);
          return;
        }

        break;
      case "subscription.updated":
        await supabase
          .from("subscriptions")
          .update({ status: payload.data.status })
          .eq("user_id", userData.user.id);

        break;
      case "subscription.revoked":
        await supabase
          .from("subscriptions")
          .update({ status: "revoked" })
          .eq("user_id", userData.user.id);

        break;
      case "subscription.canceled":
        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("user_id", userData.user.id);

        break;
      default:
        console.log("Unknown event", payload.type);
        break;
    }
  },
});
