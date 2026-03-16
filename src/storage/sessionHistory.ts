import AsyncStorage from '@react-native-async-storage/async-storage';

export type CompletedSessionType = 'focus' | 'shortBreak' | 'longBreak';

export type SessionHistoryEntry = {
  id: string;
  sessionType: CompletedSessionType;
  durationSeconds: number;
  completedAt: number;
  tagId: string | null;
  tagName: string | null;
};

type SessionHistoryInput = {
  sessionType: CompletedSessionType;
  durationSeconds: number;
  completedAt?: number;
  tagId?: string | null;
  tagName?: string | null;
};

const SESSION_HISTORY_KEY = 'focusflow.sessionHistory.v1';
const MAX_SESSION_HISTORY = 2500;

const isValidSessionType = (value: unknown): value is CompletedSessionType => {
  return value === 'focus' || value === 'shortBreak' || value === 'longBreak';
};

const normalizeHistoryEntries = (input: unknown): SessionHistoryEntry[] => {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter(item => {
      if (!item || typeof item !== 'object') {
        return false;
      }

      const candidate = item as Partial<SessionHistoryEntry>;
      return (
        typeof candidate.id === 'string' &&
        isValidSessionType(candidate.sessionType) &&
        typeof candidate.durationSeconds === 'number' &&
        Number.isFinite(candidate.durationSeconds) &&
        candidate.durationSeconds > 0 &&
        typeof candidate.completedAt === 'number' &&
        Number.isFinite(candidate.completedAt)
      );
    })
    .map(item => {
      const candidate = item as SessionHistoryEntry;
      return {
        id: candidate.id,
        sessionType: candidate.sessionType,
        durationSeconds: Math.max(1, Math.round(candidate.durationSeconds)),
        completedAt: Math.round(candidate.completedAt),
        tagId: typeof candidate.tagId === 'string' ? candidate.tagId : null,
        tagName: typeof candidate.tagName === 'string' ? candidate.tagName : null,
      };
    });
};

export const readSessionHistory = async (): Promise<SessionHistoryEntry[]> => {
  try {
    const raw = await AsyncStorage.getItem(SESSION_HISTORY_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    return normalizeHistoryEntries(parsed).sort((a, b) => a.completedAt - b.completedAt);
  } catch {
    return [];
  }
};

export const appendSessionHistory = async ({
  sessionType,
  durationSeconds,
  completedAt = Date.now(),
  tagId = null,
  tagName = null,
}: SessionHistoryInput): Promise<void> => {
  if (!isValidSessionType(sessionType)) {
    return;
  }

  const normalizedDuration = Math.max(1, Math.round(durationSeconds));
  const normalizedCompletedAt = Math.round(completedAt);

  try {
    const existing = await readSessionHistory();

    const nextEntry: SessionHistoryEntry = {
      id: `${normalizedCompletedAt}-${Math.random().toString(36).slice(2, 9)}`,
      sessionType,
      durationSeconds: normalizedDuration,
      completedAt: normalizedCompletedAt,
      tagId,
      tagName,
    };

    const next = [...existing, nextEntry].slice(-MAX_SESSION_HISTORY);
    await AsyncStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(next));
  } catch {
    // Ignore persistence errors so timer flow stays uninterrupted.
  }
};
