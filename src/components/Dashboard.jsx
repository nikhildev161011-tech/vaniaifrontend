import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Info,
  Mic,
  MicOff,
  ArrowUp,
  Square,
  X,
  Pin,
  Trash2,
  Pencil,
  Check,
  Copy,
  AlertCircle,
  ArrowLeft,
  LogOut,
  MessageSquare,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env?.VITE_API_URL || "http://localhost:5000";

const uiFontStyle = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

const helloScriptFontStyle = {
  fontFamily:
    "'Snell Roundhand', 'Apple Chancery', 'Bradley Hand', 'Segoe Script', 'Brush Script MT', cursive",
};

// Left-to-right blue-to-white melt surface style for Vani AI chat replies
const assistantBlueMeltStyle = {
  background:
    "linear-gradient(90deg, #B8E4FD 0%, #DFF2FE 36%, #F5FBFF 70%, #FFFFFF 100%)",
};

// Frosted liquid-glass surface style for the bottom input composer
const liquidGlassComposerStyle = {
  background:
    "linear-gradient(135deg, rgba(255, 255, 255, 0.68) 0%, rgba(240, 249, 255, 0.52) 55%, rgba(255, 255, 255, 0.62) 100%)",
  backdropFilter: "blur(24px) saturate(165%)",
  WebkitBackdropFilter: "blur(24px) saturate(165%)",
};

// Dark frosted liquid-glass surface style for the bottom input composer in incognito mode
const incognitoLiquidGlassComposerStyle = {
  background:
    "linear-gradient(135deg, rgba(21, 30, 50, 0.72) 0%, rgba(15, 23, 42, 0.58) 100%)",
  backdropFilter: "blur(24px) saturate(160%)",
  WebkitBackdropFilter: "blur(24px) saturate(160%)",
};

// Premium left-to-right blue-to-white melt surface for saved history items
const premiumHistoryCardStyle = {
  background:
    "linear-gradient(105deg, rgba(186, 230, 253, 0.88) 0%, rgba(224, 242, 254, 0.92) 48%, rgba(255, 255, 255, 0.98) 100%)",
};

// Staggered left-to-right entrance animation variants for full-screen history items
const historyListContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const slideFromLeftItemVariants = {
  hidden: { x: -44, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Modern asymmetric three-line menu icon with no background box
function ModernMenuLines({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="3" y1="6.5" x2="21" y2="6.5" />
      <line x1="3" y1="12" x2="16.5" y2="12" />
      <line x1="3" y1="17.5" x2="19" y2="17.5" />
    </svg>
  );
}

// Modern geometric plus icon for image attachment and new chat actions
function ModernPlusIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// Authentic Chrome-style Incognito icon with no background box
function ChromeIncognitoIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M7.2 4.5C7.5 3.6 8.3 3 9.3 3h5.4c1 0 1.8.6 2.1 1.5L18.2 9H5.8l1.4-4.5Z" />
      <rect x="2.5" y="9.8" width="19" height="1.7" rx="0.85" />
      <circle
        cx="7.6"
        cy="16.2"
        r="3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <circle
        cx="16.4"
        cy="16.2"
        r="3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path
        d="M10.7 15.8c.8-.5 1.8-.5 2.6 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Minimal Vani V + ring emblem used in the center of the empty dashboard
function VaniCenterMark({ isIncognito = false }) {
  const strokeColor = isIncognito ? "#F8FAFC" : "#0B1528";

  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Vani Logo"
    >
      <path
        d="M16 24L45 78C47 81.5 52 81.5 54 78L72 44"
        stroke={strokeColor}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 24L49.5 65.5L65 36.5"
        stroke={strokeColor}
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="77"
        cy="26"
        r="12"
        stroke={strokeColor}
        strokeWidth="5.2"
      />
      <circle cx="77" cy="26" r="4.2" fill={strokeColor} />
    </svg>
  );
}

// Time-aware greeting helper supporting Good Morning, Good Afternoon, Good Evening, and Good Night
function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 22) return "Good Evening";
  return "Good Night";
}

// Capitalize the very first character of spoken text
function capitalizeFirstLetter(text) {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

// Convert a File object into base64 string without data URL prefix
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const commaIndex = result.indexOf(",");
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

// Custom code block renderer with one-click copy support
function CodeBlock({ className, children }) {
  const [copied, setCopied] = useState(false);
  const rawCode = String(children).replace(/\n$/, "");
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "code";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-slate-800 bg-[#090D16] text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-800/90 bg-slate-900/90 px-3.5 py-1.5 text-[11px] font-medium text-slate-400">
        <span className="uppercase tracking-wider">{lang}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="no-scrollbar overflow-x-auto p-3.5 text-xs leading-relaxed">
        <code>{rawCode}</code>
      </pre>
    </div>
  );
}

export default function Dashboard({ currentUser, onLogout }) {
  // Always use the name provided by the authenticated Google account
  const signedInName =
    currentUser?.displayName?.trim() ||
    currentUser?.name?.trim() ||
    "";

  const userKey =
    currentUser?.uid || currentUser?.email || "guest_session";

  const [historyOpen, setHistoryOpen] = useState(false);
  const [showAboutPage, setShowAboutPage] = useState(false);
  const [isIncognito, setIsIncognito] = useState(false);

  // Saved chat history (never written to when incognito is active)
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("vani_saved_chats");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [attachedImage, setAttachedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Rename state inside full-screen history view
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  // Custom bottom pill toast/alert
  const [pillToast, setPillToast] = useState("");

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);

  const showToast = (msg) => setPillToast(msg);

  const clearAttachedImage = () => {
    if (attachedImage?.previewUrl) {
      URL.revokeObjectURL(attachedImage.previewUrl);
    }
    setAttachedImage(null);
  };

  useEffect(() => {
    try {
      localStorage.setItem("vani_saved_chats", JSON.stringify(chatHistory));
    } catch {
      // Ignore storage errors
    }
  }, [chatHistory]);

  // Fetch saved chats from MongoDB Atlas backend when available
  useEffect(() => {
    let ignore = false;

    async function loadServerChats() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/chats?userKey=${encodeURIComponent(userKey)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.chats)) {
          const normalized = data.chats.map((c) => ({
            id: c._id,
            title: c.title,
            pinned: Boolean(c.pinned),
            updatedAt: c.updatedAt ? new Date(c.updatedAt).getTime() : Date.now(),
            messages: Array.isArray(c.messages)
              ? c.messages.map((m, idx) => ({
                  id: `db_msg_${c._id}_${idx}`,
                  role: m.role,
                  text: m.text || "",
                  image: null,
                  imageName: m.imageName || null,
                }))
              : [],
          }));
          setChatHistory(normalized);
        }
      } catch {
        // Keep local cache if backend is temporarily unreachable
      }
    }

    loadServerChats();
    return () => {
      ignore = true;
    };
  }, [userKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  useEffect(() => {
    if (!pillToast) return;
    const timer = setTimeout(() => setPillToast(""), 2800);
    return () => clearTimeout(timer);
  }, [pillToast]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (attachedImage?.previewUrl) {
        URL.revokeObjectURL(attachedImage.previewUrl);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore stop errors
        }
      }
    };
  }, [attachedImage]);

  // Start a clean standard chat session
  const handleNewChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    clearAttachedImage();
    setIsGenerating(false);
    setIsIncognito(false);
    setShowAboutPage(false);
    setActiveChatId(null);
    setMessages([]);
    setInputText("");
    setHistoryOpen(false);
  };

  // Toggle Incognito mode: chats in incognito are never persisted to history or DB
  const handleToggleIncognito = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    clearAttachedImage();
    setIsGenerating(false);
    setShowAboutPage(false);
    const nextIncognito = !isIncognito;
    setIsIncognito(nextIncognito);
    setActiveChatId(null);
    setMessages([]);
    setInputText("");
  };

  // Open a saved chat from the full-screen history page
  const handleSelectChat = (chat) => {
    setIsIncognito(false);
    setShowAboutPage(false);
    setActiveChatId(chat.id);
    setMessages(chat.messages || []);
    setHistoryOpen(false);
  };

  const handleTogglePin = async (e, id) => {
    e.stopPropagation();
    const target = chatHistory.find((item) => item.id === id);
    const nextPinned = target ? !target.pinned : true;

    setChatHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, pinned: nextPinned } : item
      )
    );

    try {
      await fetch(`${API_BASE_URL}/api/chats/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: nextPinned }),
      });
    } catch {
      // Local state already updated
    }
  };

  const handleDeleteChat = async (e, id) => {
    e.stopPropagation();
    setChatHistory((prev) => prev.filter((item) => item.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
      setMessages([]);
    }
    showToast("Chat removed from history");

    try {
      await fetch(`${API_BASE_URL}/api/chats/${id}`, {
        method: "DELETE",
      });
    } catch {
      // Local state already updated
    }
  };

  const startRename = (e, chat) => {
    e.stopPropagation();
    setRenamingId(chat.id);
    setRenameValue(chat.title);
  };

  const saveRename = async (e, id) => {
    e.stopPropagation();
    const trimmed = renameValue.trim();
    if (trimmed) {
      setChatHistory((prev) =>
        prev.map((item) => (item.id === id ? { ...item, title: trimmed } : item))
      );

      try {
        await fetch(`${API_BASE_URL}/api/chats/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: trimmed }),
        });
      } catch {
        // Local state already updated
      }
    }
    setRenamingId(null);
  };

  const handleLogoutClick = () => {
    setHistoryOpen(false);
    setShowAboutPage(false);
    if (onLogout) {
      onLogout();
    } else {
      showToast("Logged out");
    }
  };

  // Handle image upload via "+" button
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file");
      return;
    }
    if (attachedImage?.previewUrl) {
      URL.revokeObjectURL(attachedImage.previewUrl);
    }
    const previewUrl = URL.createObjectURL(file);
    setAttachedImage({ file, name: file.name, previewUrl });
    e.target.value = "";
  };

  // Voice input via Web Speech API with guaranteed capitalized first letter
  const handleToggleMic = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast("Voice typing is not supported in this browser");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      showToast("Could not capture voice, please try again");
    };
    recognition.onresult = (event) => {
      const rawTranscript = event.results?.[0]?.[0]?.transcript || "";
      const formattedTranscript = capitalizeFirstLetter(rawTranscript);
      if (formattedTranscript) {
        setInputText((prev) => {
          const combined = prev
            ? `${prev.trim()} ${formattedTranscript}`
            : formattedTranscript;
          return capitalizeFirstLetter(combined);
        });
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Send prompt/image to Express backend (/api/chat) and sync MongoDB history
  const handleSend = async () => {
    const trimmed = inputText.trim();
    if ((!trimmed && !attachedImage) || isGenerating) return;

    const currentAttachment = attachedImage;
    const userMsg = {
      id: `msg_${Date.now()}`,
      role: "user",
      text: trimmed,
      image: currentAttachment?.previewUrl || null,
      imageName: currentAttachment?.name || null,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputText("");
    setAttachedImage(null);
    setIsGenerating(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const backendChatId =
      activeChatId && /^[a-f\d]{24}$/i.test(String(activeChatId))
        ? activeChatId
        : null;

    try {
      let imageBase64 = null;
      let imageMimeType = null;

      if (currentAttachment?.file) {
        imageBase64 = await readFileAsBase64(currentAttachment.file);
        imageMimeType = currentAttachment.file.type || "image/jpeg";
      }

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: trimmed,
          chatId: backendChatId,
          userKey,
          incognito: isIncognito,
          imageBase64,
          imageMimeType,
          imageName: currentAttachment?.name || null,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to get response from Vani AI");
      }

      const assistantMsg = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        text: data.reply,
      };

      const finalMessages = [...nextMessages, assistantMsg];
      setMessages(finalMessages);

      if (!isIncognito && data.chat) {
        const savedId = data.chat._id;
        setActiveChatId(savedId);

        setChatHistory((prev) => {
          const formattedChat = {
            id: savedId,
            title: data.chat.title,
            pinned: Boolean(data.chat.pinned),
            updatedAt: Date.now(),
            messages: finalMessages,
          };
          const exists = prev.some((item) => item.id === savedId);
          if (exists) {
            return prev.map((item) =>
              item.id === savedId ? formattedChat : item
            );
          }
          return [formattedChat, ...prev];
        });
      }
    } catch (err) {
      if (err.name === "AbortError") {
        showToast("Response stopped");
      } else {
        console.error("Chat request failed:", err);
        showToast(err.message || "Unable to connect to Vani AI server");
      }
    } finally {
      abortControllerRef.current = null;
      setIsGenerating(false);
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sortedHistory = [...chatHistory].sort((a, b) => {
    if (a.pinned === b.pinned) return (b.updatedAt || 0) - (a.updatedAt || 0);
    return a.pinned ? -1 : 1;
  });

  const canSend = Boolean(inputText.trim() || attachedImage);

  return (
    <div
      style={uiFontStyle}
      className={`no-scrollbar relative min-h-dvh w-full flex flex-col justify-between overflow-x-hidden transition-colors duration-300 ${
        isIncognito
          ? "bg-[#0B0F19] text-[#F8FAFC]"
          : "bg-[#FFFFFF] text-[#0B1528]"
      }`}
    >
      {/* Hide visible scrollbars across all scrollable elements */}
      <style>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Matching sky-blue-to-white cascade + subtle micro-dot pattern */}
      {!isIncognito ? (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 h-[66%] z-0"
          style={{
            background:
              "linear-gradient(180deg, #229CE8 0%, #56BDF7 38%, #B4E5FD 70%, rgba(255, 255, 255, 0) 100%)",
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
      ) : (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 h-[55%] z-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(14, 116, 144, 0.24) 0%, rgba(15, 23, 42, 0.12) 60%, rgba(11, 15, 25, 0) 100%)",
          }}
        />
      )}

      {/* Full-page About section */}
      {showAboutPage ? (
        <section className="no-scrollbar relative z-20 min-h-dvh w-full max-w-2xl mx-auto flex flex-col justify-between px-4 sm:px-6 pt-3.5 pb-6 overflow-y-auto">
          <div>
            {/* Top bar with Back button and centered Vani AI title */}
            <div className="grid grid-cols-3 items-center pb-3">
              <div className="flex items-center justify-start">
                <button
                  type="button"
                  onClick={() => setShowAboutPage(false)}
                  aria-label="Back to dashboard"
                  className={`inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-75 cursor-pointer ${
                    isIncognito ? "text-white" : "text-[#0B1528]"
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
              </div>

              <div className="flex items-center justify-center">
                <span
                  style={helloScriptFontStyle}
                  className={`text-2xl sm:text-3xl font-semibold italic leading-none pt-0.5 select-none whitespace-nowrap ${
                    isIncognito ? "text-white" : "text-[#0B1528]"
                  }`}
                >
                  Vani <span className="text-[#0284C7]">AI</span>
                </span>
              </div>

              <div />
            </div>

            {/* About & Legal section body */}
            <div className="mt-5 space-y-5">
              <div>
                <h1
                  className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                    isIncognito ? "text-white" : "text-[#0B1528]"
                  }`}
                >
                  About Vani AI
                </h1>
                <p
                  className={`mt-1 text-xs sm:text-sm ${
                    isIncognito ? "text-slate-300" : "text-[#475569]"
                  }`}
                >
                  Version 1.0 • Conversational Assistant
                </p>
              </div>

              <div
                className={`space-y-4 text-sm leading-relaxed ${
                  isIncognito ? "text-slate-200" : "text-[#1E293B]"
                }`}
              >
                <p>
                  <strong>Vani AI</strong> is a personal conversational assistant designed for quick answers, coding support, writing, and everyday tasks across mobile and desktop devices.
                </p>

                <div>
                  <h2
                    className={`text-base font-bold ${
                      isIncognito ? "text-white" : "text-[#0B1528]"
                    }`}
                  >
                    Privacy &amp; Incognito Sessions
                  </h2>
                  <p className="mt-1">
                    Standard chats are saved to your chat history so you can revisit them anytime. When you switch to Incognito mode, your prompts and replies remain temporary and are never stored in your history list.
                  </p>
                </div>

                <div>
                  <h2
                    className={`text-base font-bold ${
                      isIncognito ? "text-white" : "text-[#0B1528]"
                    }`}
                  >
                    Legal Notice &amp; Usage Terms
                  </h2>
                  <p className="mt-1">
                    Vani AI is provided as an informational and productivity tool. Responses may occasionally contain inaccuracies or incomplete details—please verify critical technical, legal, financial, or personal information independently. By using Vani AI, you agree to comply with applicable laws and respect intellectual property rights.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Creator & Developer placed at the very bottom end of the full page */}
          <div
            className={`mt-10 pt-4 border-t text-xs sm:text-sm flex items-center justify-between ${
              isIncognito
                ? "border-white/15 text-slate-300"
                : "border-slate-300/80 text-[#0B1528]"
            }`}
          >
            <span>
              <strong>Creator &amp; Developer: Nikhil Gupta</strong>
            </span>
            <span className="text-xs opacity-75">
              © {new Date().getFullYear()} Vani AI
            </span>
          </div>
        </section>
      ) : (
        <>
          {/* Top Navigation Bar */}
          <header className="relative z-20 grid grid-cols-3 items-center px-3.5 sm:px-6 pt-3.5 pb-2">
            <div className="flex items-center justify-start">
              <button
                type="button"
                onClick={() => setHistoryOpen(true)}
                aria-label="Open chat history"
                className={`p-1.5 transition-opacity hover:opacity-75 cursor-pointer ${
                  isIncognito ? "text-white" : "text-[#0B1528]"
                }`}
              >
                <ModernMenuLines className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center">
              <span
                style={helloScriptFontStyle}
                className={`text-2xl sm:text-3xl font-semibold italic leading-none pt-0.5 select-none whitespace-nowrap ${
                  isIncognito ? "text-white" : "text-[#0B1528]"
                }`}
              >
                Vani <span className="text-[#0284C7]">AI</span>
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 sm:gap-3">
              {/* Chrome-style Incognito icon: black in normal mode, white in incognito mode, no background */}
              <button
                type="button"
                onClick={handleToggleIncognito}
                aria-pressed={isIncognito}
                aria-label="Toggle Incognito Mode"
                title={
                  isIncognito ? "Incognito active" : "Switch to Incognito chat"
                }
                className={`p-1.5 transition-opacity hover:opacity-75 cursor-pointer ${
                  isIncognito ? "text-[#FFFFFF]" : "text-[#000000]"
                }`}
              >
                <ChromeIncognitoIcon className="w-5 h-5" />
              </button>

              {/* About page trigger icon */}
              <button
                type="button"
                onClick={() => setShowAboutPage(true)}
                aria-label="About Vani AI"
                title="About Vani AI"
                className={`p-1.5 transition-opacity hover:opacity-75 cursor-pointer ${
                  isIncognito ? "text-[#FFFFFF]" : "text-[#0B1528]"
                }`}
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Main Content Area: Greeting Empty State or Conversation Stream */}
          <main className="no-scrollbar relative z-10 flex-1 w-full max-w-2xl mx-auto flex flex-col px-3.5 sm:px-6 pt-3 pb-4">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center"
                >
                  <VaniCenterMark isIncognito={isIncognito} />

                  <h1
                    className={`mt-4 text-2xl sm:text-3xl font-semibold tracking-tight ${
                      isIncognito ? "text-white" : "text-[#0B1528]"
                    }`}
                  >
                    {signedInName
                      ? `${getTimeGreeting()}, ${signedInName}`
                      : getTimeGreeting()}
                  </h1>
                </motion.div>
              </div>
            ) : (
              <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto pb-2">
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  const hasOnlyImage = isUser && msg.image && !msg.text;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {hasOnlyImage ? (
                        <img
                          src={msg.image}
                          alt={msg.imageName || "Uploaded image"}
                          className="max-w-[78%] sm:max-w-[60%] max-h-60 rounded-2xl object-cover shadow-xs"
                        />
                      ) : (
                        <div
                          style={
                            !isUser && !isIncognito
                              ? assistantBlueMeltStyle
                              : undefined
                          }
                          className={`max-w-[86%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                            isUser
                              ? "bg-[#0B0F19] text-white"
                              : isIncognito
                              ? "bg-white/10 text-slate-100 border border-white/10"
                              : "text-[#0B1528] border border-sky-200/70"
                          }`}
                        >
                          {msg.image && (
                            <img
                              src={msg.image}
                              alt={msg.imageName || "Uploaded"}
                              className="mb-2 max-h-48 rounded-xl object-cover"
                            />
                          )}

                          {isUser ? (
                            msg.text && (
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                            )
                          ) : (
                            <ReactMarkdown
                              components={{
                                code({ inline, className, children, ...props }) {
                                  if (inline) {
                                    return (
                                      <code
                                        className="rounded bg-slate-800/15 px-1.5 py-0.5 text-xs font-mono"
                                        {...props}
                                      >
                                        {children}
                                      </code>
                                    );
                                  }
                                  return (
                                    <CodeBlock className={className}>
                                      {children}
                                    </CodeBlock>
                                  );
                                },
                                ul({ children }) {
                                  return (
                                    <ul className="my-2 list-disc pl-5 space-y-1">
                                      {children}
                                    </ul>
                                  );
                                },
                                ol({ children }) {
                                  return (
                                    <ol className="my-2 list-decimal pl-5 space-y-1">
                                      {children}
                                    </ol>
                                  );
                                },
                                p({ children }) {
                                  return (
                                    <p className="mb-2 last:mb-0">{children}</p>
                                  );
                                },
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {isGenerating && (
                  <div className="flex justify-start">
                    <div
                      style={
                        !isIncognito ? assistantBlueMeltStyle : undefined
                      }
                      className={`inline-flex items-center gap-1.5 rounded-2xl px-4 py-3 text-xs font-medium ${
                        isIncognito
                          ? "bg-white/10 text-slate-300"
                          : "text-slate-700 border border-sky-200/70"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-[#0284C7] animate-bounce" />
                      <span className="h-2 w-2 rounded-full bg-[#0284C7] animate-bounce [animation-delay:0.15s]" />
                      <span className="h-2 w-2 rounded-full bg-[#0284C7] animate-bounce [animation-delay:0.3s]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </main>

          {/* Liquid / Frosted Glass Bottom Chat Composer ("How can I help you today?") */}
          <footer className="relative z-20 w-full max-w-2xl mx-auto px-3.5 sm:px-6 pb-4 sm:pb-6 pt-1">
            <div
              style={
                isIncognito
                  ? incognitoLiquidGlassComposerStyle
                  : liquidGlassComposerStyle
              }
              className={`rounded-3xl border px-3.5 sm:px-4 pt-3 pb-2.5 transition-all ${
                isIncognito
                  ? "border-white/20 text-white shadow-[0_14px_34px_rgba(2,132,199,0.22)] ring-1 ring-sky-300/20"
                  : "border-white/80 text-[#0B1528] shadow-[0_12px_32px_rgba(14,116,144,0.16)] ring-1 ring-sky-200/75"
              }`}
            >
              {/* Attached image preview chip */}
              {attachedImage && (
                <div className="mb-2.5 inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/75 backdrop-blur-md px-2.5 py-1.5 text-xs text-slate-700">
                  <img
                    src={attachedImage.previewUrl}
                    alt={attachedImage.name}
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                  <span className="max-w-[140px] truncate font-medium">
                    {attachedImage.name}
                  </span>
                  <button
                    type="button"
                    onClick={clearAttachedImage}
                    aria-label="Remove image"
                    className="rounded-full p-0.5 text-slate-500 hover:bg-slate-200/80 hover:text-slate-900 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Prompt textarea */}
              <textarea
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="How can I help you today?"
                className={`no-scrollbar w-full resize-none bg-transparent text-sm sm:text-[15px] leading-relaxed focus:outline-none ${
                  isIncognito
                    ? "text-white placeholder:text-slate-300/80"
                    : "text-[#0B1528] placeholder:text-[#334155]/85"
                }`}
              />

              {/* Bottom action row */}
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="flex items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Attach image"
                    className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-colors cursor-pointer ${
                      isIncognito
                        ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                        : "border-white/80 bg-white/65 text-[#0B0F19] hover:bg-white/90"
                    }`}
                  >
                    <ModernPlusIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleMic}
                    aria-label={
                      isListening ? "Stop voice input" : "Start voice input"
                    }
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors cursor-pointer ${
                      isListening
                        ? "bg-red-500 text-white"
                        : isIncognito
                        ? "bg-white/10 text-slate-200 hover:bg-white/20"
                        : "bg-white/55 text-[#0B1528] hover:bg-white/85"
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>

                  {isGenerating ? (
                    <button
                      type="button"
                      onClick={handleStopGeneration}
                      aria-label="Stop response"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B0F19] text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={!canSend}
                      aria-label="Send message"
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-all cursor-pointer ${
                        canSend
                          ? "bg-[#0B0F19] text-white hover:bg-[#1E293B] shadow-sm"
                          : "bg-white/60 text-slate-500 border border-white/70 cursor-not-allowed"
                      }`}
                    >
                      <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Full-Screen History View: Centered Vani AI, Close (X) Icon, No Menu Lines or "History" Label */}
      <AnimatePresence>
        {historyOpen && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`no-scrollbar fixed inset-0 z-40 flex flex-col justify-between overflow-x-hidden ${
              isIncognito
                ? "bg-[#0B0F19] text-[#F8FAFC]"
                : "bg-[#FFFFFF] text-[#0B1528]"
            }`}
          >
            {/* Matching top-to-bottom sky-blue-to-white melt background */}
            {!isIncognito ? (
              <div
                className="pointer-events-none fixed inset-x-0 top-0 h-[68%] z-0"
                style={{
                  background:
                    "linear-gradient(180deg, #229CE8 0%, #56BDF7 38%, #B4E5FD 70%, rgba(255, 255, 255, 0) 100%)",
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
            ) : (
              <div
                className="pointer-events-none fixed inset-x-0 top-0 h-[55%] z-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(14, 116, 144, 0.28) 0%, rgba(15, 23, 42, 0.14) 60%, rgba(11, 15, 25, 0) 100%)",
                }}
              />
            )}

            {/* Full-screen container with staggered left-side entrance */}
            <motion.div
              variants={historyListContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 flex-1 min-h-0 w-full max-w-2xl mx-auto flex flex-col justify-between px-4 sm:px-6 pt-3.5 pb-6"
            >
              <div className="flex-1 min-h-0 flex flex-col">
                {/* Centered Vani AI brand and right-aligned close (X) button */}
                <motion.div
                  variants={slideFromLeftItemVariants}
                  className="grid grid-cols-3 items-center pb-3"
                >
                  <div />

                  <div className="flex items-center justify-center">
                    <span
                      style={helloScriptFontStyle}
                      className={`text-2xl sm:text-3xl font-semibold italic leading-none pt-0.5 select-none whitespace-nowrap ${
                        isIncognito ? "text-white" : "text-[#0B1528]"
                      }`}
                    >
                      Vani <span className="text-[#0284C7]">AI</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setHistoryOpen(false)}
                      aria-label="Close history"
                      className={`p-1.5 transition-opacity hover:opacity-75 cursor-pointer ${
                        isIncognito ? "text-white" : "text-[#0B1528]"
                      }`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>

                {/* Start New Chat button sliding smoothly from left */}
                <motion.div
                  variants={slideFromLeftItemVariants}
                  className="mt-2 mb-4"
                >
                  <button
                    type="button"
                    onClick={handleNewChat}
                    className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 px-4 text-sm font-semibold shadow-md transition-all cursor-pointer ${
                      isIncognito
                        ? "bg-[#38BDF8] text-[#0B0F19] hover:bg-[#7DD3FC]"
                        : "bg-[#0B0F19] text-white hover:bg-[#1E293B]"
                    }`}
                  >
                    <ModernPlusIcon className="w-4 h-4" />
                    <span>Start New Chat</span>
                  </button>
                </motion.div>

                {/* Saved chats list with refined premium melt surface and subtle depth */}
                <div className="no-scrollbar flex-1 overflow-y-auto space-y-2.5 pb-3">
                  {sortedHistory.length === 0 ? (
                    <motion.div
                      variants={slideFromLeftItemVariants}
                      style={!isIncognito ? premiumHistoryCardStyle : undefined}
                      className={`rounded-2xl border p-8 text-center backdrop-blur-md ${
                        isIncognito
                          ? "border-white/15 bg-white/5 text-slate-300"
                          : "border-sky-200/90 text-[#0B1528] shadow-[0_8px_24px_rgba(2,132,199,0.08)]"
                      }`}
                    >
                      <MessageSquare
                        className={`w-6 h-6 mx-auto mb-2 ${
                          isIncognito ? "text-sky-400" : "text-[#0284C7]"
                        }`}
                      />
                      <p className="text-sm font-semibold">No saved chats yet</p>
                      <p className="mt-1 text-xs opacity-75">
                        Your standard conversations will appear here.
                      </p>
                    </motion.div>
                  ) : (
                    sortedHistory.map((chat) => {
                      const isActive = chat.id === activeChatId && !isIncognito;
                      const isEditing = renamingId === chat.id;

                      return (
                        <motion.div
                          key={chat.id}
                          variants={slideFromLeftItemVariants}
                          onClick={() => handleSelectChat(chat)}
                          style={!isIncognito ? premiumHistoryCardStyle : undefined}
                          className={`group flex items-center justify-between gap-2 rounded-2xl border px-4 py-3.5 text-xs sm:text-sm font-medium backdrop-blur-md transition-all cursor-pointer ${
                            isIncognito
                              ? isActive
                                ? "border-[#38BDF8] bg-white/15 text-white shadow-sm"
                                : "border-white/15 bg-white/8 text-slate-100 hover:bg-white/12"
                              : isActive
                              ? "border-[#0284C7] text-[#0B1528] ring-2 ring-[#0284C7]/25 shadow-[0_8px_22px_rgba(2,132,199,0.14)]"
                              : "border-sky-200/90 text-[#0B1528] hover:border-[#0284C7]/60 shadow-[0_6px_18px_rgba(14,116,144,0.08)]"
                          }`}
                        >
                          <div className="min-w-0 flex-1 flex items-center gap-2">
                            {chat.pinned && (
                              <Pin
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isIncognito ? "text-[#38BDF8]" : "text-[#0284C7]"
                                }`}
                              />
                            )}

                            {isEditing ? (
                              <input
                                type="text"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveRename(e, chat.id);
                                }}
                                autoFocus
                                className="w-full rounded-xl border border-[#0284C7] bg-white px-2.5 py-1 text-xs sm:text-sm text-slate-900 focus:outline-none"
                              />
                            ) : (
                              <span className="truncate font-semibold text-[#0B1528]">
                                {chat.title}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {isEditing ? (
                              <button
                                type="button"
                                onClick={(e) => saveRename(e, chat.id)}
                                aria-label="Save title"
                                className="rounded-lg p-1.5 text-emerald-600 hover:bg-white/50 cursor-pointer"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={(e) => handleTogglePin(e, chat.id)}
                                  aria-label="Pin chat"
                                  className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                                    isIncognito
                                      ? "text-slate-300 hover:bg-white/10 hover:text-white"
                                      : "text-[#0B1528]/70 hover:bg-white/70 hover:text-[#0B1528]"
                                  }`}
                                >
                                  <Pin className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => startRename(e, chat)}
                                  aria-label="Rename chat"
                                  className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                                    isIncognito
                                      ? "text-slate-300 hover:bg-white/10 hover:text-white"
                                      : "text-[#0B1528]/70 hover:bg-white/70 hover:text-[#0B1528]"
                                  }`}
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteChat(e, chat.id)}
                                  aria-label="Delete chat"
                                  className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                                    isIncognito
                                      ? "text-slate-300 hover:bg-red-500/20 hover:text-red-400"
                                      : "text-[#0B1528]/70 hover:bg-red-50 hover:text-red-600"
                                  }`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Full-width black Logout button sliding smoothly from left at the bottom */}
              <motion.div
                variants={slideFromLeftItemVariants}
                className="pt-3 border-t border-slate-200/60"
              >
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0B0F19] hover:bg-[#1E293B] text-white py-3 px-4 text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </motion.div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Custom Bottom Pill Alert / Toast */}
      <div className="pointer-events-none fixed bottom-4 inset-x-0 z-50 flex justify-center px-4">
        <AnimatePresence>
          {pillToast && (
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              role="status"
              className="inline-flex items-center gap-2 rounded-full bg-[#0B0F19] text-white border border-white/15 px-4 py-2 text-xs font-medium shadow-lg"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#38BDF8]" />
              <span>{pillToast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}