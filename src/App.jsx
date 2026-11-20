import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import SplashScreen from "./components/SplashScreen";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

// Normalize Firebase user object for Vani AI dashboard and backend chat persistence
function mapFirebaseUser(firebaseUser) {
  if (!firebaseUser) return null;
  const fallbackName = firebaseUser.email
    ? firebaseUser.email.split("@")[0]
    : "Nikhil Gupta";

  return {
    uid: firebaseUser.uid,
    displayName: firebaseUser.displayName || fallbackName,
    name: firebaseUser.displayName || fallbackName,
    email: firebaseUser.email || "",
    photoURL: firebaseUser.photoURL || "",
  };
}

export default function App() {
  const [screen, setScreen] = useState("splash"); // "splash" | "login" | "dashboard"
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Sync authentication state with Firebase Auth across page reloads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const mapped = mapFirebaseUser(firebaseUser);
      setCurrentUser(mapped);
    });

    return () => unsubscribe();
  }, []);

  // Trigger Google OAuth popup flow via Firebase Authentication
  const handleGoogleLogin = async (options = {}) => {
    if (options.agreedToTerms === false) {
      setAuthError("Please accept the Terms of Service and Privacy Policy first.");
      return;
    }

    setAuthError("");
    setAuthLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const mapped = mapFirebaseUser(result.user);
      setCurrentUser(mapped);
      setScreen("dashboard");
    } catch (error) {
      console.error("Firebase Google sign-in error:", error.code, error.message);
      if (error.code === "auth/popup-closed-by-user") {
        setAuthError("Sign-in popup was closed before completing login.");
      } else if (error.code === "auth/unauthorized-domain") {
        setAuthError("Add this domain in Firebase Console -> Authentication -> Settings.");
      } else {
        setAuthError("Google sign-in failed. Please try again.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign out from Firebase and return to the login screen
  const handleLogout = async () => {
    setAuthError("");
    try {
      await signOut(auth);
      setCurrentUser(null);
      setScreen("login");
    } catch (error) {
      console.error("Firebase sign-out error:", error.message);
    }
  };

  // Move past splash screen to login or directly to dashboard if already signed in
  const handleSplashFinish = () => {
    if (currentUser) {
      setScreen("dashboard");
    } else {
      setScreen("login");
    }
  };

  return (
    <main className="min-h-dvh w-full bg-[#FFFFFF] overflow-x-hidden">
      <AnimatePresence mode="popLayout">
        {screen === "splash" && (
          <SplashScreen
            key="vani-splash"
            onFinish={handleSplashFinish}
          />
        )}

        {screen === "login" && (
          <Login
            key="vani-login"
            onGoogleLogin={handleGoogleLogin}
            onContinueWithGoogle={handleGoogleLogin}
            onLoginSuccess={() => setScreen("dashboard")}
            authError={authError}
            authLoading={authLoading}
            currentUser={currentUser}
          />
        )}

        {screen === "dashboard" && (
          <Dashboard
            key="vani-dashboard"
            userName={currentUser?.displayName || currentUser?.name || "Nikhil Gupta"}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </main>
  );
}