import RemotionVideo from "./renderVideo";
import { registerRoot } from "remotion";
import { Composition } from "remotion";

registerRoot(() => {
  return (
    <>
      <Composition
        id="RemotionVideo"
        component={RemotionVideo as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          audioUrl: "",
          images: [],
          captions: [],
          width: 1280,
          height: 720,
        }}
      />
    </>
  );
});
