import { motion, useAnimation } from "framer-motion";
import { Compass } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export const AnimatedCompass = () => {
  const controls = useAnimation();

  const handleClick = async () => {
    await controls.start({
      rotate: 720,
      transition: {
        duration: 0.8,
        ease: "linear",
      },
    });
    controls.set({ rotate: 0 });
  };

  return (
    <div className="flex justify-center mb-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <motion.div
          animate={{
            y: [-2, 2],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <motion.div
            whileHover={{
              scale: 1.1,
              rotate: 360,
              transition: {
                scale: {
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1],
                },
                rotate: {
                  duration: 2,
                  ease: "linear",
                },
              },
            }}
            animate={controls}
            onClick={handleClick}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/10 blur-xl"
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <Compass
              className={cn(
                "w-10 h-10",
                "text-primary",
                "relative z-10",
                "drop-shadow-[0_0_8px_rgba(var(--primary),0.3)]",
                "transition-colors duration-300",
                "hover:text-primary/80"
              )}
              aria-hidden="true"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
