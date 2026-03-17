# FocusFlow

FocusFlow is a Pomodoro-style focus timer app built with React Native.

## Features

- Configurable focus, short break, and long break durations.
- Daily goal tracking and session progress persistence.
- Session history for both guest and signed-in users.
- Google sign-in support backed by Firebase Authentication.
- Analytics-ready architecture with dedicated statistics screens.

## Tech Stack

- React Native 0.84
- TypeScript
- React Navigation
- Zustand + AsyncStorage
- Firebase Auth + Google Sign-In

## Local Development

1. Install dependencies:

	npm install

2. Start Metro:

	npm start

3. Run Android:

	npm run android

4. Run iOS (macOS only):

	npm run ios

## Useful Scripts

- npm run start
- npm run android
- npm run ios
- npm run lint
- npm run test

## Notes

- Keep Firebase credential files out of version control.
- If native dependencies change, reinstall iOS pods before running on iOS.
