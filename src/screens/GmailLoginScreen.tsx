import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BRAND, getThemeBrand } from '../utils/brand';
import { useSettingsStore } from '../storage/settingsStore';

type GmailLoginScreenProps = {
  onSkip?: () => void;
  onGoogleLogin?: () => void;
};

const GmailLoginScreen: React.FC<GmailLoginScreenProps> = ({
  onSkip,
  onGoogleLogin,
}) => {
  const insets = useSafeAreaInsets();
  const darkMode = useSettingsStore(state => state.darkMode);
  const theme = React.useMemo(() => getThemeBrand(darkMode), [darkMode]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bgStart }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bgStart} />

      <LinearGradient
        colors={[theme.bgStart, theme.bgEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.blurCircleTop} pointerEvents="none" />
      <View style={styles.blurCircleBottom} pointerEvents="none" />

      <View style={[styles.content, { paddingTop: Math.max(insets.top, 10) + 24 }]}>
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>⏱</Text>
          </View>
          <Text style={styles.brandTitle}>FocusFlow</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardGlow} pointerEvents="none" />

          <Text style={styles.welcomeTitle}>Welcome back</Text>
          <Text style={styles.welcomeSubtitle}>
            Sign in to sync your analytics, streaks, and productivity dashboard.
          </Text>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.googleButton}
            onPress={() => onGoogleLogin?.()}
          >
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.googleLabel}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => onSkip?.()}>
            <Text style={styles.skipText}>Skip Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomFade} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.bgStart,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurCircleTop: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(129, 92, 240, 0.18)',
    opacity: 0.6,
  },
  blurCircleBottom: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255, 75, 139, 0.16)',
    opacity: 0.4,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 14,
  },
  logoIcon: {
    fontSize: 36,
    color: '#C084FC',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 30,
    paddingHorizontal: 22,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 16,
  },
  cardGlow: {
    position: 'absolute',
    top: -45,
    right: -55,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(129, 92, 240, 0.24)',
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    color: 'rgba(224, 176, 255, 0.82)',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  googleButton: {
    width: '100%',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    minHeight: 56,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  googleG: {
    color: '#EA4335',
    fontSize: 24,
    fontWeight: '700',
    marginRight: 10,
  },
  googleLabel: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  skipText: {
    color: 'rgba(224, 176, 255, 0.68)',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
});

export default GmailLoginScreen;
