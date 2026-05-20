"use client";

import { useState, useRef, useEffect } from "react";

// Mesajın tipi (Kim yazdı? Ne yazdı?)
type Message = {
  id: number;
  role: "user" | "ai";
  content: string;
};

export default function ChatInterface({ userName }: { userName: string }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Başlangıç mesajı
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      content: `Merhaba ${userName}! 👋 Ben MevzuatAI asistanıyım. Sana nasıl bir dilekçe veya hukuki konuda yardımcı olabilirim?`,
    },
  ]);

  // Otomatik aşağı kaydırma
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Kullanıcının mesajını ekle
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // 2. Yapay Zeka (Şimdilik taklit yapıyoruz)
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "ai",
        content:
          "Anladım, bu durumu değerlendiriyorum... (Gerçek AI yakında buraya gelecek!) 🤖",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Üst Başlık */}
      <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <h3 className="font-semibold">MevzuatAI Asistanı</h3>
        </div>
        <span className="text-xs text-blue-100">Online</span>
      </div>

      {/* Mesaj Alanı */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Yükleniyor Animasyonu */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Yazma Alanı */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-white border-t border-gray-100 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Derdini anlat (Örn: Kiracım kirayı ödemiyor...)"
          className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
