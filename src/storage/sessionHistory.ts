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

export type SessionHistoryAudience = 'account' | 'guest';

type SessionHistoryInput = {
  sessionType: CompletedSessionType;
  durationSeconds: number;
  completedAt?: number;
  tagId?: string | null;
  tagName?: string | null;
};

const ACCOUNT_SESSION_HISTORY_KEY = 'focusflow.sessionHistory.v1';
const GUEST_SESSION_HISTORY_KEY = 'focusflow.guestSessionHistory.v1';
const MAX_SESSION_HISTORY = 2500;

const getSessionHistoryKey = (audience: SessionHistoryAudience) => {
  return audience === 'guest' ? GUEST_SESSION_HISTORY_KEY : ACCOUNT_SESSION_HISTORY_KEY;
};

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

const writeSessionHistory = async (
  audience: SessionHistoryAudience,
  entries: SessionHistoryEntry[],
): Promise<void> => {
  const next = normalizeHistoryEntries(entries)
    .sort((a, b) => a.completedAt - b.completedAt)
    .slice(-MAX_SESSION_HISTORY);

  await AsyncStorage.setItem(getSessionHistoryKey(audience), JSON.stringify(next));
};

export const readSessionHistory = async (
  audience: SessionHistoryAudience = 'account',
): Promise<SessionHistoryEntry[]> => {
  try {
    const raw = await AsyncStorage.getItem(getSessionHistoryKey(audience));
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
}: SessionHistoryInput, audience: SessionHistoryAudience = 'account'): Promise<void> => {
  if (!isValidSessionType(sessionType)) {
    return;
  }

  const normalizedDuration = Math.max(1, Math.round(durationSeconds));
  const normalizedCompletedAt = Math.round(completedAt);

  try {
    const existing = await readSessionHistory(audience);

    const nextEntry: SessionHistoryEntry = {
      id: `${normalizedCompletedAt}-${Math.random().toString(36).slice(2, 9)}`,
      sessionType,
      durationSeconds: normalizedDuration,
      completedAt: normalizedCompletedAt,
      tagId,
      tagName,
    };

    await writeSessionHistory(audience, [...existing, nextEntry]);
  } catch {
    // Ignore persistence errors so timer flow stays uninterrupted.
  }
};

export const hasGuestSessionHistory = async (): Promise<boolean> => {
  const entries = await readSessionHistory('guest');
  return entries.length > 0;
};

export const importGuestSessionHistory = async (): Promise<void> => {
  try {
    const [guestEntries, accountEntries] = await Promise.all([
      readSessionHistory('guest'),
      readSessionHistory('account'),
    ]);

    if (guestEntries.length === 0) {
      return;
    }

    await writeSessionHistory('account', [...accountEntries, ...guestEntries]);
    await AsyncStorage.removeItem(GUEST_SESSION_HISTORY_KEY);
  } catch {
    // Ignore import errors to avoid blocking sign-in.
  }
};

export const clearGuestSessionHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(GUEST_SESSION_HISTORY_KEY);
  } catch {
    // Ignore removal errors to avoid blocking sign-in.
  }
};
