import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface FuturisticCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  glowColor?: string;
  variant?: "default" | "neon";
}

export const FuturisticCard = ({
  children,
  delay = 0,
  className,
  glowColor = "var(--primary)",
  variant = "default",
}: FuturisticCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 1,
        },
      }}
      viewport={{
        once: true,
        margin: "-50px",
      }}
      transition={{ duration: 0.5, delay }}
      className={cn("relative group", className)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: [0.4, 0.3, 0.4],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{ backgroundColor: glowColor }}
        className="absolute inset-0 transition-all duration-700 rounded-xl blur-2xl group-hover:blur-3xl opacity-20"
      />

      {variant === "neon" && (
        <div className="absolute inset-0 -z-10 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent-blue/30 blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-scan" />
        </div>
      )}

      <div
        className={cn(
          "relative h-full p-6 transition-all duration-700 rounded-xl bg-background/80 backdrop-blur-md",
          "border border-primary/20 hover:border-primary/30",
          "hover:shadow-lg hover:shadow-primary/10"
        )}
      >
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        </div>

        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
};
