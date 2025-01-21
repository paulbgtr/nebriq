"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/shared/lib/supabase/server";
import { getUserTokenLimits, createTokenLimit } from "./token_limits";

const createTokenLimitIfNotExists = async (userId: string) => {
  const tokenLimit = await getUserTokenLimits(userId);
  if (!tokenLimit) {
    await createTokenLimit({
      user_id: userId,
      token_limit: 5000,
    });
  }
};

export async function login(email: string, password: string) {
  const supabase = await createClient();

  const data = {
    email,
    password,
  };

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword(data);

  if (error || !user) {
    throw new Error(error?.message);
  }

  await createTokenLimitIfNotExists(user.id);

  revalidatePath("/", "layout");
}

export async function signup(
  email: string,
  password: string,
  confirmPassword: string
) {
  const supabase = await createClient();

  const data = {
    email,
    password,
    confirmPassword,
  };

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp(data);

  if (!user) {
    throw new Error("User not found");
  }

  if (error) {
    throw new Error(error?.message);
  }

  await createTokenLimitIfNotExists(user.id);

  revalidatePath("/", "layout");
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

export async function deleteAccount() {
  const supabase = await createClient();

  const { error } = await supabase.auth.admin.deleteUser(
    (await supabase.auth.getUser()).data.user?.id as string
  );

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
