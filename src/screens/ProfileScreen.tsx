import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackIcon, CrownIcon, InfoIcon } from '../components/Icons/AppIcons';
import { BRAND, getThemeBrand } from '../utils/brand';
import { useSettingsStore } from '../storage/settingsStore';
import { readSessionHistory } from '../storage/sessionHistory';

const PURPLE = BRAND.violet;
const PINK = BRAND.magenta;
const ORANGE = BRAND.peach;

const TOTAL_REQUIRED_POMODOROS = 300;

const toDateKey = (ms: number): string => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const formatFocusTime = (totalMinutes: number): string => {
  if (totalMinutes < 60) return `${totalMinutes} Min`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h} ${h === 1 ? 'Hour' : 'Hours'}`;
};
const QUOTE_ROTATION: string[] = [
  'The secret of getting ahead is getting started.',
  'Success is the sum of small efforts repeated day in and day out.',
  'Discipline is choosing between what you want now and what you want most.',
  'Your future is created by what you do today, not tomorrow.',
  'Do not wait to strike till the iron is hot; make it hot by striking.',
  'Small focus sessions build big momentum.',
  'Consistency beats intensity when it comes to mastery.',
  'Protect your focus and your goals will protect your future.',
  'Progress grows where attention goes.',
];

type Props = {
  userName?: string;
  userPhoto?: string | null;
  selectedAvatar?: string;
  isGuest?: boolean;
  isSigningIn?: boolean;
  onGuestSignIn?: () => void;
  onBack?: () => void;
};

export default function ProfileScreen({
  userName = 'Shriya',
  userPhoto,
  selectedAvatar = '🦁',
  isGuest = false,
  isSigningIn = false,
  onGuestSignIn,
  onBack,
}: Props) {
  const insets = useSafeAreaInsets();
  const darkMode = useSettingsStore(state => state.darkMode);
  const theme = useMemo(() => getThemeBrand(darkMode), [darkMode]);
  const [nowMs, setNowMs] = React.useState(Date.now());

  const [userStats, setUserStats] = React.useState({
    totalFocusMinutes: 0,
    currentStreak: 0,
    completedPomodoros: 0,
  });

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setNowMs(Date.now());
    }, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Load real session data
  React.useEffect(() => {
    const audience = isGuest ? 'guest' : 'account';
    readSessionHistory(audience).then(entries => {
      const focusSessions = entries.filter(e => e.sessionType === 'focus');
      const totalMinutes = Math.round(
        focusSessions.reduce((sum, e) => sum + e.durationSeconds, 0) / 60,
      );
      const completedPomodoros = focusSessions.length;

      // Current streak: count consecutive days (incl. today) with focus sessions
      const daySet = new Set(focusSessions.map(e => toDateKey(e.completedAt)));
      let streak = 0;
      for (let i = 0; i < 365; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        if (daySet.has(toDateKey(d.getTime()))) {
          streak++;
        } else {
          break;
        }
      }

      setUserStats({ totalFocusMinutes: totalMinutes, currentStreak: streak, completedPomodoros });
    }).catch(() => {});
  }, [isGuest]);

  const progressPercent = useMemo(
    () => Math.min(100, Math.round((userStats.completedPomodoros / TOTAL_REQUIRED_POMODOROS) * 100)),
    [userStats.completedPomodoros],
  );
  const remainingPomodoros = Math.max(0, TOTAL_REQUIRED_POMODOROS - userStats.completedPomodoros);
  const quoteOfTheSlot = useMemo(() => {
    const now = new Date(nowMs);
    const slot = Math.floor(now.getHours() / 8);
    const dayNumber = Math.floor(nowMs / (24 * 60 * 60 * 1000));
    const quoteIndex = (dayNumber * 3 + slot) % QUOTE_ROTATION.length;
    return QUOTE_ROTATION[quoteIndex];
  }, [nowMs]);

  return (
    <View style={[s.root, { backgroundColor: theme.bgStart }]}> 
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={[theme.bgStart, theme.bgEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        contentContainerStyle={[s.scrollContent, { paddingTop: insets.top + 8 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.topBar}>
          <Pressable
            style={s.roundIconButton}
            onPress={onBack}
            android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
          >
            <BackIcon size={22} color="#fff" />
          </Pressable>
        </View>

        <View style={s.profileHeaderWrap}>
          <View style={s.profileAvatarOuter}>
            {userPhoto ? (
              <Image source={{ uri: userPhoto }} style={s.profileAvatarImage} />
            ) : (
              <View style={s.profileAvatarFallback}>
                <Text style={s.profileAvatarEmoji}>{selectedAvatar}</Text>
              </View>
            )}
          </View>

          <Text style={s.userName}>{userName}</Text>
          <Text style={s.userSubtitle}>Deep Work Enthusiast</Text>

          {isGuest ? (
            <View style={s.guestPromptWrap}>
              <Text style={s.guestPromptText}>Sign in to sync your progress.</Text>
              <Pressable
                onPress={() => onGuestSignIn?.()}
                disabled={isSigningIn}
                style={s.guestLoginButtonWrap}
                android_ripple={{ color: 'rgba(255,255,255,0.12)' }}
              >
                <LinearGradient
                  colors={['#FFFFFF', 'rgba(255,255,255,0.95)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.guestLoginButton}
                >
                  {isSigningIn ? (
                    <ActivityIndicator size="small" color="#111827" />
                  ) : (
                    <>
                      <Text style={s.googleGlyph}>G</Text>
                      <Text style={s.guestLoginButtonText}>Continue with Google</Text>
                    </>
                  )}
                </LinearGradient>
              </Pressable>
            </View>
          ) : null}
        </View>

        <View style={s.statsRow}>
          <View style={s.glassCardHalf}>
            <Text style={s.statLabel}>TOTAL FOCUS TIME</Text>
            <Text style={s.statValue}>
              {isGuest && userStats.totalFocusMinutes === 0
                ? '–'
                : formatFocusTime(userStats.totalFocusMinutes)}
            </Text>
          </View>
          <View style={s.glassCardHalf}>
            <Text style={s.statLabel}>CURRENT STREAK</Text>
            <Text style={s.statValue}>
              {userStats.currentStreak === 0
                ? '–'
                : `${userStats.currentStreak} ${userStats.currentStreak === 1 ? 'Day' : 'Days'}`}
            </Text>
          </View>
        </View>

        <View style={s.glassCardFull}>
          <View style={s.badgeTopRow}>
            <View>
              <Text style={s.badgeTitle}>Gold Focus Badge</Text>
              <Text style={s.badgeSubtitle}>
                {isGuest && userStats.completedPomodoros === 0
                  ? 'Sign in to sync your progress'
                  : `${userStats.completedPomodoros} Pomodoros Completed`}
              </Text>
            </View>
            <View style={s.badgeIconWrap}>
              <CrownIcon size={26} color={ORANGE} />
            </View>
          </View>

          <View style={s.progressHeaderRow}>
            <Text style={s.progressLabel}>PROGRESS</Text>
            <Text style={s.progressPercent}>{isGuest ? '' : `${progressPercent}%`}</Text>
          </View>
          <View style={s.progressTrack}>
            <LinearGradient
              colors={[PURPLE, PINK, ORANGE]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[
                s.progressFill,
                {
                  width: isGuest ? '0%' : `${progressPercent}%`,
                  minWidth: isGuest ? 0 : 10,
                },
              ]}
            />
          </View>

          {!isGuest ? (
            <View style={s.infoRow}>
              <InfoIcon size={16} color="rgba(255,255,255,0.6)" />
              <Text style={s.infoText}>
                Complete <Text style={s.infoTextStrong}>{remainingPomodoros} more Pomodoros</Text> to unlock the
                Gold Focus Badge.
              </Text>
            </View>
          ) : null}

          <LinearGradient
            colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.quotePanel}
          >
            <Text style={s.quoteText}>"{quoteOfTheSlot}"</Text>
          </LinearGradient>
        </View>

        <View style={s.bottomPad} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BRAND.bgStart,
  },

  scrollContent: {
    paddingBottom: 24,
  },

  topBar: {
    paddingHorizontal: 20,
    paddingBottom: 4,
    alignItems: 'flex-start',
  },
  roundIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  profileHeaderWrap: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 10,
  },
  profileAvatarOuter: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  profileAvatarImage: {
    width: 124,
    height: 124,
    borderRadius: 62,
  },
  profileAvatarFallback: {
    width: 124,
    height: 124,
    borderRadius: 62,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  profileAvatarEmoji: {
    fontSize: 56,
  },
  userName: {
    marginTop: 16,
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  userSubtitle: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.62)',
    fontSize: 14,
    fontWeight: '500',
  },
  guestPromptWrap: {
    marginTop: 14,
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  guestPromptText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  guestLoginButtonWrap: {
    width: '100%',
    maxWidth: 290,
    borderRadius: 999,
    overflow: 'hidden',
  },
  guestLoginButton: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  googleGlyph: {
    color: '#EA4335',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 24,
  },
  guestLoginButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 10,
  },
  glassCardHalf: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.1,
  },
  statValue: {
    color: '#fff',
    marginTop: 7,
    fontSize: 22,
    fontWeight: '700',
    minHeight: 28,
  },

  glassCardFull: {
    marginTop: 14,
    marginHorizontal: 20,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 18,
  },
  badgeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  badgeSubtitle: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 14,
    marginTop: 3,
  },
  badgeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(236,91,19,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(236,91,19,0.4)',
  },

  progressHeaderRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  progressPercent: {
    color: '#ec5b13',
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    marginTop: 8,
    width: '100%',
    height: 12,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    minWidth: 10,
  },

  infoRow: {
    marginTop: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoText: {
    flex: 1,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    lineHeight: 18,
  },
  infoTextStrong: {
    color: '#fff',
    fontWeight: '600',
  },

  quotePanel: {
    marginTop: 16,
    borderRadius: 12,
    minHeight: 108,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  quoteText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: '300',
    lineHeight: 26,
  },

  bottomPad: {
    height: 24,
  },
});
