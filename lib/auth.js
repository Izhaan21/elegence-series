import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase';
import { isAdminUser } from './firestore';

export async function signInAdmin(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;

  // Verify this UID exists in the admins Firestore collection
  const isAdmin = await isAdminUser(uid);
  if (!isAdmin) {
    await signOut(auth);
    throw new Error('Access denied. This account does not have admin privileges.');
  }
  return cred.user;
}

export async function signOutAdmin() {
  return signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser() {
  return auth.currentUser;
}
