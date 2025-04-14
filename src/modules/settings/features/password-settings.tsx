import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Lock, KeyRound, ArrowRight } from "lucide-react";
import { updatePassword } from "@/app/actions/supabase/auth";

export const PasswordSettings = () => {
  return (
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
          {/* <div className="space-y-2">
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
          </div> */}
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
  );
};
