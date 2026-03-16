import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackIcon, EmailIcon, GlobeIcon, InstagramIcon } from '../components/Icons/AppIcons';
import { getThemeBrand } from '../utils/brand';
import { useSettingsStore } from '../storage/settingsStore';

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
  const [isContactExpanded, setIsContactExpanded] = React.useState(false);

  const {
    focusDuration,
    shortBreak,
    longBreak,
    cycles,
    timerSound,
    notifications,
    darkMode,
    updateSettings,
  } = useSettingsStore();

  const theme = React.useMemo(() => getThemeBrand(darkMode), [darkMode]);

  const getSliderFillPercent = React.useCallback((value: number, min: number, max: number): `${number}%` => {
    const bounded = Math.max(min, Math.min(max, value));
    return `${((bounded - min) / (max - min)) * 100}%` as `${number}%`;
  }, []);

  const openExternalLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      // Silent fail for dummy links.
    }
  };

  return (
    <View style={s.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={[theme.bgStart, theme.bgEnd]}
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
                <Text style={[s.sliderValue, s.valueViolet]}>{focusDuration} min</Text>
              </View>
              <View style={s.progressTrack}>
                <LinearGradient
                  colors={[theme.violet, '#C084FC', theme.peach]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[s.progressFill, { width: getSliderFillPercent(focusDuration, 5, 60) }]}
                />
                <Slider
                  style={s.sliderControl}
                  minimumValue={5}
                  maximumValue={60}
                  step={1}
                  minimumTrackTintColor="transparent"
                  maximumTrackTintColor="transparent"
                  thumbTintColor="rgba(255,255,255,0.9)"
                  value={focusDuration}
                  onValueChange={value => updateSettings({ focusDuration: value })}
                />
              </View>
            </View>

            <View style={s.sliderBlock}>
              <View style={s.sliderHeaderRow}>
                <Text style={s.sliderLabel}>Short break</Text>
                <Text style={[s.sliderValue, s.valuePink]}>{shortBreak} min</Text>
              </View>
              <View style={s.progressTrack}>
                <LinearGradient
                  colors={[theme.violet, '#C084FC', theme.peach]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[s.progressFill, { width: getSliderFillPercent(shortBreak, 1, 15) }]}
                />
                <Slider
                  style={s.sliderControl}
                  minimumValue={1}
                  maximumValue={15}
                  step={1}
                  minimumTrackTintColor="transparent"
                  maximumTrackTintColor="transparent"
                  thumbTintColor="rgba(255,255,255,0.9)"
                  value={shortBreak}
                  onValueChange={value => updateSettings({ shortBreak: value })}
                />
              </View>
            </View>

            <View style={s.sliderBlock}>
              <View style={s.sliderHeaderRow}>
                <Text style={s.sliderLabel}>Long break</Text>
                <Text style={[s.sliderValue, s.valueOrange]}>{longBreak} min</Text>
              </View>
              <View style={s.progressTrack}>
                <LinearGradient
                  colors={[theme.violet, '#C084FC', theme.peach]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[s.progressFill, { width: getSliderFillPercent(longBreak, 10, 30) }]}
                />
                <Slider
                  style={s.sliderControl}
                  minimumValue={10}
                  maximumValue={30}
                  step={1}
                  minimumTrackTintColor="transparent"
                  maximumTrackTintColor="transparent"
                  thumbTintColor="rgba(255,255,255,0.9)"
                  value={longBreak}
                  onValueChange={value => updateSettings({ longBreak: value })}
                />
              </View>
            </View>

            <View style={s.sliderBlockNoBorder}>
              <View style={s.sliderHeaderRow}>
                <Text style={s.sliderLabel}>Cycles</Text>
                <Text style={s.sliderValue}>{cycles}</Text>
              </View>
              <View style={s.progressTrack}>
                <LinearGradient
                  colors={[theme.violet, '#C084FC', theme.peach]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[s.progressFill, { width: getSliderFillPercent(cycles, 2, 8) }]}
                />
                <Slider
                  style={s.sliderControl}
                  minimumValue={2}
                  maximumValue={8}
                  step={1}
                  minimumTrackTintColor="transparent"
                  maximumTrackTintColor="transparent"
                  thumbTintColor="rgba(255,255,255,0.9)"
                  value={cycles}
                  onValueChange={value => updateSettings({ cycles: value })}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={s.sectionBlock}>
          <Text style={s.sectionTitle}>PREFERENCES</Text>
          <View style={s.glassCardNoPad}>
            <ToggleRow label="Timer sound" value={timerSound} onToggle={() => updateSettings({ timerSound: !timerSound })} />
            <View style={s.rowDivider} />
            <ToggleRow label="Notifications" value={notifications} onToggle={() => updateSettings({ notifications: !notifications })} />
            <View style={s.rowDivider} />
            <ToggleRow label="Dark mode" value={darkMode} onToggle={() => updateSettings({ darkMode: !darkMode })} />
          </View>
        </View>

        <View style={s.sectionBlock}>
          <Text style={s.sectionTitle}>SUPPORT</Text>
          <View style={s.glassCardNoPad}>
            <Pressable
              style={s.supportRow}
              android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
              onPress={() => setIsContactExpanded(prev => !prev)}
            >
              <Text style={s.supportLabel}>Contact us</Text>
              <Text style={s.chevron}>{isContactExpanded ? '⌃' : '⌄'}</Text>
            </Pressable>

            {isContactExpanded ? (
              <View style={s.contactAccordionBody}>
                <View style={s.contactIconsRow}>
                  <TouchableOpacity
                    style={s.contactIconButton}
                    activeOpacity={0.8}
                    onPress={() => openExternalLink('https://instagram.com')}
                  >
                    <InstagramIcon size={26} color="#FFB190" />
                    <Text style={s.contactIconLabel}>Instagram</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={s.contactIconButton}
                    activeOpacity={0.8}
                    onPress={() => openExternalLink('https://google.com')}
                  >
                    <GlobeIcon size={26} color="#C084FC" />
                    <Text style={s.contactIconLabel}>Website</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={s.contactIconButton}
                    activeOpacity={0.8}
                    onPress={() => openExternalLink('mailto:example@email.com')}
                  >
                    <EmailIcon size={26} color="#B497FF" />
                    <Text style={s.contactIconLabel}>Email</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

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
    backgroundColor: '#1B1338',
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
  sliderControl: {
    ...StyleSheet.absoluteFillObject,
    top: -12,
    bottom: -12,
    left: -8,
    right: -8,
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
    backgroundColor: '#815cf0',
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
  contactAccordionBody: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  contactIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  contactIconButton: {
    flex: 1,
    minHeight: 74,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 8,
  },
  contactIconLabel: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11,
    fontWeight: '600',
  },

  versionLabel: {
    marginTop: 20,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    fontWeight: '500',
  },
});
