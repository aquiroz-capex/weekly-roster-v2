import React, { useEffect, useMemo, useState } from 'react';
import './app-theme.css';

import { getCurrentAndNextWeekIndices } from './lib/date';
import rotationConfig from '../config/rotation.json';
import type { RotationConfig } from './lib/types';

const config = rotationConfig as RotationConfig;

const App: React.FC = () => {
  const [now, setNow] = useState<Date>(new Date());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      const root = document.documentElement;
      const body = document.body;
      const bodyBg = getComputedStyle(root).getPropertyValue('--body-bg');
      body.style.background = bodyBg;
    }
  }, [theme]);

  const { currentIndex, nextIndex } = useMemo(
    () => getCurrentAndNextWeekIndices(now, config.anchorDate),
    [now]
  );

  return (
    <main className="app-main">
      <header className="app-header">
        <div>
          <h1 className="app-title">WeekRoster</h1>
          <p className="app-meta" aria-live="polite">
            Timezone: <span className="font-medium">{config.timezone}</span> · Current date: {now.toLocaleString('en-US', { timeZone: config.timezone })}
          </p>
        </div>
        <button
          type="button"
          aria-label="Toggle dark mode"
          className="theme-toggle-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.75 15.5a7.25 7.25 0 0 1-7.25-7.25c0-1.61.52-3.1 1.41-4.3A.75.75 0 0 0 10.5 2a9 9 0 1 0 11.5 11.5a.75.75 0 0 0-1.95-.41a7.22 7.22 0 0 1-2.3.41Z"/></svg>
          ) : (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 18a6 6 0 1 0 0-12a6 6 0 0 0 0 12Zm0 4a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm0-20a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm10 9h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2ZM4 12a1 1 0 0 1-1-1H2a1 1 0 1 1 0 2h1a1 1 0 0 1 1-1Zm13.66 6.66a1 1 0 0 1 0-1.41l.7-.7a1 1 0 1 1 1.41 1.41l-.7.7a1 1 0 0 1-1.41 0ZM5.64 5.64a1 1 0 0 1 0-1.41a1 1 0 0 1 1.41 0l.7.7A1 1 0 0 1 6.34 7.05l-.7-.7Zm12.02 0l.7-.7a1 1 0 1 1 1.41 1.41l-.7.7a1 1 0 1 1-1.41-1.41ZM5.64 18.36l-.7.7a1 1 0 1 1-1.41-1.41l.7-.7a1 1 0 1 1 1.41 1.41Z"/></svg>
          )}
          {theme === 'dark' ? 'Dark' : 'Light'} mode
        </button>
      </header>
      <section className="app-table-section" aria-label="4-week rotation table">
        <div className="app-table-container">
          <table
            role="grid"
            className="app-table"
            style={{ tableLayout: 'auto' }}
          >
            <thead className="app-thead">
              <tr>
                <th className="app-cell app-cell-week">Week</th>
                <th className="app-cell app-cell-status">Status</th>
                {config.weekdays.map((d) => (
                  <th key={d} className="app-cell">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {config.schedule.map((week, idx) => {
                const isCurrent = idx === currentIndex;
                const isNext = idx === nextIndex;
                const rowClass = isCurrent
                  ? 'app-row-current'
                  : isNext
                  ? 'app-row-next'
                  : '';
                const status = isCurrent ? 'Current' : isNext ? 'Next' : '';
                return (
                  <tr key={week.week} className={rowClass}>
                    <td className="app-cell app-cell-week">Type {week.week}</td>
                    <td className="app-cell app-cell-status" aria-label={status}>{status}</td>
                    {config.weekdays.map((d) => {
                      const cell = week.days[d] ?? '';
                      const normalize = (str: string) => str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
                      const userNorm = normalize(config.user).toLowerCase();
                      const cellNorm = normalize(cell).toLowerCase();
                      if (cellNorm.includes(userNorm)) {
                        const regex = new RegExp(`(${config.user})`, 'giu');
                        const parts = cell.split(regex);
                        return (
                          <td key={d} className="app-cell">
                            {parts.map((part, i) =>
                              normalize(part).toLowerCase() === userNorm ? (
                                <span
                                  key={i}
                                  className={
                                    idx === currentIndex
                                      ? 'app-highlight'
                                      : 'app-highlight'
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
                          <td key={d} className="app-cell">
                            <span
                              className={
                                idx === currentIndex
                                  ? 'app-highlight'
                                  : 'app-highlight'
                              }
                            >
                              {cell}
                            </span>
                          </td>
                        );
                      } else {
                        return (
                          <td key={d} className="app-cell">{cell}</td>
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


