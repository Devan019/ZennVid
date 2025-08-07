// remotion/RenderVideo.tsx

import { Audio, Img, Sequence, AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import React from 'react';
interface Caption {
  index: number;
  start: number; // in ms
  end: number;   // in ms
  text: string;
}

interface Props {
  audioUrl: string;
  images: string[];
  captions: Caption[];
  width: number;
  height: number;
}
// audioUrl
// images
// captions
// width
// height

const RenderVideo: React.FC<Props> = ({
  audioUrl,
  images,
  captions,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate timing
  const currentTimeMs = (frame / fps) * 1000;
  const endTime = captions[captions.length - 1]?.end || 0;
  const totalFrames = Math.ceil((endTime / 1000) * fps);
  const framesPerImage = Math.floor(totalFrames / images.length);

  // Find current caption
  const currentCaption = captions.find(
    (caption) =>
      caption.start <= currentTimeMs && caption.end >= currentTimeMs
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* Audio Track */}
      <Audio src={audioUrl} />

      {/* Image Sequences with Animation */}
      {images.map((image, index) => {
        const startFrame = index * framesPerImage;
        const duration = framesPerImage;

        // Ken Burns effect - alternating zoom directions
        const scale = interpolate(
          frame,
          [startFrame, startFrame + duration / 2, startFrame + duration],
          index % 2 === 0 ? [1, 1.15, 1] : [1.15, 1, 1.15],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Subtle pan effect
        const translateX = interpolate(
          frame,
          [startFrame, startFrame + duration],
          index % 2 === 0 ? [-2, 2] : [2, -2],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <Sequence key={index} from={startFrame} durationInFrames={duration}>
            <AbsoluteFill>
              <Img
                src={image}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${scale}) translateX(${translateX}px)`,
                  transition: "transform 0.1s ease-out",
                }}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* Caption Overlay */}
      {currentCaption && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 20,
            right: 20,
            textAlign: "center",
            fontSize: Math.min(width * 0.06, 28), // Responsive font size
            fontWeight: "bold",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: "12px 20px",
            borderRadius: "12px",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
            lineHeight: 1.3,
            maxWidth: "90%",
            margin: "0 auto",
          }}
        >
          {currentCaption.text}
        </div>
      )}
    </AbsoluteFill>
  );
};
export default RenderVideo;
