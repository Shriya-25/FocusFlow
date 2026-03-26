/**
 * FocusFlow - Pomodoro Timer App
 * @format
 */

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
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
import { TimerProvider } from './src/context/TimerContext';

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
  const [isReady, setIsReady] = React.useState(false);

  // Refs for stable history navigation (avoids stale closures)
  const screenHistoryRef = React.useRef<Screen[]>([]);
  const screenRef = React.useRef<Screen>('onboarding');
  React.useLayoutEffect(() => { screenRef.current = screen; }, [screen]);

  // Forward navigation — pushes current screen onto history
  const navigateTo = React.useCallback((newScreen: Screen) => {
    screenHistoryRef.current = [...screenHistoryRef.current, screenRef.current];
    setScreen(newScreen);
  }, []);

  // Back navigation — pops history; returns true if handled
  const navigateBack = React.useCallback((): boolean => {
    if (screenHistoryRef.current.length === 0) return false;
    const prev = screenHistoryRef.current[screenHistoryRef.current.length - 1];
    screenHistoryRef.current = screenHistoryRef.current.slice(0, -1);
    setScreen(prev);
    return true;
  }, []);

  React.useEffect(() => {
    hydrateSettingsStore().catch(() => undefined);
  }, []);

  // Restore session or decide start screen
  React.useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('hasSeenOnboarding'),
      AsyncStorage.getItem('userSession'),
    ])
      .then(([seenOnboarding, sessionJson]) => {
        if (sessionJson) {
          // Returning user — restore session and go straight to Home
          try {
            const session = JSON.parse(sessionJson);
            setUserName(session.userName ?? 'Guest');
            setUserPhoto(session.userPhoto ?? null);
            setIsAuthenticated(session.isAuthenticated ?? false);
          } catch {
            // corrupt data — fall through to login
          }
          setScreen('home');
        } else if (seenOnboarding !== null) {
          // Seen onboarding but no saved session → login screen
          setScreen('gmail-login');
        }
        // else: fresh install → stay on 'onboarding'
        setIsReady(true);
      })
      .catch(() => setIsReady(true));
  }, []);

  // Handle Android hardware back button
  React.useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', navigateBack);
    return () => sub.remove();
  }, [navigateBack]);

  const saveSession = React.useCallback(
    (name: string, photo: string | null, authenticated: boolean) => {
      AsyncStorage.setItem(
        'userSession',
        JSON.stringify({ userName: name, userPhoto: photo, isAuthenticated: authenticated }),
      ).catch(() => {});
    },
    [],
  );

  const finalizeSignIn = React.useCallback(
    (name: string, photo: string | null, targetScreen: 'home' | 'profile') => {
      setUserName(name);
      setUserPhoto(photo);
      setIsAuthenticated(true);
      saveSession(name, photo, true);
      // Clear history so back-button can never reach login/onboarding after auth.
      screenHistoryRef.current = [];
      setScreen(targetScreen);
    },
    [saveSession],
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
    saveSession('Guest', null, false);
    screenHistoryRef.current = [];
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

  if (!isReady) {
    return (
      <LinearGradient
        colors={['#0f0c29', '#302b63']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <ActivityIndicator size="large" color="#7F5AF0" />
      </LinearGradient>
    );
  }

  return (
    <TimerProvider>
      <SafeAreaProvider>
      {screen === 'onboarding' ? (
        <OnboardingScreen
          onComplete={() => {
            AsyncStorage.setItem('hasSeenOnboarding', 'true').catch(() => {});
            navigateTo('gmail-login');
          }}
          onLoginPress={() => {
            AsyncStorage.setItem('hasSeenOnboarding', 'true').catch(() => {});
            navigateTo('gmail-login');
          }}
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
          onBack={navigateBack}
        />
      ) : screen === 'settings' ? (
        <SettingsScreen
          onBack={navigateBack}
          onAboutPomodoroPress={() => navigateTo('about-pomodoro')}
        />
      ) : screen === 'about-pomodoro' ? (
        <AboutPomodoroScreen onBack={navigateBack} />
      ) : screen === 'statistics' ? (
        <StatisticsScreen
          onBack={navigateBack}
          isGuestUser={!isAuthenticated}
          onSignInPress={() => navigateTo('gmail-login')}
        />
      ) : (
        <HomeScreen
          userName={userName}
          userPhoto={userPhoto}
          avatarEmoji={selectedAvatar}
          isGuestUser={!isAuthenticated}
          onProfilePress={() => navigateTo('profile')}
          onStatisticsPress={() => navigateTo('statistics')}
          onSettingsPress={() => navigateTo('settings')}
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
    </TimerProvider>
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
