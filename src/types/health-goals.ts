
export interface Goal {
  id: string;
  title: string;
  category: string;
  progress: number; // 0-100
}

export interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType;
  category: string;
  isActive?: boolean;
}
