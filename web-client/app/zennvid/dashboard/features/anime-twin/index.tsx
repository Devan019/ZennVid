"use client";

import AnimeMatcherComponent from "../../components/anime-matcher/anime-matcher";
import { FeatureGenerateProps } from "../../types";
import { toast } from "sonner";

interface AnimeTwinFeatureProps
  extends FeatureGenerateProps { }

const AnimeTwinFeature: React.FC<
  AnimeTwinFeatureProps
> = ({ onGenerate }) => {
  const handleGenerate = (jobId?: string) => {
    toast.success(
      "Generating anime twin match"
    );
    onGenerate(jobId);
  };

  return (
    <AnimeMatcherComponent />
  );
};

export default AnimeTwinFeature;
