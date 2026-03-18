/**
 * FocusFlow - Pomodoro Timer App
 * @format
 */

import React from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnboardingScreen from './src/screens/OnboardingScreen';
import GmailLoginScreen from './src/screens/GmailLoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutPomodoroScreen from './src/screens/AboutPomodoroScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import { hydrateSettingsStore } from './src/storage/settingsStore';
import {
  clearGuestSessionHistory,
  hasGuestSessionHistory,
  importGuestSessionHistory,
} from './src/storage/sessionHistory';
import { BRAND } from './src/utils/brand';

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
  const [isImportDataModalVisible, setIsImportDataModalVisible] = React.useState(false);

  React.useEffect(() => {
    hydrateSettingsStore().catch(() => undefined);
  }, []);

  const finalizeSignIn = React.useCallback(
    (name: string, photo: string | null, targetScreen: 'home' | 'profile') => {
      setUserName(name);
      setUserPhoto(photo);
      setIsAuthenticated(true);
      setScreen(targetScreen);
    },
    [],
  );

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
      const guestDataExists = await hasGuestSessionHistory();

      finalizeSignIn(name, photo, targetScreen);

      if (guestDataExists) {
        setIsImportDataModalVisible(true);
      }
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

  const handleImportStartFresh = () => {
    setIsImportDataModalVisible(false);
    clearGuestSessionHistory().catch(() => undefined);
  };

  const handleImportData = () => {
    setIsImportDataModalVisible(false);
    importGuestSessionHistory().catch(() => undefined);
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
        <StatisticsScreen
          onBack={() => setScreen('home')}
          isGuestUser={!isAuthenticated}
          onSignInPress={() => setScreen('gmail-login')}
        />
      ) : (
        <HomeScreen
          userName={userName}
          userPhoto={userPhoto}
          avatarEmoji={selectedAvatar}
          isGuestUser={!isAuthenticated}
          onProfilePress={() => setScreen('profile')}
          onStatisticsPress={() => setScreen('statistics')}
          onSettingsPress={() => setScreen('settings')}
        />
      )}

      <Modal
        visible={isImportDataModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsImportDataModalVisible(false)}
      >
        <View style={s.modalRoot}>
          <Pressable style={s.modalBackdrop} onPress={() => setIsImportDataModalVisible(false)} />

          <View style={s.modalCard}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Import focus data?</Text>
            <Text style={s.modalMessage}>We found focus data on this device.</Text>
            <Text style={s.modalMessage}>Do you want to add it to your account?</Text>

            <View style={s.modalActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={s.secondaryButton}
                onPress={handleImportStartFresh}
              >
                <Text style={s.secondaryButtonText}>Start Fresh</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.9} style={s.primaryButton} onPress={handleImportData}>
                <LinearGradient
                  colors={[BRAND.violet, BRAND.magenta, BRAND.peach]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={s.primaryButtonGradient}
                >
                  <Text style={s.primaryButtonText}>Import Data</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaProvider>
  );
}

export default App;

const s = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.62)',
  },
  modalCard: {
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    backgroundColor: 'rgba(30, 15, 60, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  modalHandle: {
    alignSelf: 'center',
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginBottom: 14,
  },
  modalTitle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 29,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  modalMessage: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
  modalActions: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: 15,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
