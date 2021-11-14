import React, { useContext } from "react";
import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "@firebase/auth";
import { auth } from "../services/firebase-config";
import Loading from "./Loading";
import { getCurrentUserData } from "../services/helper";
export const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setcurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [restrictedLoading, setRestrictedLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState();

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    signOut(auth);
    setcurrentUser(null);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setcurrentUser(user);
        getCurrentUserData(user).then((data) => {
          setCurrentUserData(data);
          setRestrictedLoading(false);
        });
      } else {
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <Loading />;
  }

  const value = {
    currentUser,
    currentUserData,
    restrictedLoading,
    signup,
    login,
    logout,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
