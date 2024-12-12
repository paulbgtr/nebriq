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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import {
  updateEmail,
  updatePassword,
  deleteAccount,
} from "@/app/actions/supabase/auth";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import {
  Mail,
  Lock,
  Trash2,
  KeyRound,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";

export default function SettingsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "email_updated") {
      toast({ title: "Email updated successfully", color: "success" });
    } else if (message === "password_updated") {
      toast({ title: "Password updated successfully", color: "success" });
    }
  }, [searchParams]);

  if (!user) return null;

  return (
    <div className="container max-w-2xl mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />
      <section className="grid gap-6 md:grid-cols-2 w-full">
        <Card className="w-full transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Email Settings</CardTitle>
            </div>
            <CardDescription>Update your email address</CardDescription>
          </CardHeader>
          <form>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">New Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={user.email}
                    required
                    className="pl-8"
                  />
                  <Mail className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                formAction={updateEmail}
                className="w-full sm:w-auto inline-flex items-center"
              >
                Update Email
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="w-full transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Password Settings</CardTitle>
            </div>
            <CardDescription>Change your password</CardDescription>
          </CardHeader>
          <form>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Current Password</Label>
                <div className="relative">
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    className="pl-8"
                    required
                  />
                  <Lock className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className="pl-8"
                    required
                  />
                  <Lock className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    className="pl-8"
                    required
                  />
                  <Lock className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                formAction={updatePassword}
                className="w-full sm:w-auto inline-flex items-center"
              >
                Update Password
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      </section>

      <Card className="border-destructive/50 transition-all hover:shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Once you delete your account, there is no going back. Please be
            certain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="inline-flex items-center"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <form>
                  <AlertDialogAction
                    type="submit"
                    formAction={deleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Account
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
