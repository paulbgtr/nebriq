export const Visualization = () => {
  return (
    <div className="absolute inset-0">
      {/* Graph will be rendered here */}
      <div className="h-full w-full" id="graph-container">
        {/* Placeholder for graph */}
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Graph visualization will be rendered here
        </div>
      </div>
    </div>
  );
};
