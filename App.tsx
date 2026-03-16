/**
 * FocusFlow - Pomodoro Timer App
 * @format
 */

import React from 'react';
import { Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnboardingScreen from './src/screens/OnboardingScreen';
import GmailLoginScreen from './src/screens/GmailLoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutPomodoroScreen from './src/screens/AboutPomodoroScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import { hydrateSettingsStore } from './src/storage/settingsStore';

type Screen =
  | 'onboarding'
  | 'gmail-login'
  | 'home'
  | 'profile'
  | 'settings'
  | 'about-pomodoro'
  | 'statistics';

function App() {
  const [screen, setScreen] = React.useState<Screen>('onboarding');
  const [userName, setUserName] = React.useState('');
  const [userPhoto, setUserPhoto] = React.useState<string | null>(null);
  const [selectedAvatar] = React.useState('🦁');
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  React.useEffect(() => {
    hydrateSettingsStore().catch(() => undefined);
  }, []);

  const handleGoogleLogin = async (targetScreen: 'home' | 'profile' = 'home') => {
    if (isSigningIn) {
      return;
    }

    setIsSigningIn(true);

    try {
      const { signInWithGoogle } = await import('./src/services/authService');
      const userCredential = await signInWithGoogle();
      const name = userCredential.user.displayName ?? userCredential.user.email ?? 'User';
      const photo = userCredential.user.photoURL ?? null;
      setUserName(name);
      setUserPhoto(photo);
      setIsAuthenticated(true);
      setScreen(targetScreen);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in right now.';
      Alert.alert('Google Sign-In failed', message);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSkip = () => {
    setUserName('Guest');
    setUserPhoto(null);
    setIsAuthenticated(false);
    setScreen('home');
  };

  return (
    <SafeAreaProvider>
      {screen === 'onboarding' ? (
        <OnboardingScreen
          onComplete={() => setScreen('gmail-login')}
          onLoginPress={() => setScreen('gmail-login')}
        />
      ) : screen === 'gmail-login' ? (
        <GmailLoginScreen onGoogleLogin={() => handleGoogleLogin('home')} onSkip={handleSkip} />
      ) : screen === 'profile' ? (
        <ProfileScreen
          userName={userName}
          userPhoto={userPhoto}
          selectedAvatar={selectedAvatar}
          isGuest={!isAuthenticated}
          isSigningIn={isSigningIn}
          onGuestSignIn={() => handleGoogleLogin('profile')}
          onBack={() => setScreen('home')}
        />
      ) : screen === 'settings' ? (
        <SettingsScreen
          onBack={() => setScreen('home')}
          onAboutPomodoroPress={() => setScreen('about-pomodoro')}
        />
      ) : screen === 'about-pomodoro' ? (
        <AboutPomodoroScreen onBack={() => setScreen('settings')} />
      ) : screen === 'statistics' ? (
        <StatisticsScreen onBack={() => setScreen('home')} />
      ) : (
        <HomeScreen
          userName={userName}
          userPhoto={userPhoto}
          avatarEmoji={selectedAvatar}
          onProfilePress={() => setScreen('profile')}
          onStatisticsPress={() => setScreen('statistics')}
          onSettingsPress={() => setScreen('settings')}
        />
      )}
    </SafeAreaProvider>
  );
}

export default App;
