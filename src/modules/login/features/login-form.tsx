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
import { Lock, Mail } from "lucide-react";

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
    <Card className="w-[400px] shadow-lg">
      <CardHeader className="space-y-3 text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription className="text-base">
          Enter your credentials to access your account
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
                aria-describedby={error ? "login-error" : undefined}
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
                aria-describedby={error ? "login-error" : undefined}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          {error && (
            <div
              id="login-error"
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
            {isPending ? "Logging in..." : "Sign In"}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Create an account
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
