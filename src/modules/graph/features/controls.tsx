import { Search, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export const Controls = () => {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
      <Button variant="secondary" size="icon">
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="secondary" size="icon">
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="secondary" size="icon">
        <Maximize className="h-4 w-4" />
      </Button>
    </div>
  );
};
