import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '214255387281-jlm6m1n1l07piv2s7poq015kq4hks40k.apps.googleusercontent.com',
  offlineAccess: false,
});

export async function signInWithGoogle() {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const signInResult: any = await GoogleSignin.signIn();
  const idToken: string | null =
    signInResult?.data?.idToken ?? signInResult?.idToken ?? null;

  if (!idToken) {
    throw new Error('Google Sign-In did not return an idToken.');
  }

  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  return auth().signInWithCredential(googleCredential);
}

export async function signOutFromGoogle() {
  await GoogleSignin.signOut();
  return auth().signOut();
}
