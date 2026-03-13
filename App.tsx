/**
 * FocusFlow - Pomodoro Timer App
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnboardingScreen from './src/screens/OnboardingScreen';
import GmailLoginScreen from './src/screens/GmailLoginScreen';

function App() {
  const [screen, setScreen] = React.useState<'onboarding' | 'gmail-login'>('onboarding');

  return (
    <SafeAreaProvider>
      {screen === 'onboarding' ? (
        <OnboardingScreen
          onComplete={() => setScreen('gmail-login')}
          onLoginPress={() => setScreen('gmail-login')}
        />
      ) : (
        <GmailLoginScreen />
      )}
    </SafeAreaProvider>
  );
}

export default App;
