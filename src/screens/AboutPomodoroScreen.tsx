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
import { BRAND, getThemeBrand } from '../utils/brand';
import { useSettingsStore } from '../storage/settingsStore';

type Props = {
  onBack?: () => void;
};

type StepCardProps = {
  title: string;
  description: string;
  accentColor: string;
};

type BenefitCardProps = {
  title: string;
  description: string;
  borderColor: string;
};

function StepCard({ title, description, accentColor }: StepCardProps) {
  return (
    <View style={s.stepCard}>
      <View style={[s.stepIcon, { borderColor: accentColor }]}>
        <View style={[s.stepIconDot, { backgroundColor: accentColor }]} />
      </View>
      <View style={s.stepContent}>
        <Text style={s.stepTitle}>{title}</Text>
        <Text style={s.stepDescription}>{description}</Text>
      </View>
    </View>
  );
}

function BenefitCard({ title, description, borderColor }: BenefitCardProps) {
  return (
    <View style={[s.benefitCard, { borderLeftColor: borderColor }]}>
      <Text style={s.benefitTitle}>{title}</Text>
      <Text style={s.benefitDescription}>{description}</Text>
    </View>
  );
}

export default function AboutPomodoroScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const darkMode = useSettingsStore(state => state.darkMode);
  const theme = React.useMemo(() => getThemeBrand(darkMode), [darkMode]);

  return (
    <View style={[s.root, { backgroundColor: theme.bgStart }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={[theme.bgStart, '#2D1B4D', theme.bgEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[s.headerWrap, { paddingTop: insets.top + 10 }]}>
        <View style={s.headerRow}>
          <Pressable
            style={s.backButton}
            onPress={onBack}
            android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <BackIcon size={22} color="#fff" />
          </Pressable>
          <Text style={s.headerTitle}>About Pomodoro</Text>
          <View style={s.headerSpacer} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.heroSection}>
          <Text style={s.heroAccent}>The Pomodoro Technique:</Text>
          <Text style={s.heroTitle}>Focus Better, One Sprint at a Time</Text>
          <Text style={s.heroDescription}>
            A simple and effective method to improve concentration, beat procrastination, and finish meaningful work.
          </Text>
        </View>

        <View style={s.section}>
          <Text style={s.sectionHeading}>The Basics</Text>
          <StepCard
            title="1. Pick a Task"
            description="Choose one clear task that you want to complete now."
            accentColor={BRAND.violet}
          />
          <StepCard
            title="2. Set Your Timer"
            description="Start a 25-minute focus session (one Pomodoro)."
            accentColor="#C084FC"
          />
          <StepCard
            title="3. Work with Full Focus"
            description="Avoid distractions and stay with the task until the timer ends."
            accentColor={BRAND.peach}
          />
          <StepCard
            title="4. Take a Short Break"
            description="Rest for 5 minutes to reset your brain and energy."
            accentColor={BRAND.violet}
          />
          <StepCard
            title="5. Repeat and Recharge"
            description="After four Pomodoros, take a longer 15- to 30-minute break."
            accentColor="#C084FC"
          />
        </View>

        <View style={s.section}>
          <Text style={s.sectionHeading}>Why It Works</Text>
          <BenefitCard
            title="Beats Procrastination"
            description="Small time-boxed sessions make hard tasks easier to start."
            borderColor={BRAND.violet}
          />
          <BenefitCard
            title="Boosts Productivity"
            description="Deep, uninterrupted sprints improve both speed and quality."
            borderColor="#C084FC"
          />
          <BenefitCard
            title="Reduces Burnout"
            description="Regular breaks help you stay fresh and consistent."
            borderColor={BRAND.peach}
          />
          <BenefitCard
            title="Improves Focus Discipline"
            description="You train your brain to resist interruptions over time."
            borderColor="rgba(255,255,255,0.4)"
          />
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
  headerWrap: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(27, 27, 47, 0.82)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    gap: 20,
  },

  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  heroAccent: {
    color: '#FFB190',
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
  },
  heroTitle: {
    marginTop: 4,
    color: '#fff',
    fontSize: 23,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 31,
  },
  heroDescription: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19,
    maxWidth: 320,
  },

  section: {
    gap: 10,
  },
  sectionHeading: {
    color: '#FFB190',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },

  stepCard: {
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  stepIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  stepIconDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  stepDescription: {
    color: 'rgba(255,255,255,0.58)',
    fontSize: 12,
    lineHeight: 17,
  },

  benefitCard: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderLeftWidth: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  benefitTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  benefitDescription: {
    marginTop: 2,
    color: 'rgba(255,255,255,0.58)',
    fontSize: 12,
    lineHeight: 17,
  },

  bottomPad: {
    height: 26,
  },
});
