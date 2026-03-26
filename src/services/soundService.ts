const Sound = require('react-native-sound') as any;

// Bell sound is bundled locally.
// Android: add bell.mp3 to  android/app/src/main/res/raw/bell.mp3
// iOS:     add bell.mp3 to  ios/FocusFlow/bell.mp3  (check "Copy items if needed")
const SOUND_FILE = 'bell.mp3';
const SOUND_BASE = Sound.MAIN_BUNDLE;

let isConfigured = false;

const configureSoundCategory = () => {
  if (isConfigured) {
    return;
  }

  try {
    Sound.setCategory('Playback');
  } catch {
    // Ignore category setup failures and still attempt playback.
  }

  isConfigured = true;
};

const loadSoundFromUrl = () => {
  return new Promise<any>((resolve, reject) => {
    const sound = new Sound(SOUND_FILE, SOUND_BASE, (error: unknown) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(sound);
    });
  });
};

export const playCompletionSound = async (): Promise<void> => {
  configureSoundCategory();

  let sound: any;

  try {
    sound = await loadSoundFromUrl();
    sound.setVolume(0.7);
    sound.setNumberOfLoops(0);

    await new Promise<void>((resolve, reject) => {
      sound.play((success: boolean) => {
        sound.release();

        if (success) {
          resolve();
          return;
        }

        reject(new Error('Completion sound playback failed.'));
      });
    });
  } catch {
    if (sound && typeof sound.release === 'function') {
      sound.release();
    }
  }
};
