"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/shared/lib/supabase/server";
import {
  getUserTokenLimits,
  createTokenLimit,
  updateTokenLimit,
} from "./token_limits";

const upsertTokenLimitForUser = async (userId: string) => {
  const tokenLimit = await getUserTokenLimits(userId);

  if (!tokenLimit) {
    await createTokenLimit({
      user_id: userId,
      token_limit: 5000,
    });

    return;
  }

  await updateTokenLimit({
    user_id: userId,
    tokens_used: 0,
  });
};

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: userData, error } =
    await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  const { id } = userData.user;

  await upsertTokenLimitForUser(id);

  revalidatePath("/", "layout");
  redirect("/write");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp(data);

  if (error || data.password !== data.confirmPassword || !user) {
    redirect("/error");
  }

  await upsertTokenLimitForUser(user.id);

  revalidatePath("/", "layout");
  redirect("/write");
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
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
  const password = formData.get("password") as string; // todo: validate user password
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
