import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '214255387281-jlm6m1n1l07piv2s7poq015kq4hks40k.apps.googleusercontent.com',
  offlineAccess: false,
});

export async function signInWithGoogle() {
  const googleApi = GoogleSignin as any;
  if (typeof googleApi.hasPlayServices === 'function') {
    await googleApi.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  if (typeof googleApi.signIn !== 'function') {
    throw new Error('Google Sign-In is not available on this build. Rebuild the app and try again.');
  }

  const signInResult: any = await googleApi.signIn();
  const idToken: string | null =
    signInResult?.data?.idToken ?? signInResult?.idToken ?? null;

  if (!idToken) {
    throw new Error('Google Sign-In did not return an idToken.');
  }

  const authModule = auth as any;
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
