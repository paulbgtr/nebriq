"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/shared/components/ui/card";
import { signup } from "@/app/actions/supabase/auth";
import Link from "next/link";
import { useToast } from "@/shared/hooks/use-toast";
import { useState, useTransition } from "react";

export default function SignupForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Passwords do not match",
      });
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Password must be at least 6 characters long",
      });
      return;
    }

    startTransition(async () => {
      try {
        await signup(formData);
        toast({
          title: "Account created",
          description: "Please check your email to verify your account",
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to sign up";
        setError(message);
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: message,
        });
      }
    });
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>
          Enter your email and password to create your account.
        </CardDescription>
      </CardHeader>
      <form>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="johndoe@example.com"
              required
              disabled={isPending}
              aria-describedby={error ? "signup-error" : undefined}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
              aria-describedby={error ? "signup-error" : undefined}
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
              aria-describedby={error ? "signup-error" : undefined}
              minLength={6}
            />
          </div>
          {error && (
            <div id="signup-error" className="text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full"
            type="submit"
            formAction={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Creating account..." : "Create account"}
          </Button>
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
