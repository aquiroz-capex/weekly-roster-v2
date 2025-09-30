type ScheduleItem  = {
  week: number;
  days: Record<string, string>;
}

type RotationConfig = {
  timezone: string;
  sendTimeLocal: string;
  anchorDate: string;
  user: string;
  weekdays: string[];
  schedule: ScheduleItem[];
};

export type { RotationConfig };


