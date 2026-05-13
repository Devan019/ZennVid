"use client";

import VideoGalleryComponent from "../../components/your-videos/gallery";
import { FeatureGenerateProps } from "../../types";

interface YourVideosFeatureProps
  extends FeatureGenerateProps { }

const YourVideosFeature: React.FC<
  YourVideosFeatureProps
> = ({ onGenerate }) => {
  return <VideoGalleryComponent />;
};

export default YourVideosFeature;
