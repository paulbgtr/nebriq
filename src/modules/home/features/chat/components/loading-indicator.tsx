export const LoadingIndicator = () => (
  <div className="flex items-center gap-2 px-4 py-2">
    <div className="flex space-x-1">
      <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
      <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce delay-150" />
      <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce delay-300" />
    </div>
  </div>
);
