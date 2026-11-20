import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Check, X } from "lucide-react";

// Large animated bot character with realistic blinking and smooth floating
function LoginBotCharacter() {
  return (
    <motion.div
      className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-1"
      initial={{ opacity: 0, scale: 0.92, y: 10 }}
      animate={{
        opacity: 1,
        scale: [1, 1.02, 1],
        y: [0, -8, 0],
        rotate: [0, -1.2, 1.2, 0],
      }}
      transition={{
        opacity: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
        scale: { duration: 3.6, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 4.4, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {/* Soft sky aura behind the bot */}
      <div className="pointer-events-none absolute inset-4 rounded-full bg-[#38BDF8]/20 blur-2xl" />

      <img
        src="/vani-bot.png"
        alt="Vani AI Assistant"
        className="relative z-10 w-full h-full object-contain drop-shadow-[0_14px_26px_rgba(14,116,144,0.22)]"
      />

      {/* Natural periodic eye blink aligned over the LED eyes */}
      <div className="pointer-events-none absolute z-20 top-[35%] left-[49%] -translate-x-1/2 flex items-center gap-5 sm:gap-6">
        <motion.span
          className="block w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#061B2E]"
          animate={{
            scaleY: [0, 0, 1, 0, 0],
            opacity: [0, 0, 0.95, 0, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            times: [0, 0.45, 0.49, 0.53, 1],
            ease: "easeInOut",
          }}
        />
        <motion.span
          className="block w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#061B2E]"
          animate={{
            scaleY: [0, 0, 1, 0, 0],
            opacity: [0, 0, 0.95, 0, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            times: [0, 0.45, 0.49, 0.53, 1],
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}

// Clean Google G icon inside the black button
function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
      />
    </svg>
  );
}

const uiFontStyle = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

const helloScriptFontStyle = {
  fontFamily:
    "'Snell Roundhand', 'Apple Chancery', 'Bradley Hand', 'Segoe Script', 'Brush Script MT', cursive",
};

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

const slideFromLeftVariants = {
  hidden: { x: -40, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Login({
  onGoogleLogin,
  onContinueWithGoogle,
  onLoginSuccess,
  authError = "",
  authLoading = false,
}) {
  const [agreed, setAgreed] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [activePolicy, setActivePolicy] = useState(null); // "terms" | "privacy" | null

  // Display authentication errors passed from App.jsx in the bottom pill alert
  useEffect(() => {
    if (authError) {
      setAlertMessage(authError);
    }
  }, [authError]);

  // Auto-dismiss custom bottom pill alert after 3 seconds
  useEffect(() => {
    if (!alertMessage) return;
    const timer = setTimeout(() => {
      setAlertMessage("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [alertMessage]);

  // Require consent checkbox and start Firebase Google sign-in
  const handleGoogleContinue = async () => {
    if (!agreed) {
      setAlertMessage("Please check the Terms & Privacy box first");
      return;
    }

    setAlertMessage("");
    const triggerAuth = onGoogleLogin || onContinueWithGoogle;

    if (triggerAuth) {
      await triggerAuth({ agreedToTerms: agreed });
      return;
    }

    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  const handleToggleAgree = () => {
    const nextState = !agreed;
    setAgreed(nextState);
    if (nextState && alertMessage) {
      setAlertMessage("");
    }
  };

  return (
    <motion.div
      style={uiFontStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative min-h-dvh w-full flex flex-col items-center justify-center bg-[#FFFFFF] text-[#0B1528] px-4 sm:px-6 pt-6 pb-20 overflow-x-hidden select-none"
    >
      {/* Top-to-bottom sky-blue gradient + micro-dot pattern */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[74%]"
        style={{
          background:
            "linear-gradient(180deg, #229CE8 0%, #56BDF7 36%, #B4E5FD 68%, rgba(255, 255, 255, 0) 100%)",
        }}
      >
        <div
          className="h-full w-full opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.9) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            maskImage:
              "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

      {/* Mobile-first responsive container sliding in from the left */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-[380px] sm:max-w-md flex flex-col items-center text-center"
      >
        {/* Top animated chatbot */}
        <motion.div variants={slideFromLeftVariants}>
          <LoginBotCharacter />
        </motion.div>

        {/* Apple "Hello"-style script brand wordmark */}
        <motion.h1
          variants={slideFromLeftVariants}
          style={helloScriptFontStyle}
          className="text-5xl sm:text-6xl font-semibold italic tracking-normal leading-none text-[#0B1528] pt-1"
        >
          <span>Vani </span>
          <span className="text-[#0284C7]">AI</span>
        </motion.h1>

        {/* Subdued secondary prompt */}
        <motion.p
          variants={slideFromLeftVariants}
          className="mt-2.5 text-xs sm:text-sm font-normal text-[#475569]"
        >
          Sign in or create a secure account
        </motion.p>

        {/* Black Continue with Google button wired to Firebase Auth */}
        <motion.div variants={slideFromLeftVariants} className="mt-6 w-full">
          <motion.button
            type="button"
            disabled={authLoading}
            whileHover={{ scale: authLoading ? 1 : 1.012 }}
            whileTap={{ scale: authLoading ? 1 : 0.985 }}
            onClick={handleGoogleContinue}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[#0B0F19] hover:bg-[#161E2E] disabled:opacity-70 text-white px-4 sm:px-5 py-3.5 text-sm sm:text-base font-semibold shadow-md transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            <span>
              {authLoading ? "Signing in with Google..." : "Continue with Google"}
            </span>
          </motion.button>
        </motion.div>

        {/* Clean, well-aligned checkbox + Terms & Privacy notice */}
        <motion.div
          variants={slideFromLeftVariants}
          className="mt-4 w-full flex items-start gap-2.5 text-left"
        >
          <button
            type="button"
            role="checkbox"
            aria-checked={agreed}
            aria-label="Agree to Terms of Service and Privacy Policy"
            onClick={handleToggleAgree}
            className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.75px] transition-colors cursor-pointer ${
              agreed
                ? "border-[#0B0F19] bg-[#0B0F19] text-white"
                : "border-[#0B1528]/75 bg-white hover:border-[#0B0F19]"
            }`}
          >
            {agreed && <Check className="w-3 h-3 stroke-[3]" />}
          </button>

          <p className="flex-1 text-xs leading-[1.45] tracking-[-0.01em] font-normal text-[#1E293B]">
            By signing up or connecting with the services above, you agree to our{" "}
            <button
              type="button"
              onClick={() => setActivePolicy("terms")}
              className="font-semibold text-[#0369A1] underline decoration-[#0369A1]/60 underline-offset-2 hover:text-[#075985] cursor-pointer"
            >
              Terms of Service
            </button>{" "}
            and acknowledge our{" "}
            <button
              type="button"
              onClick={() => setActivePolicy("privacy")}
              className="font-semibold text-[#0369A1] underline decoration-[#0369A1]/60 underline-offset-2 hover:text-[#075985] cursor-pointer"
            >
              Privacy Policy
            </button>{" "}
            describing how we handle your personal data.
          </p>
        </motion.div>
      </motion.div>

      {/* Custom bottom-aligned pill alert (never browser native alert, never middle-shifted) */}
      <div className="pointer-events-none fixed bottom-5 inset-x-0 z-40 flex justify-center px-4">
        <AnimatePresence>
          {alertMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              role="alert"
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[#0B0F19] text-white border border-white/15 px-4 py-2.5 text-xs sm:text-[13px] font-medium shadow-lg"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-[#38BDF8]" />
              <span>{alertMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Terms of Service & Privacy Policy modal */}
      <AnimatePresence>
        {activePolicy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePolicy(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-left shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-[#0B1528]">
                  {activePolicy === "terms" ? "Terms of Service" : "Privacy Policy"}
                </h2>
                <button
                  type="button"
                  onClick={() => setActivePolicy(null)}
                  aria-label="Close modal"
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 max-h-64 overflow-y-auto space-y-3 text-sm leading-relaxed text-[#334155]">
                {activePolicy === "terms" ? (
                  <>
                    <p>
                      Welcome to <strong>Vani AI</strong>. By accessing or using this platform, you agree to use it responsibly and follow applicable guidelines.
                    </p>
                    <p>
                      AI responses are designed to assist with learning, coding, and everyday tasks. Please verify important details independently.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Vani AI</strong> respects your privacy. Account sign-in is used solely to identify your profile and protect your sessions.
                    </p>
                    <p>
                      Your conversations stay linked to your account so you can access your chat history smoothly without unauthorized sharing.
                    </p>
                  </>
                )}
              </div>

              <div className="mt-5 flex justify-end border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setAgreed(true);
                    setAlertMessage("");
                    setActivePolicy(null);
                  }}
                  className="rounded-xl bg-[#0B0F19] px-4 py-2 text-sm font-semibold text-white hover:bg-[#161E2E] transition-colors cursor-pointer"
                >
                  Agree & Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}