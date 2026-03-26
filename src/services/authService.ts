import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const WEB_CLIENT_ID =
  '214255387281-jlm6m1n1l07piv2s7poq015kq4hks40k.apps.googleusercontent.com';

// Configure eagerly so it's ready before any sign-in attempt.
GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  offlineAccess: false,
});

/** Re-configure before each sign-in to ensure the SDK is never left in a bad
 *  state after sign-out (observed on some devices with google-signin v13+). */
const ensureConfigured = () => {
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    offlineAccess: false,
  });
};

const readIdTokenFromSignInResult = (value: unknown): string | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  // v13+ SDK: { type: 'success', data: { idToken, ... } }
  const typed = value as { type?: string; data?: { idToken?: unknown }; idToken?: unknown };
  if (typed.type === 'cancelled') {
    return null; // user dismissed the picker — not an error
  }
  if (typed.type === 'success' && typed.data && typeof typed.data.idToken === 'string') {
    return typed.data.idToken;
  }

  // Legacy / direct shape: { idToken: '...' }
  if (typeof typed.idToken === 'string' && typed.idToken.length > 0) {
    return typed.idToken;
  }

  // Nested data shape without a type discriminant
  if (typed.data && typeof typed.data.idToken === 'string' && typed.data.idToken.length > 0) {
    return typed.data.idToken;
  }

  return null;
};

export async function signInWithGoogle() {
  ensureConfigured();

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const signInResult = await GoogleSignin.signIn();

  // User cancelled — throw a user-friendly message so the caller can display it.
  if (
    signInResult &&
    typeof signInResult === 'object' &&
    (signInResult as { type?: string }).type === 'cancelled'
  ) {
    throw new Error('Sign-in was cancelled.');
  }

  const idToken = readIdTokenFromSignInResult(signInResult);

  if (!idToken) {
    throw new Error('Google Sign-In did not return an idToken. Please try again.');
  }

  // @react-native-firebase/auth v23 exposes GoogleAuthProvider on the default export.
  const GoogleAuthProvider = (auth as unknown as { GoogleAuthProvider: { credential: (token: string) => unknown } }).GoogleAuthProvider;
  if (!GoogleAuthProvider || typeof GoogleAuthProvider.credential !== 'function') {
    throw new Error('Firebase GoogleAuthProvider is not available. Rebuild the app.');
  }

  const googleCredential = GoogleAuthProvider.credential(idToken);
  return auth().signInWithCredential(
    googleCredential as Parameters<ReturnType<typeof auth>['signInWithCredential']>[0],
  );
}

export async function signOutFromGoogle() {
  try {
    await GoogleSignin.signOut();
  } catch {
    // GoogleSignin.signOut can throw if the user was already signed out.
  }
  return auth().signOut();
}
