import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { createTokenLimitIfNotExists } from "@/shared/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await createTokenLimitIfNotExists(user.id);
      }
      redirect("/home");
    }
  }

  // redirect the user to an error page with some instructions
  redirect("/error");
}
