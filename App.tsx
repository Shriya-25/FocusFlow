/**
 * FocusFlow - Pomodoro Timer App
 * @format
 */

import React from 'react';
import { Alert, View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnboardingScreen from './src/screens/OnboardingScreen';
import GmailLoginScreen from './src/screens/GmailLoginScreen';

type Screen = 'onboarding' | 'gmail-login' | 'home';

function HomeScreen({ userName }: { userName: string }) {
  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.title}>Welcome, {userName}! 🎯</Text>
      <Text style={homeStyles.subtitle}>Your focus session awaits.</Text>
    </View>
  );
}

const homeStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0c29' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: '#a78bfa', fontSize: 16 },
});

function App() {
  const [screen, setScreen] = React.useState<Screen>('onboarding');
  const [userName, setUserName] = React.useState('');

  const handleGoogleLogin = async () => {
    try {
      const { signInWithGoogle } = await import('./src/services/authService');
      const userCredential = await signInWithGoogle();
      const name = userCredential.user.displayName ?? userCredential.user.email ?? 'User';
      setUserName(name);
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
      ) : (
        <HomeScreen userName={userName} />
      )}
    </SafeAreaProvider>
  );
}

export default App;

export default App;
