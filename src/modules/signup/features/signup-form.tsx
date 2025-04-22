"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { signup } from "@/app/actions/supabase/auth";
import Link from "next/link";
import { useToast } from "@/shared/hooks/use-toast";
import { useTransition } from "react";
import { Lock, Mail, ArrowRight, Github } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signupSchema } from "@/shared/lib/schemas/auth/signup";
import { z } from "zod";
import { cn } from "@/shared/lib/utils";
import { getAuthErrorMessage } from "@/shared/lib/utils/auth-errors";
import { AuthError } from "@supabase/supabase-js";
import {
  signInWithGithub,
  signInWithGoogle,
} from "@/app/actions/supabase/auth";

export default function SignupForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    startTransition(async () => {
      try {
        const result = await signup(values.email, values.password);

        if (result.success) {
          toast({
            title: "Check your email",
            description:
              "We sent you a confirmation link to complete your registration.",
          });
          form.reset();
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: getAuthErrorMessage(error as AuthError),
        });
      }
    });
  };

  return (
    <>
      <div className="flex flex-col space-y-3 mb-6">
        <div className="flex justify-center mb-1">
          <div className="rounded-full bg-primary/10 p-2 w-10 h-10 flex items-center justify-center">
            <Mail className="h-5 w-5 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-center">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          Be among the first to experience the future of knowledge management.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-3 mb-2">
          <Button
            variant="outline"
            className="w-full h-11 flex items-center gap-2 border-border/60 hover:bg-muted/50 hover:border-primary/20 transition-all duration-200"
            onClick={async () => {
              await signInWithGoogle();
            }}
            disabled={isPending}
          >
            <FaGoogle className="h-4 w-4 text-[#4285F4]" />
            <span className="text-sm font-medium">Google</span>
          </Button>

          <Button
            variant="outline"
            className="w-full h-11 flex items-center gap-2 border-border/60 hover:bg-muted/50 hover:border-primary/20 transition-all duration-200"
            onClick={async () => {
              await signInWithGithub();
            }}
            disabled={isPending}
          >
            <Github className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium">GitHub</span>
          </Button>
        </div>

        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/40" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">
              or with email and password
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    Email
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="name@example.com"
                        className={cn(
                          "pl-9 pr-4 py-5 text-sm",
                          "bg-background hover:bg-background/80 focus:bg-background",
                          "border-border/60 focus:border-primary/50",
                          "rounded-md shadow-sm",
                          "transition-all duration-200"
                        )}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className={cn(
                          "pl-9 pr-4 py-5 text-sm",
                          "bg-background hover:bg-background/80 focus:bg-background",
                          "border-border/60 focus:border-primary/50",
                          "rounded-md shadow-sm",
                          "transition-all duration-200"
                        )}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className={cn(
                          "pl-9 pr-4 py-5 text-sm",
                          "bg-background hover:bg-background/80 focus:bg-background",
                          "border-border/60 focus:border-primary/50",
                          "rounded-md shadow-sm",
                          "transition-all duration-200"
                        )}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className={cn(
                "w-full relative group h-11 mt-2",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                "shadow-sm hover:shadow-md",
                "transition-all duration-200"
              )}
              type="submit"
              disabled={isPending}
            >
              <span className="flex items-center justify-center gap-2">
                {isPending ? "Creating account..." : "Create account"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </form>
        </Form>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/90 transition-colors"
          >
            Sign in instead
          </Link>
        </p>
      </div>

      <div className="mt-8 pt-4 border-t border-border/30 text-center">
        <p className="text-xs text-muted-foreground/60">
          By signing up, you agree to our{" "}
          <Link
            href="/terms"
            className="hover:underline text-muted-foreground/80"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:underline text-muted-foreground/80"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </>
  );
}
