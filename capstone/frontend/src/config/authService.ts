import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import type { UserCredential } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

// Signup function with extra fields
export const signup = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  // 1️⃣ Create user with Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // 2️⃣ Save extra info to Firestore
  await setDoc(doc(db, "users", userCredential.user.uid), {
    email,
    createdAt: new Date(),
  });

  return userCredential;
};

// Login
export const login = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout
export const logout = async (): Promise<void> => {
  return signOut(auth);
};