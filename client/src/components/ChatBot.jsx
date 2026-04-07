import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Trash2, Moon, Sun, Zap } from "lucide-react";

const API_URL = "http://localhost:5000/api/chatbot";

const QUICK_ACTIONS = [
  { label: "💰 Pricing Advice", prompt: "How should I price my freelance services as a student?" },
  { label: "✍️ Gig Writer", prompt: "Help me write a compelling gig description for my services" },
  { label: "🚀 Skill Tips", prompt: "What high-demand skills should I learn to get more clients?" },
  { label: "🤝 First Client", prompt: "How do I land my very first freelance client with no experience?" },
];

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "bot",
  content:
    "Hey there! 👋 I'm **FreelanceBot**, your personal student freelancing coach.\n\nI can help you with:\n• 💰 Pricing your services competitively\n• ✍️ Writing killer gig descriptions\n• 🚀 Developing high-demand skills\n• 🤝 Landing your first clients\n\nWhat would you like to work on today?",
  timestamp: new Date(),
};

function parseMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code class='bg-black/10 dark:bg-white/10 rounded px-1 py-0.5 text-sm font-mono'>$1</code>")
    .replace(/^#{1,3}\s+(.+)$/gm, "<strong class='text-base'>$1</strong>")
    .replace(/^[•\-]\s+(.+)$/gm, "• $1")
    .split("\n")
    .map((line) => (line.trim() ? `<span class="block">${line}</span>` : `<span class="block h-2"></span>`))
    .join("");
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 mb-4 animate-in fade-in slide-in-from-bottom-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-lg">
        FB
      </div>
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
              style={{ animationDelay: `${i * 150}ms`, animationDuration: "0.8s" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className={`flex items-end gap-2.5 mb-6 ${isUser ? "flex-row-reverse" : ""} animate-in fade-in slide-in-from-bottom-3 duration-300`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-xl border-2 border-white dark:border-slate-800 z-10">
          FB
        </div>
      )}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 text-[10px] font-black shrink-0 shadow-sm border-2 border-white dark:border-slate-900 z-10">
          YOU
        </div>
      )}

      <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1.5`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm leading-relaxed text-sm ${isUser
            ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-br-none shadow-blue-500/10"
            : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 rounded-bl-none"
            }`}
        >
          {isUser ? (
            <p className="font-medium">{message.content}</p>
          ) : (
            <div className="prose-sm leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }} />
          )}
        </div>
        <span className="text-[9px] text-slate-400 dark:text-slate-500 px-1 font-bold uppercase tracking-widest">{time}</span>
      </div>
    </div>
  );
}

function QuickActionButton({ action, onClick, disabled }) {
  return (
    <button
      onClick={() => onClick(action.prompt)}
      disabled={disabled}
      className="px-4 py-2 rounded-xl text-xs font-bold border border-blue-100 dark:border-slate-700 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-200 dark:hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap shadow-sm active:scale-95"
    >
      {action.label}
    </button>
  );
}

export default function ChatBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed || isLoading) return;

      setError(null);
      setInput("");

      const userMsg = { id: Date.now(), role: "user", content: trimmed, timestamp: new Date() };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] }));

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, history }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Server error");
        }

        const data = await res.json();

        const botMsg = { id: Date.now() + 1, role: "bot", content: data.reply, timestamp: new Date() };
        setMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        console.error("ChatBot fetch error:", err);
        setError(err.message || "Something went wrong. Is the backend running?");
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => setMessages([WELCOME_MESSAGE]);

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-28 right-8 z-[110] w-full max-w-[440px] h-[650px] max-h-[calc(100vh-140px)] flex flex-col bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.3)] border border-white/50 dark:border-slate-800/50 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out transition-all ${isDark ? 'dark' : ''}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/20 dark:border-slate-800/20 shrink-0 bg-white/40 dark:bg-slate-900/40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xl font-black shadow-xl shadow-blue-500/20 border-2 border-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            FB
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tighter text-slate-900 dark:text-white flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              FreelanceBot <Zap size={14} className="text-blue-500 fill-blue-500" />
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Neural Link Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setIsDark(!isDark)} className="w-10 h-10 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center transition-all duration-200 border border-white/20 dark:border-slate-700/50" title="Toggle theme">
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center justify-center transition-all duration-200 border border-white/20 dark:border-slate-700/50 group" title="Close chat">
              <X size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
            </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-2 scrollbar-none">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && <TypingIndicator />}

        {error && (
          <div className="flex items-start gap-4 mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-3xl text-xs text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
            <X size={16} className="shrink-0" />
            <div>
              <strong className="font-black uppercase tracking-widest block mb-1">Grid Protocol Error</strong>
              <p className="font-medium opacity-80">{error}</p>
              <button onClick={() => setError(null)} className="mt-2 font-black uppercase tracking-widest underline underline-offset-4 ring-offset-2 hover:no-underline transition-all">
                Re-sync Node
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Footer Area */}
      <div className="px-6 py-6 bg-white/40 dark:bg-slate-900/40 border-t border-white/20 dark:border-slate-800/20 shrink-0 space-y-4">
        {/* Quick Actions */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          {QUICK_ACTIONS.map((action) => (
            <QuickActionButton key={action.label} action={action} onClick={sendMessage} disabled={isLoading} />
          ))}
          <button onClick={clearChat} className="px-4 py-2 rounded-xl text-xs font-bold border border-white dark:border-slate-800 text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-900/50 hover:text-red-500 transition-all shadow-sm" title="Clear Grid History">
            <Trash2 size={14} />
          </button>
        </div>

        {/* Input */}
        <div className="relative flex items-center gap-3">
          <div className="flex-1 relative group">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Initiate communication..."
              rows={1}
              disabled={isLoading}
              className="w-full resize-none rounded-2xl border border-white dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 px-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 disabled:opacity-60 transition-all duration-200 max-h-32 shadow-inner overflow-y-auto"
              style={{ scrollbarWidth: "none" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
              }}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className="w-14 h-14 rounded-2xl shrink-0 bg-gradient-to-br from-blue-600 to-indigo-700 hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-40 text-white shadow-xl shadow-blue-500/30 flex items-center justify-center transition-all duration-200"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={22} className="translate-x-0.5 -translate-y-0.5" />
            )}
          </button>
        </div>
        <p className="text-center text-[9px] text-slate-400 dark:text-slate-600 font-extrabold uppercase tracking-[0.2em] italic">
          Secure Neural Interface (Beta 2.1)
        </p>
      </div>
    </div>
  );
}