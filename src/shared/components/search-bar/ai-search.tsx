import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

type Props = {
  isAISearch: boolean;
  setIsAISearch: (isAISearch: boolean) => void;
};

export const AISearch = ({ isAISearch, setIsAISearch }: Props) => {
  return (
    <div className="flex items-center space-x-2 self-end">
      <Switch
        id="ai-search"
        checked={isAISearch}
        onCheckedChange={setIsAISearch}
      />
      <Label htmlFor="ai-search">AI Search</Label>
    </div>
  );
};
