import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import type { UserCredential } from "firebase/auth";
import { auth } from "./firebase";

// Signup function with extra fields
export const signup = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

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