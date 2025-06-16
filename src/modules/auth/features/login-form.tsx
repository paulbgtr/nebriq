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
import Link from "next/link";
import { useToast } from "@/shared/hooks/use-toast";
import { Mail, ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/shared/lib/schemas/auth/login";
import { z } from "zod";
import { cn } from "@/shared/lib/utils";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      signIn("resend", values);
    } catch {
      toast({
        variant: "destructive",
        title: "Login failed",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-3">
        <h1 className="text-5xl font-semibold tracking-tight text-center">
          Start your journey with Nebriq
        </h1>
        <p className="text-md text-muted-foreground text-center">
          Without folders. Without tags. Just write.
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
                          "transition-all duration-200",
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
                "transition-all duration-200",
              )}
              type="submit"
            >
              <span className="flex items-center justify-center gap-2">
                Continue with Email
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </form>
        </Form>
      </div>

      <div className="mt-8 pt-4 border-t border-border/30 text-center">
        <p className="text-xs text-muted-foreground/60">
          By continuing, you agree to our{" "}
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
