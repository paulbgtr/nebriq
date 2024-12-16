import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";

export const Sidebar = () => {
  return (
    <Card className="w-80 border-l">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search notes..." className="pl-8" />
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <h3 className="mb-2 font-medium">Filters</h3>
            {/* Add filter controls here */}
          </div>

          <div>
            <h3 className="mb-2 font-medium">Display</h3>
            {/* Add display options here */}
          </div>
        </div>
      </div>
    </Card>
  );
};
