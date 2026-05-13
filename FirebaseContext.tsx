import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth, testFirestoreConnection } from '../lib/firebase';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({ user: null, loading: true });

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testFirestoreConnection();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // For the demo, we sign in anonymously to satisfy security rules
        try {
          await signInAnonymously(auth);
        } catch (e) {
          console.error("Auth failed:", e);
        }
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, loading }}>
      {!loading && children}
    </FirebaseContext.Provider>
  );
};
