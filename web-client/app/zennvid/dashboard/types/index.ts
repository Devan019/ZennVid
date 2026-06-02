// Dashboard Tab Types
export type DashboardTab =
  | "magic-video"
  | "syncstudio"
  | "your-videos"

export interface PageMeta {
  eyebrow: string;
  title: string;
  description: string;
}

export interface DashboardFeature {
  tab: DashboardTab;
  href: string;
  icon: string;
  label: string;
  tooltip: string;
}

export interface FeatureGenerateProps {
  onGenerate: (jobId?: string) => void;
}
