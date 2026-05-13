"use client";

import SyncStudioComponent from "../../components/syncstudio/syncstudio";
import { FeatureGenerateProps } from "../../types";
import { toast } from "sonner";

interface SyncStudioFeatureProps
  extends FeatureGenerateProps { }

const SyncStudioFeature: React.FC<
  SyncStudioFeatureProps
> = ({ onGenerate }) => {
  const handleGenerate = (jobId?: string) => {
    toast.success(
      "Generating synced video"
    );
    onGenerate(jobId);
  };

  return (
    <SyncStudioComponent
      onGenerate={handleGenerate}
    />
  );
};

export default SyncStudioFeature;
