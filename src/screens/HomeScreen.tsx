import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from 'react-native-svg';
import {
  AnalyticsIcon,
  PlayIcon,
  SettingsIcon,
  TagIcon,
} from '../components/Icons/AppIcons';
import { BRAND } from '../utils/brand';

const PURPLE = '#7F5AF0';
const PINK = '#C084FC';
const ORANGE = '#FF8A5B';

const RING_PX = 248;
const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  userName?: string;
  userPhoto?: string | null;
  avatarEmoji?: string;
  onProfilePress?: () => void;
};

export default function HomeScreen({
  userName = 'User',
  userPhoto,
  avatarEmoji = '🦁',
  onProfilePress,
}: Props) {
  const insets = useSafeAreaInsets();

  const dashOffset = CIRCUMFERENCE * (1 - 0.75);

  return (
    <View style={s.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={[BRAND.bgStart, BRAND.bgEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[s.header, { paddingTop: insets.top + 8 }]}> 
        <TouchableOpacity
          style={s.avatarRing}
          activeOpacity={0.8}
          onPress={onProfilePress}
        >
          {userPhoto ? (
            <Image source={{ uri: userPhoto }} style={s.avatar} />
          ) : (
            <View style={[s.avatar, s.avatarFallback]}>
              <Text style={s.avatarInitial}>{avatarEmoji || userName.charAt(0).toUpperCase()}</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={s.headerButtons}>
          <TouchableOpacity style={s.iconBtn} activeOpacity={0.75}>
            <AnalyticsIcon size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={s.iconBtn} activeOpacity={0.75}>
            <SettingsIcon size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.main}>
        <View style={s.timerWrapper}>
          <View style={s.glowBlob} />
          <View style={[s.ringBorder, { width: RING_PX, height: RING_PX }]}> 
            <Svg
              width={RING_PX}
              height={RING_PX}
              viewBox="0 0 100 100"
              style={StyleSheet.absoluteFillObject}
            >
              <Defs>
                <SvgGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor={PURPLE} />
                  <Stop offset="50%" stopColor={PINK} />
                  <Stop offset="100%" stopColor={ORANGE} />
                </SvgGradient>
              </Defs>
              <Circle
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
              />
              <Circle
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke="url(#timerGrad)"
                strokeWidth="5"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform="rotate(-90, 50, 50)"
              />
            </Svg>

            <View style={s.timerInner}>
              <Text style={s.timerTime}>25:00</Text>
              <Text style={s.timerMode}>FOCUS</Text>
            </View>
          </View>
        </View>

        <View style={s.tagPill}>
          <TagIcon size={14} color={PINK} />
          <Text style={s.tagText}>Study</Text>
        </View>

        <View style={s.goalSection}>
          <Text style={s.goalLabel}>DAILY GOAL: 3 / 5 SESSIONS</Text>
          <View style={s.dotsRow}>
            {[1, 2, 3, 4, 5].map(i => (
              <View
                key={i}
                style={[
                  s.dot,
                  { backgroundColor: i <= 3 ? ORANGE : 'rgba(255,255,255,0.12)' },
                ]}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.85}>
          <LinearGradient
            colors={[PURPLE, PINK, ORANGE]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.playBtn}
          >
            <PlayIcon size={48} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(127,90,240,0.5)',
    padding: 2,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  avatarFallback: {
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
    gap: 28,
  },

  timerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowBlob: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(127,90,240,0.2)',
    opacity: 0.75,
  },
  ringBorder: {
    borderRadius: 9999,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerInner: {
    alignItems: 'center',
  },
  timerTime: {
    color: '#fff',
    fontSize: 58,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 66,
  },
  timerMode: {
    color: PINK,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 5,
    opacity: 0.85,
    marginTop: 2,
  },

  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  tagText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },

  goalSection: {
    alignItems: 'center',
    gap: 10,
  },
  goalLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 24,
    height: 6,
    borderRadius: 3,
  },

  playBtn: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: PINK,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
});
