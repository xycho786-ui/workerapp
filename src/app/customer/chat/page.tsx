"use client";

import { Send, User, Bot } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function CustomerChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error('Failed to fetch response');
      const data = await response.json();
      
      const assistantMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: data.message.content 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please check the API route or your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F5F7] pb-20">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-slate-100 shadow-sm z-10 sticky top-0 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Support Assistant</h2>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Online</p>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60 pt-20">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Bot size={32} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Booking Support</h3>
            <p className="text-sm text-slate-500 max-w-[250px]">I can help you manage your active bookings, confirm worker arrivals, and coordinate details.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>
                {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`p-3.5 rounded-2xl max-w-[80%] text-[13px] leading-relaxed shadow-sm ${
                m.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
              }`}>
                {m.content}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-3 flex-row animate-in fade-in">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-slate-200 text-slate-600">
              <Bot size={14} />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm rounded-tl-none flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Area */}
      <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-20">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about your booking..."
            className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 placeholder:text-slate-400 font-medium transition-all"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center flex-shrink-0 hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:scale-100 active:scale-95 shadow-sm shadow-primary/20"
          >
            <Send size={18} className="-ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
