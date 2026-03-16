const Sound = require('react-native-sound') as any;

const REMOTE_BELL_URL =
  'https://freesound.org/people/LegitCheese/sounds/571513/download/571513__legitcheese__soft-notifications-bell-ding-dong.mp3';

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
    const sound = new Sound(REMOTE_BELL_URL, '', (error: unknown) => {
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
