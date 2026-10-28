import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseClient';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

/**
 * Kullanıcı oturumunu email + şifre ile açar.
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return mapFirebaseUser(credential.user);
}

/**
 * Yeni kullanıcı kaydı oluşturur ve Firestore'a kullanıcı dokümanı ekler.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<AuthUser> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = mapFirebaseUser(credential.user);

  // Firestore'da kullanıcı dokümanı oluştur
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    displayName,
    photoURL: user.photoURL,
    role: 'user', // varsayılan rol
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { ...user, displayName };
}

/**
 * Oturumu kapatır.
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Şifre sıfırlama e-postası gönderir.
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Firebase User nesnesini AuthUser tipine dönüştürür.
 */
export function mapFirebaseUser(firebaseUser: User): AuthUser {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
  };
}