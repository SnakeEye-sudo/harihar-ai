"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_QUESTIONS = [
  "भारत की राजधानी क्या है?",
  "What is BharatGen?",
  "Mujhe Python seekhni hai, kahan se shuru karun?",
  "UPSC ke liye best strategy kya hai?",
];

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const msg = text ?? input;
    if (!msg.trim()) return;
    const newMessages: Message[] = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const history = newMessages.map(
        (m) => `${m.role === "user" ? "User" : "HariHar"}: ${m.content}`
      );
      const res = await axios.post(`${backendUrl}/api/chat`, {
        message: msg,
        history,
      });
      const reply = res.data.reply as string;
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Backend se connect nahi ho paya. Server URL ya port check karo.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-10 p-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-sm font-bold">
          हह
        </div>
        <div>
          <h1 className="text-base font-semibold leading-tight">
            HariHar (हरिहर)
          </h1>
          <p className="text-xs text-slate-400">
            BharatGen Param-1 • Hindi • English • Indic
          </p>
        </div>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700">
          v0.1
        </span>
      </header>

      {/* Chat area */}
      <section className="flex-1 flex flex-col p-4 gap-3 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-6 text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl font-bold">
              हह
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">HariHar se baat karo</h2>
              <p className="text-sm text-slate-400">
                Hindi, English, Hinglish ya kisi bhi Bharatiya bhasha mein
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => void sendMessage(q)}
                  className="text-left text-sm px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                हह
              </div>
            )}
            <div
              className={`max-w-sm md:max-w-xl lg:max-w-2xl rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                m.role === "user"
                  ? "bg-emerald-600 text-white rounded-tr-sm"
                  : "bg-slate-800 text-slate-100 rounded-tl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              हह
            </div>
            <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-400 flex gap-1">
              <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </section>

      {/* Input area */}
      <footer className="sticky bottom-0 p-4 border-t border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <textarea
            className="flex-1 rounded-xl bg-slate-900 border border-slate-700 p-3 text-sm outline-none focus:border-emerald-500 resize-none transition-colors"
            rows={2}
            placeholder="Apna sawal yahan likho… (Enter = Send, Shift+Enter = New line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
          />
          <button
            onClick={() => void sendMessage()}
            disabled={loading || !input.trim()}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors self-end mb-0.5"
          >
            Send
          </button>
        </div>
        <p className="text-center text-xs text-slate-600 mt-2">
          Powered by BharatGen Param-1 • Personal project by SnakeEye-sudo
        </p>
      </footer>
    </main>
  );
}
