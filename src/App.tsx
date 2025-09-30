import React, { useEffect, useMemo, useState } from 'react';

import { getCurrentAndNextWeekIndices } from './lib/date';
import rotationConfig from '../config/rotation.json';
import type { RotationConfig } from './lib/types';

const config = rotationConfig as RotationConfig;

const App: React.FC = () => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const { currentIndex, nextIndex } = useMemo(
    () => getCurrentAndNextWeekIndices(now, config.anchorDate),
    [now]
  );

  return (
    <main className="mx-auto max-w-fit p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">WeekRoster</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
          Timezone: <span className="font-medium">{config.timezone}</span> · Current date: {now.toLocaleString('en-US', { timeZone: config.timezone })}
        </p>
      </header>
      <section aria-label="4-week rotation table">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table
            role="grid"
            className="min-w-max w-full text-left whitespace-nowrap"
            style={{ tableLayout: 'auto' }}
          >
            <thead className="bg-gray-50 dark:bg-gray-900/40 text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-2 min-w-[90px]">Week</th>
                <th className="px-4 py-2 min-w-[90px]">Status</th>
                {config.weekdays.map((d) => (
                  <th key={d} className="px-4 py-2 min-w-[180px]">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {config.schedule.map((week, idx) => {
                const isCurrent = idx === currentIndex;
                const isNext = idx === nextIndex;
                const rowClass = isCurrent
                  ? 'bg-blue-200 dark:bg-blue-700 border-l-8 border-blue-600'
                  : isNext
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-l-8 border-blue-300'
                  : '';
                const status = isCurrent ? 'Current' : isNext ? 'Next' : '';
                return (
                  <tr key={week.week} className={`${rowClass}`}>
                    <td className="px-4 py-2 min-w-[90px]">Type {week.week}</td>
                    <td className="px-4 py-2 min-w-[90px]" aria-label={status}>{status}</td>
                    {config.weekdays.map((d) => {
                      const cell = week.days[d] ?? '';
                      const normalize = (str: string) => str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
                      const userNorm = normalize(config.user).toLowerCase();
                      const cellNorm = normalize(cell).toLowerCase();
                      if (cellNorm.includes(userNorm)) {
                        const regex = new RegExp(`(${config.user})`, 'giu');
                        const parts = cell.split(regex);
                        return (
                          <td key={d} className="px-4 py-2 min-w-[180px]">
                            {parts.map((part, i) =>
                              normalize(part).toLowerCase() === userNorm ? (
                                <span
                                  key={i}
                                  className={
                                    idx === currentIndex
                                      ? 'bg-white border-2  text-blue-700 font-bold rounded px-1'
                                      : 'bg-blue-200 dark:bg-blue-500 text-blue-900 dark:text-white font-bold rounded px-1'
                                  }
                                >
                                  {part}
                                </span>
                              ) : (
                                <React.Fragment key={i}>{part}</React.Fragment>
                              )
                            )}
                          </td>
                        );
                      } else if (/TODOS presencial \(planificación\)/i.test(cell)) {
                        return (
                          <td key={d} className="px-4 py-2 min-w-[180px]">
                            <span
                              className={
                                idx === currentIndex
                                  ? 'bg-white border-2 border-blue-600 text-blue-700 font-bold rounded px-1'
                                  : 'bg-blue-200 dark:bg-blue-500 text-blue-900 dark:text-white font-bold rounded px-1'
                              }
                            >
                              {cell}
                            </span>
                          </td>
                        );
                      } else {
                        return (
                          <td key={d} className="px-4 py-2 min-w-[180px]">{cell}</td>
                        );
                      }
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export { App };


