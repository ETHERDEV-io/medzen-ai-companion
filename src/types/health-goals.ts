
export interface Goal {
  id: string;
  title: string;
  startDate: string;     // YYYY-MM-DD
  endDate: string;       // YYYY-MM-DD
  everyDay: boolean;     // if true, goal repeats every day within date range
  exercise?: string;     // user may add exercise name
  caloriesBurnTarget?: number;
  caloriesBurnedToday?: number; // Track how much burned today
  progress: number;      // 0-100, calculated daily
  completedToday: boolean; // Calculated daily for progress wheel
}

