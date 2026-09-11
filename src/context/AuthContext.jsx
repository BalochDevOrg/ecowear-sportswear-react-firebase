/* eslint-disable react-refresh/only-export-components -- context module pattern exports hook + provider */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async ({ name, email, password }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }

    /** Public sign-ups start as customer; promote `admin` manually in Firestore (README). */
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      name,
      email,
      role: "customer",
      createdAt: serverTimestamp(),
    });

    const payload = {
      uid: cred.user.uid,
      name,
      email,
      role: "customer",
    };
    setUser(payload);
    return payload;
  };

  const login = async ({ email, password }) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    const userRef = doc(db, "users", cred.user.uid);
    const userSnap = await getDoc(userRef);

    let role = "customer";
    let name = cred.user.displayName || "";

    if (userSnap.exists()) {
      const data = userSnap.data();
      role = data.role || "customer";
      name = data.name || name;
    }

    const payload = {
      uid: cred.user.uid,
      name,
      email: cred.user.email,
      role,
    };

    setUser(payload);
    return payload;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        let role = "customer";
        let name = firebaseUser.displayName || "";

        if (userSnap.exists()) {
          const data = userSnap.data();
          role = data.role || "customer";
          name = data.name || name;
        }

        setUser({
          uid: firebaseUser.uid,
          name,
          email: firebaseUser.email,
          role,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      register,
      login,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
