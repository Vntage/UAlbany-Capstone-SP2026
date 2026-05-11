// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../config/firebase";

interface AuthContextProps {
  currentUser: User | null;
  authorizing: boolean;
}

const AuthContext = createContext<AuthContextProps>({ currentUser: null, authorizing: true });

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authorizing, setAuthorizing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthorizing(false);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ currentUser, authorizing }}>{children}</AuthContext.Provider>;
};