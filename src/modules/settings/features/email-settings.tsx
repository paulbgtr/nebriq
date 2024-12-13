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
import { Mail, ArrowRight } from "lucide-react";
import { updateEmail } from "@/app/actions/supabase/auth";

type Props = {
  email: string | undefined;
};

export const EmailSettings = ({ email }: Props) => {
  return (
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
                placeholder={email ?? ""}
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
  );
};
