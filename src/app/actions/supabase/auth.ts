"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { createClient } from "@/shared/lib/supabase/server";
import { sendEmail } from "@/app/actions/emails/send-email";
import { EmailTemplate } from "@/enums/email-template";
import { createTokenLimitIfNotExists } from "@/shared/lib/utils";
import { Provider } from "@supabase/supabase-js";

export async function login(email: string, password: string) {
  const supabase = await createClient();
  const cleanEmail = email.toLowerCase().trim();

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error || !user) {
    throw new Error(error?.message || "Invalid login credentials");
  }

  await createTokenLimitIfNotExists(user.id);

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "Unknown browser";
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "UTC",
    timeStyle: "long",
    dateStyle: "long",
  });

  await sendEmail(
    "New Login to Your Nebriq Account",
    "noreply@nebriq.com",
    user.email!,
    EmailTemplate.LOGIN_NOTIFICATION,
    {
      email: user.email!,
      timestamp,
      browserInfo: userAgent,
    }
  );

  revalidatePath("/", "layout");
}

export async function signInWithGithub() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github" as Provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
    },
  });

  if (error) {
    console.error("Error signing in with GitHub:", error);
    return redirect("/login?message=Could not authenticate with GitHub");
  }

  return redirect(data.url);
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google" as Provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
    },
  });

  if (error) {
    console.error("Error signing in with Google:", error);
    return redirect("/login?message=Could not authenticate with Google");
  }

  return redirect(data.url);
}

export async function signup(email: string, password: string) {
  const supabase = await createClient();

  const cleanEmail = email.toLowerCase().trim();

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });

  if (error) {
    throw error;
  }

  if (user && user.identities?.length === 0) {
    throw new Error("User already registered");
  }

  if (user && user.identities?.length && user.identities.length > 0) {
    return { success: true };
  }

  throw new Error("Something went wrong. Please try again.");
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
}

export async function updateEmail(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/settings?message=email_updated");
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  // const password = formData.get("password") as string; // todo: validate user password
  const newPassword = formData.get("newPassword") as string;
  const confirmNewPassword = formData.get("confirmNewPassword") as string;

  if (newPassword !== confirmNewPassword) {
    redirect("/error");
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/settings?message=password_updated");
}

export async function requestAccountDeletion(formData: FormData) {
  const supabase = await createClient();
  const reason = formData.get("reason") as string;
  const details = formData.get("details") as string;

  const {
    data: { user },
    error: errorUser,
  } = await supabase.auth.getUser();

  if (errorUser || !user) {
    redirect("/error");
  }

  const { data: existingRequest } = await supabase
    .from("deletion_requests")
    .select()
    .eq("user_id", user.id)
    .single();

  if (existingRequest) {
    redirect("/settings?message=deletion_request_exists");
  }

  const { error } = await supabase.from("deletion_requests").insert({
    user_id: user.id,
    reason,
  });

  if (error) {
    console.error("Error creating deletion request:", error);
    redirect("/error");
  }

  await logout();

  await sendEmail(
    "New Account Deletion Request",
    "noreply@nebriq.com",
    "hi@nebriq.com",
    EmailTemplate.DELETION_REQUEST_ADMIN,
    {
      userId: user.id,
      userEmail: user.email!,
      reason,
      details,
    }
  );

  await sendEmail(
    "Account Deletion Request Received",
    "noreply@nebriq.com",
    user.email!,
    EmailTemplate.DELETION_REQUEST_USER,
    {
      reason,
    }
  );
}
