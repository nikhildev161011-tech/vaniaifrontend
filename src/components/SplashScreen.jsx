import React, { useEffect } from "react";
import { motion } from "framer-motion";

// Apple "Hello"-style cursive/script font stack matching Login.jsx
const helloScriptFontStyle = {
  fontFamily:
    "'Snell Roundhand', 'Apple Chancery', 'Bradley Hand', 'Segoe Script', 'Brush Script MT', cursive",
};

// Minimal custom geometric V + ring mark for Vani AI
function VaniMark() {
  return (
    <svg
      width="84"
      height="84"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Vani AI Logo"
    >
      {/* Outer minimal V stroke */}
      <motion.path
        d="M16 24L45 78C47 81.5 52 81.5 54 78L72 44"
        stroke="#0B1528"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Inner parallel V stroke */}
      <motion.path
        d="M27 24L49.5 65.5L65 36.5"
        stroke="#0B1528"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Top-right minimal double ring mark */}
      <motion.circle
        cx="77"
        cy="26"
        r="12"
        stroke="#0B1528"
        strokeWidth="5"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.25, ease: "easeOut" }}
      />
      <motion.circle
        cx="77"
        cy="26"
        r="4"
        fill="#0B1528"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, delay: 1.4, ease: "easeOut" }}
      />
    </svg>
  );
}

export default function SplashScreen({ onFinish }) {
  // Transition out smoothly after the delayed cascade and logo reveal complete
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3400);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFFFFF] select-none overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Delayed top-to-bottom sky-blue gradient cascading down into pure white */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-[74%]"
        style={{
          background:
            "linear-gradient(180deg, #229CE8 0%, #56BDF7 36%, #B4E5FD 68%, rgba(255, 255, 255, 0) 100%)",
        }}
        initial={{ y: "-45%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{
          duration: 1.5,
          delay: 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* Subtle micro-dot architectural pattern that softly fades out downward */}
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
      </motion.div>

      {/* Centered Vani AI mark & matching Apple "Hello"-style wordmark */}
      <div className="relative z-10 flex flex-col items-center">
        <VaniMark />

        <motion.h1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.9,
            delay: 1.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={helloScriptFontStyle}
          className="mt-5 text-5xl sm:text-6xl font-semibold italic tracking-normal leading-none text-[#0B1528]"
        >
          <span>Vani </span>
          <span className="text-[#0284C7]">AI</span>
        </motion.h1>
      </div>
    </motion.div>
  );
}