import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type DetailedNoteProps = {
  children: React.ReactNode;
  title: string;
  content: string;
  createdAt: Date;
};

export const DetailedNote = ({
  children,
  title,
  content,
  createdAt,
}: DetailedNoteProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>{children}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{content}</DialogDescription>
          <div className="text-sm text-muted-foreground">
            {createdAt.toLocaleDateString()}
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
