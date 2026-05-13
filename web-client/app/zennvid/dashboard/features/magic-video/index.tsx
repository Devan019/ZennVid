"use client";

import MagicVideoComponent from "../../components/magic-video/magic-video";
import { FeatureGenerateProps } from "../../types";
import { toast } from "sonner";

interface MagicVideoFeatureProps
  extends FeatureGenerateProps { }

const MagicVideoFeature: React.FC<
  MagicVideoFeatureProps
> = ({ onGenerate }) => {
  const handleGenerate = (jobId?: string) => {
    toast.success(
      "Generating cinematic video"
    );
    onGenerate(jobId);
  };

  return (
    <MagicVideoComponent
      onGenerate={handleGenerate}
    />
  );
};

export default MagicVideoFeature;
