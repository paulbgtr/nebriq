import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { useSearchStore } from "@/store/search";

export const AISearch = () => {
  const { isAiSearch, setIsAiSearch } = useSearchStore();

  return (
    <div className="flex items-center space-x-2 self-end">
      <Switch
        id="ai-search"
        checked={isAiSearch}
        onCheckedChange={setIsAiSearch}
      />
      <Label htmlFor="ai-search">AI Search</Label>
    </div>
  );
};
