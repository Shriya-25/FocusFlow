# FocusFlow — Pomodoro Timer App

> A beautifully designed, feature-rich Pomodoro timer built with React Native. FocusFlow helps you stay focused, track your productivity, and build consistent deep-work habits — all from your Android device.

---

## App Preview

| Timer Screen | Statistics | Profile |
|:---:|:---:|:---:|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

---

## Features

- **Pomodoro Timer** — Customizable focus, short-break, and long-break durations with a smooth circular countdown
- **Persistent Timer State** — Timer continues running even when you navigate to other screens; resumes right where you left it
- **Session Tagging** — Tag each focus session (e.g. Study, Work, Personal) to categorize your productivity
- **Daily Goal Tracking** — Set a daily Pomodoro goal and track progress in real time
- **Session History** — Every completed session is saved locally, giving you a full productivity log
- **Statistics Dashboard** — Visual heatmap of activity, streak calendar, and session breakdowns
- **Profile & Badges** — Dynamic user profile showing real focus hours, streak days, and completed Pomodoros
- **Google Sign-In** — Authenticate with your Google account via Firebase
- **Guest Mode** — Skip login and get straight to focusing
- **Persistent Login** — Your session is remembered across app restarts
- **Onboarding Flow** — First-launch onboarding, shown only once
- **Hardware Back Button** — Custom navigation history stack; back button navigates within the app, not away from it
- **Sound Effects** — Ambient sounds and timer-end notifications via a dedicated sound service
- **Settings** — Control timer durations, sounds, themes, and more via Zustand-backed settings store

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.84 (bare workflow) |
| Language | TypeScript |
| Authentication | Firebase Auth + `@react-native-google-signin/google-signin` |
| State Management | React Context (`TimerContext`) + Zustand (`settingsStore`) |
| Local Storage | `@react-native-async-storage/async-storage` |
| UI / Animations | React Native `Animated` API, `react-native-linear-gradient`, `react-native-svg` |
| Navigation | Custom stack navigator (no React Navigation) — `useState` + history ref + `BackHandler` |
| Timer Logic | `Date.now()` delta with `setInterval`, persisted via `TimerContext` |
| Build System | Metro Bundler, Gradle (Android) |
| Package Manager | npm |

---

## Folder Structure

```
FocusFlow/
├── App.tsx                  # Root component — routing, session restore, back handler
├── index.js                 # Entry point
├── src/
│   ├── assets/
│   │   ├── avatars/         # User avatar images
│   │   ├── icons/           # App icon assets
│   │   └── sounds/          # Timer & ambient sound files
│   ├── components/
│   │   ├── Buttons/         # Reusable button components
│   │   ├── Charts/          # Chart components for statistics
│   │   ├── Heatmap/         # Activity heatmap component
│   │   ├── Icons/           # App icon components (AppIcons.tsx)
│   │   └── Timer/           # Timer display components
│   ├── context/
│   │   └── TimerContext.tsx  # Global timer state provider
│   ├── navigation/          # Navigation helpers / type definitions
│   ├── screens/
│   │   ├── HomeScreen.tsx        # Main Pomodoro timer screen
│   │   ├── StatisticsScreen.tsx  # Sessions heatmap & analytics
│   │   ├── ProfileScreen.tsx     # User profile with dynamic stats
│   │   ├── SettingsScreen.tsx    # App settings
│   │   ├── GmailLoginScreen.tsx  # Google Sign-In screen
│   │   ├── OnboardingScreen.tsx  # First-launch onboarding
│   │   └── AboutPomodoroScreen.tsx
│   ├── services/
│   │   ├── authService.ts    # Firebase auth helpers
│   │   └── soundService.ts   # Sound playback service
│   ├── storage/
│   │   ├── sessionHistory.ts # Read/write Pomodoro session records
│   │   ├── dailyGoal.ts      # Daily goal persistence
│   │   └── settingsStore.ts  # Zustand settings store
│   └── utils/
│       └── brand.ts          # Brand colors & typography constants
├── android/                 # Android native project
├── ios/                     # iOS native project
└── __tests__/               # Jest test suite
```

---

## Architecture

### Navigation

FocusFlow uses a **custom navigation stack** instead of React Navigation:

```
App.tsx
 ├── screenHistoryRef (useRef<string[]>)   ← history stack
 ├── navigateTo(screen)    → push current screen, set new screen
 ├── navigateBack()        → pop history, returns true (swallows HW back event)
 └── BackHandler.addEventListener('hardwareBackPress', navigateBack)
```

### Timer State

All timer state lives in `TimerContext` and persists across screen navigation:

```
TimerProvider (wraps entire app in App.tsx)
 └── TimerContext
      ├── remainingMs          ← milliseconds left in current session
      ├── totalDurationMs      ← total duration of current session type
      ├── sessionType          ← 'focus' | 'shortBreak' | 'longBreak'
      ├── isRunning            ← timer ticking?
      ├── hasStarted           ← has user pressed play at least once?
      ├── completedFocusCycles ← count of completed focus rounds
      └── timerRunVersion      ← version key to restart interval on resume
```

When the user navigates away from `HomeScreen`, the **pause-on-unmount** effect saves `remainingMs` and pauses the timer. On return, the timer resumes from where it left off.

### Session Persistence

```
App launch
 └── AsyncStorage.getItem('userSession')
      ├── Found  → restore name/photo/auth state → navigate to 'home'
      ├── Not found + hasSeenOnboarding → navigate to 'gmail-login'
      └── Fresh install → navigate to 'onboarding'
```

---

## App Flow

```
First Launch
  Onboarding → Gmail Login (or Skip as Guest) → Home

Returning User (with saved session)
  Splash → Home  (login screen skipped entirely)

Returning User (no saved session)
  Splash → Login Screen

Navigation (from Home)
  Home ↔ Statistics ↔ Profile ↔ Settings
  (Timer keeps running in background across all screens)

Pomodoro Cycle
  Focus (25 min) → Short Break (5 min) → [×4] → Long Break (15 min)
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **JDK** 17
- **Android Studio** with Android SDK (API 34+)
- **Android device** or emulator
- A **Firebase project** with Google Sign-In enabled

### Installation

```sh
# 1. Clone the repository
git clone https://github.com/Shriya-25/FocusFlow.git
cd FocusFlow

# 2. Install dependencies
npm install

# 3. Start Metro bundler
npx react-native start --reset-cache

# 4. (Physical device only) Forward Metro port to device
adb reverse tcp:8081 tcp:8081

# 5. Run on Android
npx react-native run-android
```

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Add an Android app with package name `com.focusflow`
3. Download `google-services.json` and place it at `android/app/google-services.json`
4. Enable **Google Sign-In** under Authentication → Sign-in method
5. Add your **SHA-1** fingerprint to the Firebase Android app settings

---

## Future Improvements

- [ ] iOS support and App Store release
- [ ] Cloud sync — back up session history to Firebase Firestore
- [ ] Widgets — home-screen timer widget (Android)
- [ ] Focus music — integrated lo-fi/ambient music player
- [ ] Team mode — shared focus rooms with friends
- [ ] Detailed analytics — weekly/monthly productivity reports
- [ ] Notification support — local push notifications on session end
- [ ] Dark / Light theme toggle

---

## Contributing

Contributions are welcome! Here's how:

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature`
5. Open a Pull Request

Please keep PRs focused and include a clear description of what changed and why.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">Built with ❤️ by Shriya</div>

