import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Modal,
  Pressable,
  TextInput,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  PauseIcon,
  PlayIcon,
  SettingsIcon,
  TagIcon,
} from '../components/Icons/AppIcons';
import { BRAND } from '../utils/brand';

const PURPLE = '#7F5AF0';
const PINK = '#C084FC';
const ORANGE = '#FF8A5B';
const FOCUS_DURATION_SECONDS = 25 * 60;

const RING_PX = 248;
const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TAG_STORAGE_KEY = 'focusflow.tags';
const SELECTED_TAG_STORAGE_KEY = 'focusflow.selectedTag';
const MAX_TAGS = 12;

type Tag = {
  id: string;
  name: string;
  emoji: string;
};

const PRESET_TAGS: Tag[] = [
  { id: 'study', name: 'Study', emoji: '📚' },
  { id: 'work', name: 'Work', emoji: '💻' },
  { id: 'reading', name: 'Reading', emoji: '📖' },
  { id: 'meditation', name: 'Meditation', emoji: '🧘' },
];

const EMOJI_SUGGESTIONS = ['😴', '💼', '🏋️', '🎧', '🧠', '✍️'];

type Props = {
  userName?: string;
  userPhoto?: string | null;
  avatarEmoji?: string;
  onProfilePress?: () => void;
  onSettingsPress?: () => void;
};

export default function HomeScreen({
  userName = 'User',
  userPhoto,
  avatarEmoji = '🦁',
  onProfilePress,
  onSettingsPress,
}: Props) {
  const insets = useSafeAreaInsets();
  const [remainingSeconds, setRemainingSeconds] = React.useState(FOCUS_DURATION_SECONDS);
  const [isRunning, setIsRunning] = React.useState(false);
  const [tags, setTags] = React.useState<Tag[]>(PRESET_TAGS);
  const [selectedTag, setSelectedTag] = React.useState<Tag | null>(PRESET_TAGS[0]);
  const [isTagModalVisible, setIsTagModalVisible] = React.useState(false);
  const [draftSelectedTagId, setDraftSelectedTagId] = React.useState<string | null>(PRESET_TAGS[0].id);
  const [showCustomTagInput, setShowCustomTagInput] = React.useState(false);
  const [customTagName, setCustomTagName] = React.useState('');
  const [customTagEmoji, setCustomTagEmoji] = React.useState('✨');
  const [tagLimitMessage, setTagLimitMessage] = React.useState('');

  React.useEffect(() => {
    if (!isRunning || remainingSeconds <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setRemainingSeconds(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, remainingSeconds]);

  React.useEffect(() => {
    if (remainingSeconds === 0) {
      setIsRunning(false);
    }
  }, [remainingSeconds]);

  React.useEffect(() => {
    const hydrateTagsAndSelection = async () => {
      try {
        const [storedTags, storedSelectedTag] = await Promise.all([
          AsyncStorage.getItem(TAG_STORAGE_KEY),
          AsyncStorage.getItem(SELECTED_TAG_STORAGE_KEY),
        ]);

        if (storedTags) {
          const parsedTags = JSON.parse(storedTags) as Tag[];
          if (Array.isArray(parsedTags) && parsedTags.length > 0) {
            const validTags = parsedTags
              .filter(
                tag =>
                  typeof tag?.id === 'string' &&
                  typeof tag?.name === 'string' &&
                  typeof tag?.emoji === 'string',
              )
              .slice(0, MAX_TAGS);

            if (validTags.length > 0) {
              setTags(validTags);
            }
          }
        }

        if (storedSelectedTag) {
          const parsedSelectedTag = JSON.parse(storedSelectedTag) as Tag;
          if (parsedSelectedTag?.id && parsedSelectedTag?.name && parsedSelectedTag?.emoji) {
            setSelectedTag(parsedSelectedTag);
            setDraftSelectedTagId(parsedSelectedTag.id);
          }
        }
      } catch {
        setTags(PRESET_TAGS);
        setSelectedTag(PRESET_TAGS[0]);
        setDraftSelectedTagId(PRESET_TAGS[0].id);
      }
    };

    hydrateTagsAndSelection();
  }, []);

  React.useEffect(() => {
    AsyncStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(tags)).catch(() => undefined);
  }, [tags]);

  React.useEffect(() => {
    AsyncStorage.setItem(SELECTED_TAG_STORAGE_KEY, JSON.stringify(selectedTag)).catch(() => undefined);
  }, [selectedTag]);

  const remainingProgress = remainingSeconds / FOCUS_DURATION_SECONDS;
  const dashOffset = CIRCUMFERENCE * (1 - remainingProgress);
  const minutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (remainingSeconds % 60).toString().padStart(2, '0');
  const timeLabel = `${minutes}:${seconds}`;

  const closeTagModal = () => {
    setIsTagModalVisible(false);
    setShowCustomTagInput(false);
    setCustomTagName('');
    setCustomTagEmoji('✨');
    setTagLimitMessage('');
  };

  const openTagModal = () => {
    setDraftSelectedTagId(selectedTag?.id ?? PRESET_TAGS[0].id);
    setShowCustomTagInput(false);
    setCustomTagName('');
    setCustomTagEmoji('✨');
    setTagLimitMessage('');
    setIsTagModalVisible(true);
  };

  const handleDeleteTag = (tagId: string) => {
    const nextTags = tags.filter(tag => tag.id !== tagId);
    setTags(nextTags);

    if (draftSelectedTagId === tagId) {
      setDraftSelectedTagId(PRESET_TAGS[0].id);
    }

    if (selectedTag?.id === tagId) {
      setSelectedTag(PRESET_TAGS[0]);
    }
  };

  const handleSaveTag = () => {
    const normalizedName = customTagName.trim().replace(/\s+/g, ' ');
    const normalizedEmoji = customTagEmoji.trim() || '✨';

    if (normalizedName.length > 0) {
      const existingTag = tags.find(tag => tag.name.toLowerCase() === normalizedName.toLowerCase());

      if (!existingTag && tags.length >= MAX_TAGS) {
        setTagLimitMessage('You have reached the maximum tag limit (12). Delete an existing tag to create a new one.');
        return;
      }

      const newTagId = normalizedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const createdTag: Tag = {
        id: existingTag?.id ?? `${newTagId || 'tag'}-${Date.now()}`,
        name: normalizedName,
        emoji: normalizedEmoji,
      };

      setTags(prev => {
        if (existingTag) {
          return prev.map(tag => (tag.id === existingTag.id ? createdTag : tag));
        }

        return [...prev, createdTag];
      });

      setSelectedTag(createdTag);
      closeTagModal();
      return;
    }

    const pickedTag = tags.find(tag => tag.id === draftSelectedTagId) ?? PRESET_TAGS[0];
    setSelectedTag(pickedTag);
    closeTagModal();
  };

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
          <TouchableOpacity style={s.iconBtn} activeOpacity={0.75} onPress={onSettingsPress}>
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
              <Text style={s.timerTime}>{timeLabel}</Text>
              <Text style={s.timerMode}>FOCUS</Text>
            </View>
          </View>
        </View>

        <Pressable style={s.tagPill} onPress={openTagModal}>
          {selectedTag ? <Text style={s.tagEmojiText}>{selectedTag.emoji}</Text> : <TagIcon size={14} color={PINK} />}
          <Text style={s.tagText}>{selectedTag ? selectedTag.name : 'Select Tag'}</Text>
        </Pressable>

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

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            if (remainingSeconds === 0) {
              setRemainingSeconds(FOCUS_DURATION_SECONDS);
              setIsRunning(true);
              return;
            }

            setIsRunning(prev => !prev);
          }}
        >
          <LinearGradient
            colors={[PURPLE, PINK, ORANGE]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.playBtn}
          >
            {isRunning ? <PauseIcon size={44} color="#fff" /> : <PlayIcon size={48} color="#fff" />}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isTagModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeTagModal}
      >
        <View style={s.modalRoot}>
          <Pressable style={s.modalBackdrop} onPress={closeTagModal} />

          <View style={s.modalCard}>
            <View style={s.modalHandle} />

            <Text style={s.modalTitle}>Add or Select Tag</Text>
            <Text style={s.modalSubtitle}>What are you focusing on?</Text>

            <View style={s.tagsListWrap}>
              <FlatList
                data={tags}
                keyExtractor={item => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={s.tagsRow}
                contentContainerStyle={s.tagsListContent}
                renderItem={({ item }) => {
                  const isSelected = draftSelectedTagId === item.id;

                  return (
                    <View style={s.tagGridItem}>
                      <Pressable
                        style={isSelected ? s.tagChipSelectedWrap : s.tagChipWrap}
                        onPress={() => setDraftSelectedTagId(item.id)}
                        android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
                      >
                        <View style={isSelected ? s.tagChipSelectedInner : s.tagChip}>
                          <View style={s.tagChipMain}>
                            <Text style={s.tagChipEmoji}>{item.emoji}</Text>
                            <Text style={s.tagChipText} numberOfLines={1}>{item.name}</Text>
                          </View>

                          <TouchableOpacity
                            onPress={() => handleDeleteTag(item.id)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            style={s.deleteTagButton}
                            activeOpacity={0.7}
                          >
                            <Text style={s.deleteTagText}>×</Text>
                          </TouchableOpacity>
                        </View>
                      </Pressable>
                    </View>
                  );
                }}
              />
            </View>

            <TouchableOpacity
              style={s.addCustomButton}
              activeOpacity={0.85}
              onPress={() => {
                setTagLimitMessage('');
                setShowCustomTagInput(prev => !prev);
              }}
            >
              <Text style={s.addCustomText}>+ Add Custom Tag</Text>
            </TouchableOpacity>

            {showCustomTagInput ? (
              <View style={s.customInputsWrap}>
                <TextInput
                  value={customTagName}
                  onChangeText={text => {
                    setCustomTagName(text);
                    setTagLimitMessage('');
                  }}
                  placeholder="Enter tag name"
                  placeholderTextColor="rgba(255,255,255,0.45)"
                  style={s.customInput}
                />
                <TextInput
                  value={customTagEmoji}
                  onChangeText={setCustomTagEmoji}
                  placeholder="Emoji"
                  placeholderTextColor="rgba(255,255,255,0.45)"
                  style={s.customEmojiInput}
                  maxLength={2}
                />
              </View>
            ) : null}

            {showCustomTagInput ? (
              <View style={s.emojiPickerRow}>
                {EMOJI_SUGGESTIONS.map(emoji => (
                  <TouchableOpacity
                    key={emoji}
                    style={[s.emojiOption, customTagEmoji === emoji && s.emojiOptionActive]}
                    activeOpacity={0.85}
                    onPress={() => setCustomTagEmoji(emoji)}
                  >
                    <Text style={s.emojiOptionText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}

            {tagLimitMessage ? <Text style={s.limitMessage}>{tagLimitMessage}</Text> : null}

            <View style={s.modalActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={s.cancelButton}
                onPress={closeTagModal}
              >
                <Text style={s.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.9} style={s.saveButton} onPress={handleSaveTag}>
                <LinearGradient
                  colors={[PURPLE, PINK, ORANGE]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={s.saveButtonGradient}
                >
                  <Text style={s.saveButtonText}>Save Tag</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 9,
    minWidth: 136,
    minHeight: 46,
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
  tagEmojiText: {
    fontSize: 14,
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
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    maxHeight: '82%',
    backgroundColor: 'rgba(30, 15, 60, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
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
    fontSize: 24,
    fontWeight: '700',
  },
  modalSubtitle: {
    marginTop: 2,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 14,
  },
  tagsListWrap: {
    maxHeight: 280,
  },
  tagsListContent: {
    paddingBottom: 4,
  },
  tagsRow: {
    gap: 10,
    marginBottom: 10,
  },
  tagGridItem: {
    flex: 1,
  },
  tagChipWrap: {
    borderRadius: 14,
  },
  tagChipSelectedWrap: {
    borderRadius: 14,
    padding: 1,
    backgroundColor: 'rgba(129, 92, 240, 0.92)',
  },
  tagChip: {
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 10,
  },
  tagChipSelectedInner: {
    minHeight: 44,
    borderRadius: 13,
    backgroundColor: '#1E0F3D',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 10,
  },
  tagChipMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  tagChipEmoji: {
    fontSize: 16,
  },
  tagChipText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteTagButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  deleteTagText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '700',
  },
  addCustomButton: {
    marginTop: 14,
    alignItems: 'center',
  },
  addCustomText: {
    color: PURPLE,
    fontSize: 14,
    fontWeight: '700',
  },
  customInputsWrap: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
  },
  customInput: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: '#fff',
    fontSize: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
  },
  customEmojiInput: {
    width: 64,
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 10,
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
  },
  emojiPickerRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiOption: {
    minWidth: 44,
    minHeight: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  emojiOptionActive: {
    borderColor: 'rgba(129, 92, 240, 0.95)',
    backgroundColor: 'rgba(129, 92, 240, 0.2)',
  },
  emojiOptionText: {
    fontSize: 18,
  },
  limitMessage: {
    marginTop: 10,
    color: '#FFB190',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  modalActions: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
