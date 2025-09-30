import React, { useEffect, useMemo, useState } from 'react';
import { getCurrentAndNextWeekIndices } from './lib/date';
import rotationConfig from '../config/rotation.json';
import type { RotationConfig } from './lib/types';

type RotationConfig = {
  timezone: string;
  sendTimeLocal: string;
  anchorDate: string;
  labels: [string, string, string, string];
};

const config = rotationConfig as RotationConfig;
const formatNextSend = (timezone: string, hhmm: string): string => `Sunday ${hhmm} ${timezone}`;

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
    <main className="mx-auto max-w-3xl p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">WeekRoster</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
          Timezone: <span className="font-medium">{config.timezone}</span> · Next send: {formatNextSend(config.timezone, config.sendTimeLocal)}
        </p>
      </header>
      <section aria-label="4-week rotation table">
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
          <table role="grid" className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/40 text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-3 py-2">Week</th>
                <th className="px-3 py-2">Label</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {config.labels.map((label, idx) => {
                const isCurrent = idx === currentIndex;
                const isNext = idx === nextIndex;
                const rowClass = isCurrent
                  ? 'bg-orange-50 dark:bg-orange-900/20 ring-2 ring-orange-600'
                  : isNext
                  ? 'bg-sky-50/50 dark:bg-sky-900/10 ring-1 ring-dashed ring-sky-600'
                  : '';
                const status = isCurrent ? 'Current' : isNext ? 'Next' : '';
                return (
                  <tr key={label} className={`${rowClass}`}>
                    <td className="px-3 py-2">Type {idx + 1}</td>
                    <td className="px-3 py-2">{label}</td>
                    <td className="px-3 py-2" aria-label={status}>{status}</td>
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


