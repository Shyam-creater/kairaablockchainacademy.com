import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, User, Send, Paperclip, Mic, Sparkles, 
  RefreshCcw, Copy, ThumbsUp, ThumbsDown, MessageSquarePlus, Clock
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  { id: 'explain', label: 'Explain this lesson', icon: '🧠' },
  { id: 'summarize', label: 'Summarize', icon: '📝' },
  { id: 'quiz', label: 'Generate Quiz', icon: '🎯' },
  { id: 'interview', label: 'Interview Questions', icon: '💼' },
  { id: 'topics', label: 'Important Topics', icon: '⭐' },
  { id: 'example', label: 'Real World Example', icon: '🌍' },
  { id: 'mistakes', label: 'Common Mistakes', icon: '⚠️' },
  { id: 'revision', label: 'Revision Notes', icon: '📚' },
  { id: 'practice', label: 'Practice Questions', icon: '✏️' },
  { id: 'flashcards', label: 'Generate Flashcards', icon: '🎴' },
];

const TypingIndicator = () => (
  <div className="flex items-center gap-2 p-4 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl rounded-tl-sm w-fit shadow-sm">
    <div className="flex gap-1.5">
      <motion.div className="w-2 h-2 bg-[#94A3B8] rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
      <motion.div className="w-2 h-2 bg-[#94A3B8] rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
      <motion.div className="w-2 h-2 bg-[#94A3B8] rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
    </div>
    <span className="text-xs font-medium text-[#64748B]">AI is thinking...</span>
  </div>
);

const AICoPilot = ({ lessonTitle }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Initialize greeting
  useEffect(() => {
    setMessages([
      { 
        id: '1',
        role: 'ai', 
        text: `Hello! I'm your AI Learning Assistant. I'm ready to help you master "${lessonTitle || 'this lesson'}". What would you like to explore?`,
        timestamp: new Date().toISOString()
      }
    ]);
  }, [lessonTitle]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAIResponse = (userText) => {
    const text = userText.toLowerCase();
    if (text.includes('summary') || text.includes('summarize')) {
      return `Here is a summary of "${lessonTitle}": This lesson covers the core principles and syntax required to master the topic. Key takeaways include understanding the architecture, setting up your environment correctly, and following best practices to avoid common pitfalls.`;
    } else if (text.includes('explain') || text.includes('how')) {
      return `I can explain that! In the context of "${lessonTitle}", the mechanism works by breaking down complex operations into smaller, manageable functions. This modular approach ensures that your code is reusable and easier to debug.`;
    } else if (text.includes('error') || text.includes('bug')) {
      return `Errors are a normal part of learning! Make sure to check your syntax and verify that all dependencies are installed. In "${lessonTitle}", a common mistake is forgetting to initialize variables correctly before using them.`;
    } else if (text.includes('quiz') || text.includes('test')) {
      return `Sure, let's test your knowledge! Question: What is the primary purpose of the main concept discussed in "${lessonTitle}"? (Reply with your answer and I'll grade it!)`;
    } else {
      return `That's a great question. While I don't have the exact answer right now, I recommend re-watching the middle section of "${lessonTitle}" where the instructor dives deep into this specific scenario. Do you want me to summarize the lesson instead?`;
    }
  };

  const handleSend = (textToProcess = input) => {
    if (!textToProcess.trim() || isTyping) return;
    
    const userMsg = { 
      id: Date.now().toString(),
      role: 'user', 
      text: textToProcess,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulated AI Processing Delay
    setTimeout(() => {
      const responseText = generateAIResponse(textToProcess);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(),
        role: 'ai', 
        text: responseText,
        timestamp: new Date().toISOString()
      }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-[650px] bg-white dark:bg-[#0F172A] overflow-hidden font-sans border border-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#F1F5F9] dark:border-[#1E293B] bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center shadow-md">
              <Bot className="text-white w-5 h-5" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-2 border-white dark:border-[#0F172A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[#0F172A] dark:text-white font-bold text-sm">AI Learning Assistant</h3>
              <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] dark:bg-[#1E293B] text-[#3B82F6] text-[10px] font-bold uppercase tracking-wider">GPT Mode</span>
            </div>
            <p className="text-xs text-[#64748B] font-medium line-clamp-1">{lessonTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-[#64748B] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] rounded-lg transition-colors" title="Chat History">
            <Clock className="w-4 h-4" />
          </button>
          <button className="p-2 text-[#64748B] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] rounded-lg transition-colors" title="New Conversation">
            <MessageSquarePlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide bg-[#F8FAFC] dark:bg-[#020617] relative">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex flex-col items-center justify-center h-full text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#EFF6FF] dark:bg-[#1E293B] flex items-center justify-center mb-2">
                <Sparkles className="w-8 h-8 text-[#3B82F6]" />
              </div>
              <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">Ask anything about this lesson</h4>
              <p className="text-sm text-[#64748B] max-w-[250px]">Start by selecting one of the suggested prompts below or type your own question.</p>
            </motion.div>
          ) : (
            messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className="shrink-0">
                  {msg.role === 'user' ? (
                    <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center">
                      <User className="text-white w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                      <Bot className="text-white w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <div className={`flex flex-col gap-1 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 text-xs text-[#64748B] px-1">
                    <span className="font-semibold">{msg.role === 'user' ? 'You' : 'AI Assistant'}</span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  
                  <div className={`p-4 text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#0F172A] text-white rounded-2xl rounded-tr-sm' 
                      : 'bg-white dark:bg-[#1E293B] text-[#334155] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-1 mt-1 opacity-0 hover:opacity-100 transition-opacity">
                      <button onClick={() => copyToClipboard(msg.text)} className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white rounded transition-colors" title="Copy">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleSend(messages[messages.length - 2]?.text)} className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white rounded transition-colors" title="Regenerate">
                        <RefreshCcw className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-[#94A3B8] hover:text-[#10B981] rounded transition-colors" title="Helpful">
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] rounded transition-colors" title="Not Helpful">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
              <Bot className="text-white w-4 h-4" />
            </div>
            <TypingIndicator />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts - Horizontal Scroll */}
      <div className="px-4 py-3 bg-white dark:bg-[#0F172A] border-t border-[#F1F5F9] dark:border-[#1E293B]">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => handleSend(prompt.label)}
              disabled={isTyping}
              className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 bg-[#F8FAFC] dark:bg-[#1E293B] hover:bg-[#EFF6FF] dark:hover:bg-[#334155] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#BFDBFE] dark:hover:border-[#475569] text-[#475569] dark:text-[#CBD5E1] hover:text-[#2563EB] dark:hover:text-white text-xs font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{prompt.icon}</span>
              {prompt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-[#0F172A] border-t border-[#F1F5F9] dark:border-[#1E293B]">
        <div className="relative flex items-end gap-2 bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] focus-within:border-[#3B82F6] dark:focus-within:border-[#3B82F6] rounded-xl p-2 transition-colors">
          <button type="button" className="p-2 text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isTyping ? "AI is generating..." : "Ask a question (Shift + Enter for new line)"}
            disabled={isTyping}
            className="w-full max-h-32 min-h-[44px] bg-transparent resize-none outline-none text-[15px] text-[#0F172A] dark:text-white placeholder-[#94A3B8] py-2.5 px-1 disabled:opacity-50"
            rows={1}
            style={{ height: 'auto' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
            }}
          />
          
          <div className="flex items-center gap-1 shrink-0">
            <button type="button" className="p-2 text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors">
              <Mic className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="p-2 bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] rounded-lg hover:bg-[#1E293B] dark:hover:bg-[#F8FAFC] disabled:opacity-50 disabled:hover:bg-[#0F172A] dark:disabled:hover:bg-white transition-all shadow-sm"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] text-[#94A3B8] font-medium">AI can make mistakes. Verify important information.</p>
        </div>
      </div>
    </div>
  );
};

export default AICoPilot;
