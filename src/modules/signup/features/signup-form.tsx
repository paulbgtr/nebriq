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
import { Lock, Mail } from "lucide-react";

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
    <Card className="w-[400px] shadow-lg">
      <CardHeader className="space-y-3 text-center">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription className="text-base">
          Enter your details to create your account
        </CardDescription>
      </CardHeader>
      <form>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="johndoe@example.com"
                required
                disabled={isPending}
                className="pl-10"
                aria-describedby={error ? "signup-error" : undefined}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={isPending}
                className="pl-10"
                aria-describedby={error ? "signup-error" : undefined}
                minLength={6}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                disabled={isPending}
                className="pl-10"
                aria-describedby={error ? "signup-error" : undefined}
                minLength={6}
              />
            </div>
          </div>
          {error && (
            <div
              id="signup-error"
              className="text-sm text-destructive bg-destructive/10 p-3 rounded-md"
            >
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-6 pb-6">
          <Button
            className="w-full h-11 text-base font-medium"
            type="submit"
            formAction={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Creating account..." : "Create Account"}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
