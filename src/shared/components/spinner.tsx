type SpinnerProps = {
  size?: "sm" | "md" | "lg";
};

export const Spinner = ({ size = "md" }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-14 w-14 border-[5px]",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin ${sizeClasses[size]} rounded-full border-b-2 border-gray-300 border-t-transparent border-r-transparent border-l-gray-800`}
        style={{
          borderRadius: "50%", // ensures a perfect circle
          animationDuration: "1.5s", // a slower, deliberate spin to resemble writing pace
          animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)", // a smooth ease-in-out effect
        }}
      />
    </div>
  );
};
