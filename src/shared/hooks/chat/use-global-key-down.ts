import { useEffect } from "react";

type UseGlobalKeyDownProps = {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  setFollowUp: React.Dispatch<React.SetStateAction<string>>;
};

export const useGlobalKeyDown = ({
  textareaRef,
  setFollowUp,
}: UseGlobalKeyDownProps) => {
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (
        document.activeElement === textareaRef.current ||
        e.ctrlKey ||
        e.altKey ||
        e.metaKey ||
        e.key === "Tab" ||
        e.key === "Escape" ||
        e.key === "Control" ||
        e.key === "Alt" ||
        e.key === "Shift" ||
        e.key === "Meta"
      ) {
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        textareaRef.current?.focus();

        setFollowUp((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);
};
