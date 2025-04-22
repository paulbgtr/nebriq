import { useUser } from "@/shared/hooks/data/use-user";
import { Sunrise, Coffee, Cloud, Sunset, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

export const Greeting = () => {
  const { user } = useUser();
  const userFirstName = user?.email ? user.email.split("@")[0] : "there";
  const displayName =
    userFirstName.charAt(0).toUpperCase() + userFirstName.slice(1);

  const currentHour = new Date().getHours();
  let timeGreeting = "Hi";
  let helpMessage = "How can I help organize your thoughts today?";

  let TimeIcon = Coffee;

  if (currentHour >= 5 && currentHour < 8) {
    timeGreeting = "Good morning";
    TimeIcon = Sunrise;
    helpMessage = "Ready to capture your morning thoughts?";
  } else if (currentHour >= 8 && currentHour < 12) {
    timeGreeting = "Good morning";
    TimeIcon = Coffee;
    helpMessage = "What knowledge would you like to explore today?";
  } else if (currentHour >= 12 && currentHour < 14) {
    timeGreeting = "Good afternoon";
    TimeIcon = Sun;
    helpMessage = "Need help connecting your ideas?";
  } else if (currentHour >= 14 && currentHour < 18) {
    timeGreeting = "Good afternoon";
    TimeIcon = Cloud;
    helpMessage = "Let's write, ask, and discover together.";
  } else if (currentHour >= 18 && currentHour < 22) {
    timeGreeting = "Good evening";
    TimeIcon = Sunset;
    helpMessage = "Time to reflect on your thoughts and ideas?";
  } else {
    timeGreeting = "Good evening";
    TimeIcon = Moon;
    helpMessage = "Your knowledge is always accessible, even at night.";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2",
        "rounded-xl",
        "bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/15",
        "text-primary/80",
        "shadow-sm",
        "transition-all duration-300 ease-in-out"
      )}
    >
      <div className="rounded-full bg-primary/10 p-1.5">
        <TimeIcon className="w-3.5 h-3.5 text-primary/70" />
      </div>
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium">{timeGreeting},</span>
          <span className="text-xs font-semibold">{displayName}</span>
        </div>
        <span className="text-[10px] text-primary/70">{helpMessage}</span>
      </div>
    </motion.div>
  );
};
