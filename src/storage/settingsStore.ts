import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const SETTINGS_STORAGE_KEY = 'focusflow_settings';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Round value to the nearest allowed step, then clamp within [min, max]. */
const snapToStep = (value: number, step: number, min: number, max: number) => {
  const snapped = Math.round((value - min) / step) * step + min;
  return clamp(snapped, min, max);
};

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

  // Focus: 15–60 min, step 5
  const focusDuration = snapToStep(merged.focusDuration, 5, 15, 60);
  // Short break: 5–15 min, step 5
  const shortBreak = snapToStep(merged.shortBreak, 5, 5, 15);
  // Long break: 15–30 min, step 5
  const longBreak = snapToStep(merged.longBreak, 5, 15, 30);
  // Cycles: 2–6, step 1
  const cycles = clamp(Math.round(merged.cycles), 2, 6);

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
