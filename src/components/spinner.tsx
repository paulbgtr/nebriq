type SpinnerProps = {
  size?: "sm" | "md" | "lg";
};

export const Spinner = ({ size = "md" }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-primary border-t-transparent ${sizeClasses[size]}`}
      />
    </div>
  );
};
