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
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to get started
        </p>
      </div>

      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="name@example.com"
                        className={cn(
                          "pl-9 pr-4 py-5 text-sm",
                          "bg-background/50 hover:bg-background/80 focus:bg-background",
                          "transition-colors duration-200"
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
                  <FormLabel className="text-sm font-medium">
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
                          "bg-background/50 hover:bg-background/80 focus:bg-background",
                          "transition-colors duration-200"
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
                  <FormLabel className="text-sm font-medium">
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
                          "bg-background/50 hover:bg-background/80 focus:bg-background",
                          "transition-colors duration-200"
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
                "w-full relative group h-11",
                "bg-gradient-to-r from-primary to-primary/90"
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

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            className="w-full h-11 flex items-center gap-2"
            onClick={async () => {
              await signInWithGoogle();
            }}
            disabled={isPending}
          >
            <FaGoogle className="h-5 w-5" />
            Sign up with Google
          </Button>

          <Button
            variant="outline"
            className="w-full h-11 flex items-center gap-2"
            onClick={async () => {
              await signInWithGithub();
            }}
            disabled={isPending}
          >
            <Github className="h-5 w-5" />
            Sign up with GitHub
          </Button>
        </div>
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
