import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEFAULT_DAILY_GOAL = 5;

const DAILY_GOAL_STORAGE_KEY = 'focusflow.dailyGoalProgress';

export type DailyGoalProgress = {
  dailyGoal: number;
  sessionsCompletedToday: number;
  lastUpdatedDate: string;
};

const createDefaultDailyGoalProgress = (): DailyGoalProgress => ({
  dailyGoal: DEFAULT_DAILY_GOAL,
  sessionsCompletedToday: 0,
  lastUpdatedDate: toDateKey(),
});

const toDateKey = (value: Date | number = Date.now()) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeDailyGoalProgress = (input: unknown): DailyGoalProgress => {
  const todayKey = toDateKey();

  if (!input || typeof input !== 'object') {
    return createDefaultDailyGoalProgress();
  }

  const candidate = input as Partial<DailyGoalProgress>;
  const dailyGoal = Number.isFinite(candidate.dailyGoal)
    ? Math.max(1, Math.round(candidate.dailyGoal as number))
    : DEFAULT_DAILY_GOAL;
  const sessionsCompletedToday = Number.isFinite(candidate.sessionsCompletedToday)
    ? Math.max(0, Math.round(candidate.sessionsCompletedToday as number))
    : 0;
  const lastUpdatedDate = typeof candidate.lastUpdatedDate === 'string' && candidate.lastUpdatedDate.length > 0
    ? candidate.lastUpdatedDate
    : todayKey;

  if (lastUpdatedDate !== todayKey) {
    return {
      dailyGoal,
      sessionsCompletedToday: 0,
      lastUpdatedDate: todayKey,
    };
  }

  return {
    dailyGoal,
    sessionsCompletedToday,
    lastUpdatedDate,
  };
};

const persistDailyGoalProgress = async (progress: DailyGoalProgress) => {
  await AsyncStorage.setItem(DAILY_GOAL_STORAGE_KEY, JSON.stringify(progress));
};

export const readDailyGoalProgress = async (): Promise<DailyGoalProgress> => {
  try {
    const raw = await AsyncStorage.getItem(DAILY_GOAL_STORAGE_KEY);
    const normalized = normalizeDailyGoalProgress(raw ? JSON.parse(raw) as unknown : null);
    await persistDailyGoalProgress(normalized);
    return normalized;
  } catch {
    return createDefaultDailyGoalProgress();
  }
};

export const syncDailyGoalProgress = async (): Promise<DailyGoalProgress> => {
  try {
    const progress = await readDailyGoalProgress();
    const todayKey = toDateKey();

    if (progress.lastUpdatedDate === todayKey) {
      return progress;
    }

    const resetProgress: DailyGoalProgress = {
      dailyGoal: progress.dailyGoal,
      sessionsCompletedToday: 0,
      lastUpdatedDate: todayKey,
    };

    await persistDailyGoalProgress(resetProgress);
    return resetProgress;
  } catch {
    return createDefaultDailyGoalProgress();
  }
};

export const incrementDailyGoalSessions = async (): Promise<DailyGoalProgress> => {
  try {
    const progress = await syncDailyGoalProgress();
    const nextProgress: DailyGoalProgress = {
      ...progress,
      sessionsCompletedToday: progress.sessionsCompletedToday + 1,
      lastUpdatedDate: toDateKey(),
    };

    await persistDailyGoalProgress(nextProgress);
    return nextProgress;
  } catch {
    return createDefaultDailyGoalProgress();
  }
};