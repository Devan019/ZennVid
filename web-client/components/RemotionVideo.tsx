"use client";
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { interpolate } from "remotion";

const RemotionVideo = ({
  audioUrl,
  images,
  capations,
  width,
  height,
}: {
  audioUrl: string;
  images: string[];
  capations: {
    index: number;
    start: number;
    end: number;
    text: string;
  }[];
  width: number;
  height: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { durationInFrames } = useVideoConfig();

  const endTime = capations[capations.length - 1].end / 1000;
  const endTimefps = Math.ceil(endTime * fps);
  const oneImageDuration = Math.floor(endTimefps / images.length);

  const currentTimeByFrame = (frame / fps) * 1000;
  const currentCaption = capations.find(
    (caption) =>
      caption.start <= currentTimeByFrame &&
      caption.end >= currentTimeByFrame
  );



  return (
    <AbsoluteFill className="bg-black">
      <Audio src={audioUrl} />

      {images.map((image, index) => {
        const startFrame = index * oneImageDuration;
        const endFrame = startFrame + oneImageDuration;

        const imageScale = interpolate(
          frame,
          [startFrame, startFrame + oneImageDuration / 2, endFrame],
          index % 2 === 0 ? [1, 1.2, 1] : [1.2, 1, 1.2],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <Sequence
            key={index}
            durationInFrames={oneImageDuration}
            from={startFrame}
          >
            <div className="relative w-full h-full flex flex-col justify-end items-center overflow-hidden">
              <Img
                src={image}
                className="w-full h-full object-cover absolute top-0 left-0 z-0"
                style={{
                  transform: `scale(${imageScale})`,
                }}
              />
              <div className="bg-black/50 z-10 mb-2 text-white text-[20px] max-w-full text-center px-4 py-2 rounded-lg">
                {currentCaption?.text}
              </div>
            </div>
          </Sequence>
        );
      })}

    </AbsoluteFill>
  );
};

export default RemotionVideo;
