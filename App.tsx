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

type Screen = 'onboarding' | 'gmail-login' | 'home' | 'profile';

function App() {
  const [screen, setScreen] = React.useState<Screen>('onboarding');
  const [userName, setUserName] = React.useState('');
  const [userPhoto, setUserPhoto] = React.useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = React.useState('🦁');

  const handleGoogleLogin = async () => {
    try {
      const { signInWithGoogle } = await import('./src/services/authService');
      const userCredential = await signInWithGoogle();
      const name = userCredential.user.displayName ?? userCredential.user.email ?? 'User';
      const photo = userCredential.user.photoURL ?? null;
      setUserName(name);
      setUserPhoto(photo);
      setScreen('home');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in right now.';
      Alert.alert('Google Sign-In failed', message);
    }
  };

  const handleSkip = () => {
    setUserName('Guest');
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
        <GmailLoginScreen onGoogleLogin={handleGoogleLogin} onSkip={handleSkip} />
      ) : screen === 'profile' ? (
        <ProfileScreen
          userName={userName}
          userPhoto={userPhoto}
          selectedAvatar={selectedAvatar}
          onAvatarChange={setSelectedAvatar}
          onBack={() => setScreen('home')}
        />
      ) : (
        <HomeScreen
          userName={userName}
          userPhoto={userPhoto}
          avatarEmoji={selectedAvatar}
          onProfilePress={() => setScreen('profile')}
        />
      )}
    </SafeAreaProvider>
  );
}

export default App;
