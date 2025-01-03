import { SettingsHeader } from "../../shared/components/settings-header";
import { ThemeSwitcher } from "./features/theme-switcher";

export default function AppearanceSettings() {
  return (
    <>
      <SettingsHeader
        title="Appearance Settings"
        description="Customize the appearance of Nebriq to your liking."
      />

      <ThemeSwitcher />
    </>
  );
}
