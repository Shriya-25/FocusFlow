import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackIcon } from '../components/Icons/AppIcons';
import { BRAND } from '../utils/brand';

type Props = {
  onBack?: () => void;
  onAboutPomodoroPress?: () => void;
};

type ToggleRowProps = {
  label: string;
  value: boolean;
  onToggle: () => void;
};

type SupportRowProps = {
  label: string;
  onPress?: () => void;
};

function ToggleRow({ label, value, onToggle }: ToggleRowProps) {
  return (
    <Pressable onPress={onToggle} style={s.prefRow} android_ripple={{ color: 'rgba(255,255,255,0.08)' }}>
      <Text style={s.prefLabel}>{label}</Text>
      <View style={[s.switchTrack, value ? s.switchTrackOn : s.switchTrackOff]}>
        <View style={[s.switchThumb, value ? s.switchThumbOn : s.switchThumbOff]} />
      </View>
    </Pressable>
  );
}

function SupportRow({ label, onPress }: SupportRowProps) {
  return (
    <Pressable style={s.supportRow} android_ripple={{ color: 'rgba(255,255,255,0.08)' }} onPress={onPress}>
      <Text style={s.supportLabel}>{label}</Text>
      <Text style={s.chevron}>›</Text>
    </Pressable>
  );
}

export default function SettingsScreen({ onBack, onAboutPomodoroPress }: Props) {
  const insets = useSafeAreaInsets();

  const [timerSound, setTimerSound] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);

  return (
    <View style={s.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={[BRAND.bgStart, BRAND.bgEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        contentContainerStyle={[s.scrollContent, { paddingTop: insets.top + 14 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.headerRow}>
          <Pressable
            style={s.backButton}
            onPress={onBack}
            android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
          >
            <BackIcon size={22} color="#fff" />
          </Pressable>
          <Text style={s.headerTitle}>Settings</Text>
        </View>

        <View style={s.sectionBlock}>
          <Text style={s.sectionTitle}>TIMER CONFIGURATION</Text>
          <View style={s.glassCard}>
            <View style={s.sliderBlock}>
              <View style={s.sliderHeaderRow}>
                <Text style={s.sliderLabel}>Focus duration</Text>
                <Text style={[s.sliderValue, s.valueViolet]}>25 min</Text>
              </View>
              <View style={s.progressTrack}>
                <LinearGradient
                  colors={[BRAND.violet, '#C084FC', BRAND.peach]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[s.progressFill, { width: '45%' }]}
                />
              </View>
            </View>

            <View style={s.sliderBlock}>
              <View style={s.sliderHeaderRow}>
                <Text style={s.sliderLabel}>Short break</Text>
                <Text style={[s.sliderValue, s.valuePink]}>5 min</Text>
              </View>
              <View style={s.progressTrack}>
                <LinearGradient
                  colors={[BRAND.violet, '#C084FC', BRAND.peach]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[s.progressFill, { width: '20%' }]}
                />
              </View>
            </View>

            <View style={s.sliderBlock}>
              <View style={s.sliderHeaderRow}>
                <Text style={s.sliderLabel}>Long break</Text>
                <Text style={[s.sliderValue, s.valueOrange]}>15 min</Text>
              </View>
              <View style={s.progressTrack}>
                <LinearGradient
                  colors={[BRAND.violet, '#C084FC', BRAND.peach]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[s.progressFill, { width: '35%' }]}
                />
              </View>
            </View>

            <View style={s.sliderBlockNoBorder}>
              <View style={s.sliderHeaderRow}>
                <Text style={s.sliderLabel}>Cycles</Text>
                <Text style={s.sliderValue}>4</Text>
              </View>
              <View style={s.progressTrack}>
                <LinearGradient
                  colors={[BRAND.violet, '#C084FC', BRAND.peach]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[s.progressFill, { width: '40%' }]}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={s.sectionBlock}>
          <Text style={s.sectionTitle}>PREFERENCES</Text>
          <View style={s.glassCardNoPad}>
            <ToggleRow label="Timer sound" value={timerSound} onToggle={() => setTimerSound(prev => !prev)} />
            <View style={s.rowDivider} />
            <ToggleRow label="Notifications" value={notifications} onToggle={() => setNotifications(prev => !prev)} />
            <View style={s.rowDivider} />
            <ToggleRow label="Dark mode" value={darkMode} onToggle={() => setDarkMode(prev => !prev)} />
          </View>
        </View>

        <View style={s.sectionBlock}>
          <Text style={s.sectionTitle}>SUPPORT</Text>
          <View style={s.glassCardNoPad}>
            <SupportRow label="Contact us" />
            <View style={s.rowDivider} />
            <SupportRow label="What is Pomodoro" onPress={onAboutPomodoroPress} />
            <View style={s.rowDivider} />
            <SupportRow label="Leave a review" />
          </View>
        </View>

        <Text style={s.versionLabel}>FocusFlow v2.4.0</Text>
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
    paddingHorizontal: 22,
    paddingBottom: 32,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
  },

  sectionBlock: {
    marginTop: 10,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
    marginLeft: 2,
  },

  glassCard: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  glassCardNoPad: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },

  sliderBlock: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  sliderBlockNoBorder: {
    paddingVertical: 12,
  },
  sliderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sliderLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  sliderValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  valueViolet: {
    color: '#B497FF',
  },
  valuePink: {
    color: '#EAB8FF',
  },
  valueOrange: {
    color: '#FFB190',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },

  prefRow: {
    minHeight: 62,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prefLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  switchTrack: {
    width: 48,
    height: 28,
    borderRadius: 999,
    padding: 3,
    justifyContent: 'center',
  },
  switchTrackOn: {
    backgroundColor: BRAND.violet,
  },
  switchTrackOff: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
  },
  switchThumbOn: {
    alignSelf: 'flex-end',
  },
  switchThumbOff: {
    alignSelf: 'flex-start',
  },

  supportRow: {
    minHeight: 58,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  supportLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  chevron: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 24,
    lineHeight: 24,
  },
  rowDivider: {
    height: 1,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  versionLabel: {
    marginTop: 20,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    fontWeight: '500',
  },
});
