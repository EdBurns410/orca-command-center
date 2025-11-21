import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { BOT_CHATTER } from '../constants';
import { chatWithOracle } from '../services/geminiService';
import { Send, User, Bot, Cpu } from 'lucide-react';

interface OracleChatProps {
  externalMessages: ChatMessage[]; // Messages from system (e.g., new launch)
}

export const OracleChat: React.FC<OracleChatProps> = ({ externalMessages }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with some bot chatter
  useEffect(() => {
    setMessages([
      { id: 'init-1', sender: 'community', text: "Markets looking bullish today.", timestamp: Date.now() },
      { id: 'init-2', sender: 'ai', text: "What are we shipping today, boss?", timestamp: Date.now() }
    ]);
  }, []);

  // Handle external messages (System events)
  useEffect(() => {
    if (externalMessages.length > 0) {
      const newMsg = externalMessages[externalMessages.length - 1];
      // Check duplication by timestamp/ID roughly
      setMessages(prev => {
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    }
  }, [externalMessages]);

  // Simulate random background chatter
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every interval
        const randomTxt = BOT_CHATTER[Math.floor(Math.random() * BOT_CHATTER.length)];
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'community',
          text: randomTxt,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, botMsg]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages
        .filter(m => m.sender === 'user' || m.sender === 'ai')
        .slice(-5) // Last 5 relevant messages
        .map(m => `${m.sender === 'user' ? 'User' : 'VibeArchitect'}: ${m.text}`);

      const reply = await chatWithOracle(userMsg.text, history);
      
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 border-l border-slate-800 backdrop-blur-sm w-full">
      <div className="p-4 border-b border-slate-800 flex items-center gap-2">
        <Cpu size={18} className="text-purple-400" />
        <h2 className="text-sm font-bold text-slate-200 tracking-wider">BOARDROOM ORACLE</h2>
        <div className="flex-1" />
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[10px] text-slate-500">LIVE</span>
      </div>

      {/* Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1">
                {msg.sender === 'ai' && <span className="text-[10px] font-bold text-purple-400">VibeArchitect</span>}
                {msg.sender === 'community' && <span className="text-[10px] font-bold text-slate-500">Anon_Dev</span>}
                {msg.sender === 'system' && <span className="text-[10px] font-bold text-green-400">SYSTEM</span>}
            </div>
            
            <div className={`max-w-[90%] text-sm p-2.5 rounded-lg font-mono ${
              msg.sender === 'user' 
                ? 'bg-cyan-900/20 text-cyan-100 border border-cyan-800' 
                : msg.sender === 'ai'
                ? 'bg-purple-900/20 text-purple-100 border border-purple-800'
                : msg.sender === 'system'
                ? 'bg-green-900/10 text-green-300 border border-green-900 border-dashed w-full text-center'
                : 'bg-slate-800/50 text-slate-400'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-xs text-slate-500 animate-pulse">VibeArchitect is typing...</div>}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 focus-within:border-cyan-500/50 transition-colors">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for vibe check..."
            className="bg-transparent border-none outline-none text-sm text-slate-200 flex-1 font-mono placeholder:text-slate-600"
          />
          <button onClick={handleSend} className="text-cyan-400 hover:text-cyan-300">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};