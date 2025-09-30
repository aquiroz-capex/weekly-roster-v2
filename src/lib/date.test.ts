import { describe, expect, it } from 'vitest';

import { getWeekIndexFromAnchor, getCurrentAndNextWeekIndices, parseLocalDate } from './date';
import { addWeeks } from 'date-fns';

describe('rotation logic', () => {
  it('computes week index from anchor (0..3)', () => {
    const anchor = '2025-09-20';
    const d0 = parseLocalDate('2025-09-20'); // same week
    const d1 = addWeeks(d0, 1);
    const d2 = addWeeks(d0, 2);
    const d3 = addWeeks(d0, 3);
    const d4 = addWeeks(d0, 4);

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


