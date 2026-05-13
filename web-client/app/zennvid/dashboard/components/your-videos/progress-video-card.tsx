"use client";

//@ts-ignore
import "./ai-loader.css";

interface ProgressVideoCardProps {
  progress: number;
  stage: string;
  isConnecting?: boolean;
}

export const ProgressVideoCard = ({
  progress,
  stage,
  isConnecting = false,
}: ProgressVideoCardProps) => {
  const safeProgress = Math.max(
    0,
    Math.min(100, Number(progress || 0))
  );

  const text = isConnecting
    ? "Connecting"
    : "Generating";

  const readableStage = (
    stage || "Rendering video"
  )
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) =>
      c.toUpperCase()
    );

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[40px]
        border
        border-black/5
        bg-[#F8F6F2]
        p-10
        shadow-[0_20px_80px_rgba(0,0,0,0.06)]
      "
    >
      {/* BG */}
      <div
        className="
          absolute
          left-1/2
          top-0
          h-[260px]
          w-[260px]
          -translate-x-1/2
          rounded-full
          bg-black/[0.03]
          blur-[120px]
        "
      />

      <div
        className="
          relative
          z-10
          flex
          flex-col
          items-center
          justify-center
        "
      >
        {/* LOADER */}
        <div className="loader-wrapper">
          {text.split("").map(
            (letter, index) => (
              <span
                key={index}
                className="loader-letter"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {letter}
              </span>
            )
          )}

          <div className="loader" />

          {/* PERCENT */}
          <div
            className="
              absolute
              bottom-[-34px]
              left-1/2
              -translate-x-1/2
              text-sm
              font-semibold
              tracking-tight
              text-black/70
            "
          >
            {safeProgress}%
          </div>
        </div>

        {/* STAGE */}
        <div
          className="
            mt-12
            rounded-full
            border
            border-black/5
            bg-white/80
            px-4
            py-2
            text-xs
            font-medium
            tracking-wide
            text-black/50
            backdrop-blur-xl
          "
        >
          {readableStage}
        </div>
      </div>
    </div>
  );
};
