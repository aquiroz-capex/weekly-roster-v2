import type { RotationConfig } from './types';

const parseLocalDate = (isoDate: string): Date => {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

const getWeekIndexFromAnchor = (today: Date, anchorDateISO: string): number => {
  const anchor = parseLocalDate(anchorDateISO);
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const diffMs = today.getTime() - anchor.getTime();
  const weeksSince = Math.floor(diffMs / msPerWeek);
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
