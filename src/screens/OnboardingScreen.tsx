import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BRAND = {
  bgStart: '#1B1B2F',
  bgEnd: '#3A1C71',
  violet: '#815cf0',
  magenta: '#ff4b8b',
  peach: '#ff9068',
  textDim: '#D1D5DB',
  white20: 'rgba(255, 255, 255, 0.2)',
};

const screens = [
  {
    title: 'Focus Better',
    description:
      'Train your brain to work with deep focus using the Pomodoro technique.',
    button: 'Next',
  },
  {
    title: 'Track Your Progress',
    description:
      'Visualize your productivity with powerful insights, heatmaps, and session analytics.',
    button: 'Next',
  },
  {
    title: 'Build Habits',
    description:
      'Create lasting productivity habits with daily goals and streaks.',
    button: 'Get Started',
  },
];

const OnboardingScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [currentScreen, setCurrentScreen] = useState(0);
  const pulseAnim = useRef(new Animated.Value(0.95)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const transitionAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, [pulseAnim, rotateAnim]);

  useEffect(() => {
    transitionAnim.setValue(0.9);
    Animated.timing(transitionAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentScreen, transitionAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const screen = useMemo(() => screens[currentScreen], [currentScreen]);

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(prev => prev + 1);
      return;
    }

    console.log('Onboarding complete. Navigate to auth/home screen.');
  };

  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    setCurrentScreen(screens.length - 1);
  };

  const renderScreenOneHero = () => (
    <View style={styles.timerContainer}>
      <Animated.View
        style={[
          styles.outerRing,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={[BRAND.violet, BRAND.magenta, BRAND.peach, BRAND.violet]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.outerRingGradient}
        />
      </Animated.View>

      <View style={styles.glassCircleCard}>
        <Animated.View
          style={[
            styles.gradientBorderContainer,
            { transform: [{ rotate: rotation }] },
          ]}
        >
          <LinearGradient
            colors={[BRAND.violet, BRAND.magenta, BRAND.peach, BRAND.violet]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          />
        </Animated.View>

        <View style={styles.innerCircle}>
          <View style={styles.timerContent}>
            <Text style={styles.timerText}>25:00</Text>
            <Text style={styles.timerLabel}>FOCUS MODE</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderScreenTwoHero = () => (
    <View style={styles.analyticsWrap}>
      <View style={styles.analyticsCard}>
        <View style={styles.analyticsTopRow}>
          <View style={styles.analyticsPill} />
          <Text style={styles.analyticsTrend}>↗</Text>
        </View>

        <View style={styles.analyticsChartArea}>
          <View style={[styles.chartBar, { height: 10 }]} />
          <View style={[styles.chartBar, { height: 24 }]} />
          <View style={[styles.chartBar, { height: 18 }]} />
          <View style={[styles.chartBar, { height: 28 }]} />
          <View style={[styles.chartBar, { height: 22 }]} />
          <View style={[styles.chartBar, { height: 32 }]} />
          <View style={[styles.chartBar, { height: 26 }]} />
        </View>

        <View style={styles.heatmapWrap}>
          {[0.6, 0.4, 0.1, 0.8, 0.2, 0.9, 0.3, 0.1, 0.5, 0.7, 0.5, 0.1, 0.8, 0.3].map(
            (value, index) => (
              <View
                key={`heat-${index}`}
                style={[
                  styles.heatmapCell,
                  {
                    backgroundColor:
                      value < 0.2
                        ? 'rgba(255,255,255,0.12)'
                        : `rgba(129, 92, 240, ${value})`,
                  },
                ]}
              />
            )
          )}
        </View>
      </View>

      <View style={styles.floatTimerCard}>
        <Text style={styles.floatIcon}>⏱</Text>
        <View style={styles.floatLine} />
      </View>

      <View style={styles.floatBarsCard}>
        <View style={styles.floatLineLong} />
        <View style={styles.floatBarsRow}>
          <View style={[styles.floatBar, { height: 14 }]} />
          <View style={[styles.floatBar, { height: 20 }]} />
          <View style={[styles.floatBar, { height: 16 }]} />
          <View style={[styles.floatBar, { height: 25 }]} />
        </View>
      </View>
    </View>
  );

  const renderScreenThreeHero = () => (
    <View style={styles.trophyWrap}>
      <View style={styles.trophyGlow} />
      <View style={styles.trophyCard}>
        <LinearGradient
          colors={[BRAND.violet, '#C084FC', BRAND.peach]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.trophyCore}
        >
          <Text style={styles.trophyEmoji}>🏆</Text>
        </LinearGradient>
        <Text style={styles.sparkleTop}>✦</Text>
        <Text style={styles.sparkleBottom}>✧</Text>
      </View>
    </View>
  );

  const renderHero = () => {
    if (currentScreen === 0) {
      return renderScreenOneHero();
    }

    if (currentScreen === 1) {
      return renderScreenTwoHero();
    }

    return renderScreenThreeHero();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND.bgStart} />

      <LinearGradient
        colors={[BRAND.bgStart, BRAND.bgEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.blurCircleTop} />
      <View style={styles.blurCircleBottom} />

      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 10) + 6 }]}>
        <TouchableOpacity onPress={handleBack} disabled={currentScreen === 0}>
          <Text style={[styles.topActionText, currentScreen === 0 && styles.topActionMuted]}>
            Back
          </Text>
        </TouchableOpacity>

        <Text style={styles.brandTitle}>FocusFlow</Text>

        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.topActionText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.heroSection,
          {
            opacity: transitionAnim,
            transform: [
              {
                translateY: transitionAnim.interpolate({
                  inputRange: [0.9, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
      >
        {renderHero()}
      </Animated.View>

      <Animated.View
        style={[
          styles.contentSection,
          {
            opacity: transitionAnim,
          },
        ]}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>{screen.title}</Text>
          <Text style={styles.description}>{screen.description}</Text>
        </View>

        <View style={styles.paginationContainer}>
          {screens.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[styles.dot, index === currentScreen && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleNext}
          style={styles.buttonContainer}
        >
          <LinearGradient
            colors={[BRAND.violet, BRAND.magenta, BRAND.peach]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{screen.button}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {currentScreen === screens.length - 1 ? (
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.loginText}>ALREADY HAVE AN ACCOUNT? LOG IN</Text>
          </TouchableOpacity>
        ) : null}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.bgStart,
  },
  topBar: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topActionText: {
    color: '#B9BBD0',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 36,
  },
  topActionMuted: {
    opacity: 0.25,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.2,
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
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
  },

  // Screen 1 hero
  timerContainer: {
    width: 288,
    height: 288,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    width: 288,
    height: 288,
    borderRadius: 144,
    opacity: 0.3,
  },
  outerRingGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 144,
  },
  glassCircleCard: {
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
  gradientBorderContainer: {
    position: 'absolute',
    width: 224,
    height: 224,
    borderRadius: 112,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 112,
    padding: 6,
  },
  innerCircle: {
    width: 212,
    height: 212,
    borderRadius: 106,
    backgroundColor: 'rgba(27, 27, 47, 0.84)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContent: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 3,
    marginTop: 8,
    textTransform: 'uppercase',
  },

  // Screen 2 hero
  analyticsWrap: {
    width: 320,
    height: 330,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyticsCard: {
    width: 250,
    height: 280,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    padding: 16,
    transform: [{ rotate: '-2deg' }],
  },
  analyticsTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  analyticsPill: {
    width: 64,
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  analyticsTrend: {
    color: '#C084FC',
    fontSize: 18,
    fontWeight: '700',
  },
  analyticsChartArea: {
    marginTop: 28,
    height: 52,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  chartBar: {
    width: 24,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: 'rgba(255, 138, 91, 0.75)',
  },
  heatmapWrap: {
    marginTop: 26,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  heatmapCell: {
    width: 28,
    height: 28,
    borderRadius: 4,
    marginBottom: 7,
  },
  floatTimerCard: {
    position: 'absolute',
    top: 26,
    right: 28,
    width: 92,
    height: 92,
    borderRadius: 18,
    transform: [{ rotate: '12deg' }],
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatIcon: {
    color: BRAND.peach,
    fontSize: 24,
  },
  floatLine: {
    width: 38,
    height: 7,
    borderRadius: 999,
    marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  floatBarsCard: {
    position: 'absolute',
    bottom: 18,
    left: 24,
    width: 116,
    height: 82,
    borderRadius: 16,
    transform: [{ rotate: '-6deg' }],
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    padding: 10,
  },
  floatLineLong: {
    width: 56,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  floatBarsRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flex: 1,
  },
  floatBar: {
    width: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: 'rgba(192,132,252,0.7)',
  },

  // Screen 3 hero
  trophyWrap: {
    width: 320,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(236, 91, 19, 0.25)',
    opacity: 0.35,
  },
  trophyCard: {
    width: 256,
    height: 256,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 28,
    elevation: 10,
    overflow: 'hidden',
  },
  trophyCore: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyEmoji: {
    fontSize: 66,
  },
  sparkleTop: {
    position: 'absolute',
    top: 42,
    right: 38,
    color: '#FFB38C',
    fontSize: 24,
  },
  sparkleBottom: {
    position: 'absolute',
    bottom: 50,
    left: 36,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 20,
  },

  contentSection: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '300',
    color: BRAND.textDim,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: BRAND.white20,
  },
  dotActive: {
    width: 24,
    height: 8,
    backgroundColor: BRAND.magenta,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 16,
    borderRadius: 100,
    overflow: 'hidden',
    shadowColor: BRAND.violet,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  button: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  loginText: {
    marginTop: 18,
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});

export default OnboardingScreen;
