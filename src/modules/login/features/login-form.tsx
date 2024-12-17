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
import { login } from "@/app/actions/supabase/auth";
import Link from "next/link";
import { useToast } from "@/shared/hooks/use-toast";
import { useState, useTransition } from "react";

export default function LoginForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      try {
        await login(formData);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to login";
        setError(message);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: message,
        });
      }
    });
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email and password to access your account.
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
              aria-describedby={error ? "login-error" : undefined}
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
              aria-describedby={error ? "login-error" : undefined}
            />
          </div>
          {error && (
            <div id="login-error" className="text-sm text-destructive">
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
            {isPending ? "Logging in..." : "Log in"}
          </Button>
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
