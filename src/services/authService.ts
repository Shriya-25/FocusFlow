import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '214255387281-jlm6m1n1l07piv2s7poq015kq4hks40k.apps.googleusercontent.com',
  offlineAccess: false,
});

const readIdTokenFromSignInResult = (value: unknown): string | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const direct = (value as { idToken?: unknown }).idToken;
  if (typeof direct === 'string' && direct.length > 0) {
    return direct;
  }

  const data = (value as { data?: { idToken?: unknown } }).data;
  if (data && typeof data.idToken === 'string' && data.idToken.length > 0) {
    return data.idToken;
  }

  return null;
};

export async function signInWithGoogle() {
  const googleApi = GoogleSignin as {
    hasPlayServices?: (options?: { showPlayServicesUpdateDialog?: boolean }) => Promise<unknown>;
    signIn?: () => Promise<unknown>;
  };
  if (typeof googleApi.hasPlayServices === 'function') {
    await googleApi.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  if (typeof googleApi.signIn !== 'function') {
    throw new Error('Google Sign-In is not available on this build. Rebuild the app and try again.');
  }

  const signInResult = await googleApi.signIn();
  const idToken = readIdTokenFromSignInResult(signInResult);

  if (!idToken) {
    throw new Error('Google Sign-In did not return an idToken.');
  }

  const authModule = auth as unknown as {
    GoogleAuthProvider?: { credential?: (token: string) => unknown };
  };
  const credentialFactory = authModule.GoogleAuthProvider?.credential;
  if (typeof credentialFactory !== 'function') {
    throw new Error('Firebase Google auth is not configured correctly.');
  }

  const googleCredential = credentialFactory(idToken);
  const firebaseAuth = auth();
  if (typeof firebaseAuth.signInWithCredential !== 'function') {
    throw new Error('Firebase sign-in method is unavailable in this build.');
  }

  return firebaseAuth.signInWithCredential(googleCredential);
}

export async function signOutFromGoogle() {
  await GoogleSignin.signOut();
  return auth().signOut();
}
