/**
 * TimerContext — persists timer state across screen navigation.
 * HomeScreen reads/writes here; the state survives unmounting.
 */
import React from 'react';

export type TimerSessionType = 'focus' | 'shortBreak' | 'longBreak';

const DEFAULT_FOCUS_MS = 25 * 60 * 1000;

type TimerContextValue = {
  remainingMs: number;
  totalDurationMs: number;
  sessionType: TimerSessionType;
  isRunning: boolean;
  hasStarted: boolean;
  completedFocusCycles: number;
  timerRunVersion: number;
  setRemainingMs: React.Dispatch<React.SetStateAction<number>>;
  setTotalDurationMs: React.Dispatch<React.SetStateAction<number>>;
  setSessionType: React.Dispatch<React.SetStateAction<TimerSessionType>>;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setHasStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setCompletedFocusCycles: React.Dispatch<React.SetStateAction<number>>;
  setTimerRunVersion: React.Dispatch<React.SetStateAction<number>>;
};

const TimerContext = React.createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [remainingMs, setRemainingMs] = React.useState(DEFAULT_FOCUS_MS);
  const [totalDurationMs, setTotalDurationMs] = React.useState(DEFAULT_FOCUS_MS);
  const [sessionType, setSessionType] = React.useState<TimerSessionType>('focus');
  const [isRunning, setIsRunning] = React.useState(false);
  const [hasStarted, setHasStarted] = React.useState(false);
  const [completedFocusCycles, setCompletedFocusCycles] = React.useState(0);
  const [timerRunVersion, setTimerRunVersion] = React.useState(0);

  return (
    <TimerContext.Provider
      value={{
        remainingMs,
        totalDurationMs,
        sessionType,
        isRunning,
        hasStarted,
        completedFocusCycles,
        timerRunVersion,
        setRemainingMs,
        setTotalDurationMs,
        setSessionType,
        setIsRunning,
        setHasStarted,
        setCompletedFocusCycles,
        setTimerRunVersion,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext(): TimerContextValue {
  const ctx = React.useContext(TimerContext);
  if (!ctx) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return ctx;
}
