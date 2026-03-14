import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Modal,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BRAND } from '../utils/brand';

const PURPLE = BRAND.violet;
const PINK = BRAND.magenta;
const ORANGE = BRAND.peach;

const TOTAL_REQUIRED_POMODOROS = 300;
const COMPLETED_POMODOROS = 12;
const AVATARS = ['🐼', '🦁', '🐰', '🐶', '🐵', '🤖', '🦋', '🌙', '⭐'];

type Props = {
  userName?: string;
  userPhoto?: string | null;
  selectedAvatar?: string;
  onAvatarChange?: (avatar: string) => void;
  onBack?: () => void;
};

export default function ProfileScreen({
  userName = 'Shriya',
  userPhoto,
  selectedAvatar = '🦁',
  onAvatarChange,
  onBack,
}: Props) {
  const insets = useSafeAreaInsets();
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState(selectedAvatar);

  useEffect(() => {
    setPendingAvatar(selectedAvatar);
  }, [selectedAvatar]);

  const progressPercent = useMemo(
    () => Math.round((COMPLETED_POMODOROS / TOTAL_REQUIRED_POMODOROS) * 100),
    [],
  );
  const remainingPomodoros = TOTAL_REQUIRED_POMODOROS - COMPLETED_POMODOROS;

  const openAvatarModal = () => {
    setPendingAvatar(selectedAvatar);
    setAvatarModalVisible(true);
  };

  const closeAvatarModal = () => {
    setAvatarModalVisible(false);
  };

  const confirmAvatar = () => {
    onAvatarChange?.(pendingAvatar);
    setAvatarModalVisible(false);
  };

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
        contentContainerStyle={[s.scrollContent, { paddingTop: insets.top + 8 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.topBar}>
          <Pressable
            style={s.roundIconButton}
            onPress={onBack}
            android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
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

            <Pressable
              onPress={openAvatarModal}
              style={s.avatarEditButton}
              android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
            >
              <MaterialCommunityIcons name="pencil" size={14} color="#fff" />
            </Pressable>
          </View>

          <Text style={s.userName}>{userName}</Text>
          <Text style={s.userSubtitle}>Deep Work Enthusiast</Text>
        </View>

        <View style={s.statsRow}>
          <View style={s.glassCardHalf}>
            <Text style={s.statLabel}>TOTAL FOCUS TIME</Text>
            <Text style={s.statValue}>120 Hours</Text>
          </View>
          <View style={s.glassCardHalf}>
            <Text style={s.statLabel}>CURRENT STREAK</Text>
            <Text style={s.statValue}>5 Days</Text>
          </View>
        </View>

        <View style={s.glassCardFull}>
          <View style={s.badgeTopRow}>
            <View>
              <Text style={s.badgeTitle}>Gold Focus Badge</Text>
              <Text style={s.badgeSubtitle}>{COMPLETED_POMODOROS} Pomodoros Completed</Text>
            </View>
            <View style={s.badgeIconWrap}>
              <MaterialCommunityIcons name="crown" size={28} color={ORANGE} />
            </View>
          </View>

          <View style={s.progressHeaderRow}>
            <Text style={s.progressLabel}>PROGRESS</Text>
            <Text style={s.progressPercent}>{progressPercent}%</Text>
          </View>
          <View style={s.progressTrack}>
            <LinearGradient
              colors={[PURPLE, PINK, ORANGE]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[s.progressFill, { width: `${progressPercent}%` }]}
            />
          </View>

          <View style={s.infoRow}>
            <MaterialCommunityIcons
              name="information-outline"
              size={16}
              color="rgba(255,255,255,0.6)"
            />
            <Text style={s.infoText}>
              Complete <Text style={s.infoTextStrong}>{remainingPomodoros} more Pomodoros</Text> to unlock the
              Gold Focus Badge.
            </Text>
          </View>

          <LinearGradient
            colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.quotePanel}
          >
            <Text style={s.quoteText}>"The secret of getting ahead is getting started."</Text>
          </LinearGradient>
        </View>

        <View style={s.bottomPad} />
      </ScrollView>

      <Modal
        visible={avatarModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeAvatarModal}
      >
        <View style={s.modalRoot}>
          <Pressable style={s.modalBackdrop} onPress={closeAvatarModal} />

          <View style={s.modalCard}>
            <Text style={s.modalTitle}>Choose Your Avatar</Text>
            <Text style={s.modalSubtitle}>Select a character for your profile</Text>

            <View style={s.avatarGrid}>
              {AVATARS.map(avatar => {
                const selected = pendingAvatar === avatar;
                return (
                  <Pressable
                    key={avatar}
                    onPress={() => setPendingAvatar(avatar)}
                    style={[s.avatarOption, selected ? s.avatarOptionSelected : s.avatarOptionDefault]}
                    android_ripple={{ color: 'rgba(255,255,255,0.16)', radius: 32 }}
                  >
                    <Text style={s.avatarOptionText}>{avatar}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={s.selectButtonWrap}
              onPress={confirmAvatar}
              android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
            >
              <LinearGradient
                colors={[PURPLE, PINK, ORANGE]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={s.selectButton}
              >
                <Text style={s.selectButtonText}>Select Avatar</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              style={s.cancelButton}
              onPress={closeAvatarModal}
              android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
            >
              <Text style={s.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  avatarEditButton: {
    position: 'absolute',
    right: -2,
    bottom: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ec5b13',
    borderWidth: 2,
    borderColor: '#2a1c4d',
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

  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 7, 20, 0.72)',
  },
  modalCard: {
    borderRadius: 36,
    paddingHorizontal: 22,
    paddingVertical: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  modalTitle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  modalSubtitle: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.62)',
    textAlign: 'center',
    fontSize: 14,
  },

  avatarGrid: {
    marginTop: 22,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  avatarOption: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOptionDefault: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  avatarOptionSelected: {
    backgroundColor: 'rgba(127,90,240,0.26)',
    borderWidth: 2,
    borderColor: 'rgba(192,132,252,0.95)',
    shadowColor: '#c084fc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarOptionText: {
    fontSize: 32,
  },

  selectButtonWrap: {
    marginTop: 22,
    borderRadius: 999,
    overflow: 'hidden',
  },
  selectButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 999,
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
});
