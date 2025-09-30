import { describe, expect, it } from 'vitest';
import { getWeekIndexFromAnchor, getCurrentAndNextWeekIndices, parseLocalDate } from './date';

describe('rotation logic', () => {
  it('computes week index from anchor (0..3)', () => {
    const anchor = '2025-09-20';
    const d0 = parseLocalDate('2025-09-20'); // same week
    const d1 = new Date(d0.getTime() + 7 * 24 * 60 * 60 * 1000);
    const d2 = new Date(d0.getTime() + 2 * 7 * 24 * 60 * 60 * 1000);
    const d3 = new Date(d0.getTime() + 3 * 7 * 24 * 60 * 60 * 1000);
    const d4 = new Date(d0.getTime() + 4 * 7 * 24 * 60 * 60 * 1000);

    expect(getWeekIndexFromAnchor(d0, anchor)).toBe(0);
    expect(getWeekIndexFromAnchor(d1, anchor)).toBe(1);
    expect(getWeekIndexFromAnchor(d2, anchor)).toBe(2);
    expect(getWeekIndexFromAnchor(d3, anchor)).toBe(3);
    expect(getWeekIndexFromAnchor(d4, anchor)).toBe(0);
  });

  it('returns current and next indices', () => {
    const anchor = '2025-09-20';
    const today = parseLocalDate('2025-10-04'); // two weeks after -> index 2
    const { currentIndex, nextIndex } = getCurrentAndNextWeekIndices(today, anchor);
    expect(currentIndex).toBe(2);
    expect(nextIndex).toBe(3);
  });
});


