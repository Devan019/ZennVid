"use client";

const DashboardBackground: React.FC = () => {
  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        z-0
        overflow-hidden
      "
    >
      {/* GRADIENT BLUR */}
      <div
        className="
          absolute
          left-1/2
          top-0
          h-[500px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-black/[0.03]
          blur-[120px]
        "
      />

      {/* GRID */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute left-1/3 top-0 h-full w-px bg-black" />
        <div className="absolute left-2/3 top-0 h-full w-px bg-black" />
        <div className="absolute left-0 top-1/3 h-px w-full bg-black" />
        <div className="absolute left-0 top-2/3 h-px w-full bg-black" />
      </div>
    </div>
  );
};

export default DashboardBackground;
