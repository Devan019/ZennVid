import React from 'react';
import {Composition} from 'remotion';
import Videomotion from '@/components/videomotion';
import RemotionVideo from '@/components/RemotionVideo';
 
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Empty"
        component={RemotionVideo}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          audioUrl: '',
          images: [],
          capations: [],
          width: 1280,
          height: 720,
        }}
      />
    </>
  );
};