"use client";

const AuthHeader: React.FC = () => {
  return (
    <div
      className="
        relative
        hidden
        flex-col
        justify-between
        overflow-hidden
        border-r
        border-white/10
        bg-black
        p-14
        text-white
        lg:flex
      "
    >
      <div>
        <h1
          className="
            text-sm
            font-medium
            uppercase
            tracking-[0.4em]
            text-white/60
          "
        >
          ZENNVID
        </h1>
      </div>

      <div className="max-w-lg">
        <h2
          className="
            text-6xl
            font-semibold
            leading-[0.95]
            tracking-[-0.05em]
          "
        >
          Create cinematic AI videos.
        </h2>

        <p
          className="
            mt-6
            text-lg
            leading-relaxed
            text-white/60
          "
        >
          Generate premium AI visuals, cinematic edits, and
          modern storytelling workflows.
        </p>
      </div>

      <div
        className="
          flex
          items-center
          gap-3
          text-sm
          text-white/40
        "
      >
        <div className="h-2 w-2 rounded-full bg-white" />
        Trusted by modern creators
      </div>

      <div
        className="
          absolute
          bottom-[-20%]
          left-1/2
          h-[400px]
          w-[400px]
          -translate-x-1/2
          rounded-full
          bg-white/10
          blur-3xl
        "
      />
    </div>
  );
};

export default AuthHeader;
