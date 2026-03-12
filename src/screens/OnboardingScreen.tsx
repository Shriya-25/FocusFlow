import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0.95)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for the outer ring
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

    // Rotation animation for gradient ring
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, [pulseAnim, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleNext = () => {
    console.log('Navigating to next onboarding screen...');
    // Add navigation logic here
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B1B2F" />
      
      {/* Gradient Background */}
      <LinearGradient
        colors={['#1B1B2F', '#3A1C71']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Background Blur Circles */}
      <View style={styles.blurCircleTop} />
      <View style={styles.blurCircleBottom} />

      {/* Hero Illustration - Timer */}
      <View style={styles.heroSection}>
        <View style={styles.timerContainer}>
          {/* Outer Glowing Pulsing Ring */}
          <Animated.View
            style={[
              styles.outerRing,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={['#815cf0', '#ff4b8b', '#ff9068', '#815cf0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.outerRingGradient}
            />
          </Animated.View>

          {/* Glass Card */}
          <View style={styles.glassCard}>
            {/* Animated Gradient Ring Border */}
            <Animated.View
              style={[
                styles.gradientBorderContainer,
                { transform: [{ rotate: rotation }] },
              ]}
            >
              <LinearGradient
                colors={['#815cf0', '#ff4b8b', '#ff9068', '#815cf0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBorder}
              />
            </Animated.View>

            {/* Inner Circle Background */}
            <View style={styles.innerCircle}>
              {/* Timer Display */}
              <View style={styles.timerContent}>
                <Text style={styles.timerText}>25:00</Text>
                <Text style={styles.timerLabel}>FOCUS MODE</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Focus Better</Text>
          <Text style={styles.description}>
            Train your brain to work with deep focus using the Pomodoro technique.
          </Text>
        </View>

        {/* Pagination Indicators */}
        <View style={styles.paginationContainer}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleNext}
          style={styles.buttonContainer}
        >
          <LinearGradient
            colors={['#815cf0', '#ff4b8b', '#ff9068']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B2F',
  },
  blurCircleTop: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(129, 92, 240, 0.2)',
    opacity: 0.6,
  },
  blurCircleBottom: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255, 75, 139, 0.1)',
    opacity: 0.4,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
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
  glassCard: {
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
    backgroundColor: 'rgba(27, 27, 47, 0.8)',
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
    fontFamily: 'Poppins-Bold',
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 3,
    marginTop: 8,
    textTransform: 'uppercase',
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
    fontFamily: 'Poppins-Bold',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    fontWeight: '300',
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
    fontFamily: 'Poppins-Light',
  },
  paginationContainer: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dotActive: {
    width: 24,
    height: 8,
    backgroundColor: '#815cf0',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 16,
    borderRadius: 100,
    overflow: 'hidden',
    shadowColor: '#815cf0',
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
});

export default OnboardingScreen;
