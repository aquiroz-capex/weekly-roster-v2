
import type { RotationConfig } from './types';
import { parseISO, differenceInCalendarWeeks } from 'date-fns';

const parseLocalDate = (isoDate: string): Date => parseISO(isoDate);

const getWeekIndexFromAnchor = (today: Date, anchorDateISO: string): number => {
  const anchor = parseLocalDate(anchorDateISO);
  const weeksSince = differenceInCalendarWeeks(today, anchor, { weekStartsOn: 1 });
  const mod = ((weeksSince % 4) + 4) % 4;
  return mod;
};

const getCurrentAndNextWeekIndices = (
  today: Date,
  anchorDateISO: string
): { currentIndex: number; nextIndex: number } => {
  const currentIndex = getWeekIndexFromAnchor(today, anchorDateISO);
  const nextIndex = (currentIndex + 1) % 4;
  return { currentIndex, nextIndex };
};

export type { RotationConfig };
export { parseLocalDate, getWeekIndexFromAnchor, getCurrentAndNextWeekIndices };
