import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const SETTINGS_STORAGE_KEY = 'focusflow_settings';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export type FocusFlowSettings = {
  focusDuration: number;
  shortBreak: number;
  longBreak: number;
  cycles: number;
  timerSound: boolean;
  notifications: boolean;
  darkMode: boolean;
};

export const DEFAULT_SETTINGS: FocusFlowSettings = {
  focusDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  cycles: 4,
  timerSound: true,
  notifications: true,
  darkMode: true,
};

type SettingsState = FocusFlowSettings & {
  isHydrated: boolean;
  updateSettings: (next: Partial<FocusFlowSettings>) => void;
  setHydrated: (value: boolean) => void;
};

const sanitizeSettings = (
  current: FocusFlowSettings,
  incoming: Partial<FocusFlowSettings>,
): FocusFlowSettings => {
  const merged: FocusFlowSettings = {
    ...current,
    ...incoming,
  };

  const focusDuration = clamp(Math.round(merged.focusDuration), 5, 60);
  const shortBreak = clamp(Math.round(merged.shortBreak), 1, 15);
  let longBreak = clamp(Math.round(merged.longBreak), 10, 30);
  const cycles = clamp(Math.round(merged.cycles), 2, 8);

  if (longBreak <= shortBreak) {
    longBreak = clamp(shortBreak + 1, 10, 30);
  }

  return {
    focusDuration,
    shortBreak,
    longBreak,
    cycles,
    timerSound: Boolean(merged.timerSound),
    notifications: Boolean(merged.notifications),
    darkMode: Boolean(merged.darkMode),
  };
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      ...DEFAULT_SETTINGS,
      isHydrated: false,
      updateSettings: next => {
        set(state => sanitizeSettings(state, next));
      },
      setHydrated: value => {
        set({ isHydrated: value });
      },
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        focusDuration: state.focusDuration,
        shortBreak: state.shortBreak,
        longBreak: state.longBreak,
        cycles: state.cycles,
        timerSound: state.timerSound,
        notifications: state.notifications,
        darkMode: state.darkMode,
      }),
      onRehydrateStorage: () => state => {
        state?.setHydrated(true);
      },
      merge: (persistedState, currentState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return { ...currentState };
        }

        return {
          ...currentState,
          ...sanitizeSettings(
            DEFAULT_SETTINGS,
            persistedState as Partial<FocusFlowSettings>,
          ),
        };
      },
    },
  ),
);

export const hydrateSettingsStore = async () => {
  if (useSettingsStore.persist.hasHydrated()) {
    return;
  }

  await useSettingsStore.persist.rehydrate();
};
