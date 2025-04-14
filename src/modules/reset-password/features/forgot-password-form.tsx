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
import { forgotPassword } from "@/app/actions/supabase/auth";
import Link from "next/link";
import { useToast } from "@/shared/hooks/use-toast";
import { useTransition, useState } from "react";
import { Mail, ArrowLeft, MailCheck } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema } from "@/shared/lib/schemas/auth/forgot-password";
import { z } from "zod";
import { cn } from "@/shared/lib/utils";
import { getAuthErrorMessage } from "@/shared/lib/utils/auth-errors";
import { AuthError } from "@supabase/supabase-js";

export default function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    startTransition(async () => {
      try {
        await forgotPassword(values.email);
        setIsSubmitSuccessful(true);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Password reset failed",
          description: getAuthErrorMessage(error as AuthError),
        });
      }
    });
  };

  if (isSubmitSuccessful) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto rounded-full bg-primary/10 p-3 mb-2">
            <MailCheck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground text-sm">
            We&apos;ve sent you a password reset link. Please check your email.
          </p>
        </div>
        <div className="text-center space-y-4">
          <Button
            variant="link"
            className="text-sm text-muted-foreground hover:text-primary"
            asChild
          >
            <Link href="/login" className="flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to login
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-3 mb-6">
        <div className="flex justify-center mb-1">
          <div className="rounded-full bg-primary/10 p-2 w-10 h-10 flex items-center justify-center">
            <Mail className="h-5 w-5 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-center">
          Forgot password?
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          Enter your email address and we&apos;ll send you a reset link
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
              {isPending ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        </Form>

        <Button
          variant="link"
          className="text-sm text-muted-foreground hover:text-primary justify-center"
          asChild
        >
          <Link href="/login" className="flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to login
          </Link>
        </Button>
      </div>
    </>
  );
}
