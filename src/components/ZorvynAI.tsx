import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, RefreshCw, User, Copy, Check, ChevronRight, Zap, TrendingUp, PieChart, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useFinanceStore } from '@/store/useFinanceStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  { icon: TrendingUp, label: 'Spending analysis', prompt: 'Analyze my spending patterns this month' },
  { icon: PieChart, label: 'Budget breakdown', prompt: 'Give me a breakdown of my budget categories' },
  { icon: DollarSign, label: 'Savings tips', prompt: 'What are some tips to improve my savings?' },
  { icon: Zap, label: 'Quick summary', prompt: 'Give me a quick financial summary' },
];

const AI_RESPONSES: Record<string, string> = {
  default: "I'm Zorvyn AI, your intelligent financial assistant. I can help you analyze spending, optimize budgets, and provide smart financial insights. What would you like to know?",
  spending: `📊 **Spending Analysis**\n\nBased on your recent transactions, here's your breakdown:\n\n• **Housing** — $1,400 (28% of budget) — slightly over target\n• **Groceries** — $120 — within budget ✅\n• **Utilities** — $60 — within budget ✅\n• **Entertainment** — $35 — well within budget ✅\n\n💡 **Insight:** Your housing costs are your largest expense. Consider reviewing subscription services to free up more for savings.`,
  budget: `💰 **Budget Category Breakdown**\n\nHere's how your categories stack up:\n\n| Category | Spent | Budget | Status |\n|---|---|---|---|\n| Housing | $1,400 | $2,000 | 70% |\n| Food & Dining | $500 | $500 | 100% |\n| Transportation | $170 | $200 | 85% |\n| Entertainment | $35 | $200 | 18% |\n\n🎯 You're on track in most areas! Watch your Food & Dining — it hit the limit this month.`,
  savings: `🚀 **Smart Savings Tips for You**\n\n1. **Automate savings** — Set up an auto-transfer of 20% every paycheck before spending\n2. **Review subscriptions** — You may have unused subscriptions eating your budget\n3. **50/30/20 Rule** — 50% needs, 30% wants, 20% savings\n4. **Emergency fund first** — Aim for 3–6 months of expenses ($4,500–$9,000)\n5. **Invest early** — Even $100/month in an index fund can grow significantly over time\n\n💡 Based on your income of $2,000, you should be saving ~$400/month.`,
  summary: `⚡ **Quick Financial Summary**\n\n**Income:** $2,000 (+$1,500 Freelance) = **$3,500 total**\n**Expenses:** ~$2,165 across all categories\n**Net Balance:** +**$1,335** this month\n\n📈 **Highlights:**\n• Strong freelance income this month\n• Housing is your biggest spend (40%)\n• Entertainment well under budget — great discipline!\n\n🎯 **Recommendation:** You're doing well! Consider allocating that $1,335 surplus — 50% to savings, 50% to investments.`,
};

function getAIResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes('spend') || lower.includes('analyz') || lower.includes('pattern')) {
    return AI_RESPONSES.spending;
  }
  if (lower.includes('budget') || lower.includes('breakdown') || lower.includes('categor')) {
    return AI_RESPONSES.budget;
  }
  if (lower.includes('sav') || lower.includes('tip') || lower.includes('improv')) {
    return AI_RESPONSES.savings;
  }
  if (lower.includes('summar') || lower.includes('quick') || lower.includes('overview')) {
    return AI_RESPONSES.summary;
  }
  return `Thanks for your message! I'm analyzing your financial data...\n\nBased on your transactions, I see you have a healthy mix of income and expenses. To give you more specific insights, try asking about:\n- Spending analysis\n- Budget breakdown\n- Savings tips\n- A quick financial summary`;
}

function formatMessage(content: string) {
  // Simple markdown-like renderer
  return content.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="font-bold text-white">{line.replace(/\*\*/g, '')}</p>;
    }
    if (line.startsWith('• ')) {
      return <li key={i} className="ml-4 list-disc text-[#D4D4D8]">{line.slice(2).replace(/\*\*(.*?)\*\*/g, (_, m) => `${m}`)}</li>;
    }
    if (line.startsWith('#')) {
      return null;
    }
    if (line.trim() === '') return <br key={i} />;
    return <p key={i} className="text-[#D4D4D8]">{line}</p>;
  });
}

export function ZorvynAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: AI_RESPONSES.default,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const { transactions } = useFinanceStore();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setIsTyping(false);
      setMessages(p => [...p, aiMsg]);
    }, 1200 + Math.random() * 800);
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetChat = () => {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: AI_RESPONSES.default,
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] max-h-[780px]">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { label: 'Total Transactions', value: transactions.length.toString(), icon: TrendingUp, color: '#a855f7' },
          { label: 'Income Sources', value: transactions.filter(t => t.type === 'income').length.toString(), icon: DollarSign, color: '#22c55e' },
          { label: 'Expense Categories', value: [...new Set(transactions.filter(t => t.type === 'expense').map(t => t.category))].length.toString(), icon: PieChart, color: '#3b82f6' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#27272A] rounded-xl p-4 border border-[#3f3f46]/50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
              <stat.icon size={18} style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-[#A1A1AA]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-[#27272A] rounded-xl border border-[#3f3f46]/50 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#3f3f46]/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Zorvyn AI</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] text-[#A1A1AA]">Online · Financial Intelligence</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetChat}
            className="text-[#A1A1AA] hover:text-white h-8 px-2 text-xs gap-1.5"
          >
            <RefreshCw size={13} />
            Reset
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 thin-scroll">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
                    <Sparkles size={13} className="text-white" />
                  </div>
                )}

                <div className={`max-w-[80%] group ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white rounded-tr-sm'
                        : 'bg-[#1c1c1f] border border-[#3f3f46]/50 text-[#D4D4D8] rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="space-y-1">{formatMessage(msg.content)}</div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>

                  <div className={`flex items-center gap-2 mt-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[10px] text-[#52525b]">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => copyMessage(msg.id, msg.content)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#52525b] hover:text-[#A1A1AA]"
                      >
                        {copiedId === msg.id ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                      </button>
                    )}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-[#3f3f46] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User size={13} className="text-[#A1A1AA]" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3 items-start"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={13} className="text-white" />
                </div>
                <div className="bg-[#1c1c1f] border border-[#3f3f46]/50 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center h-4">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-purple-400"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        <div className="px-5 py-3 border-t border-[#3f3f46]/30">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {SUGGESTED_PROMPTS.map((s) => (
              <button
                key={s.label}
                onClick={() => sendMessage(s.prompt)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-[#1c1c1f] border border-[#3f3f46]/60 text-[#A1A1AA] hover:text-white hover:border-purple-500/40 transition-all"
              >
                <s.icon size={11} className="text-purple-400" />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-5 pb-4 pt-2">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="flex gap-2 items-center bg-[#1c1c1f] border border-[#3f3f46] rounded-xl px-4 py-2 focus-within:border-purple-500/50 transition-colors"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Zorvyn AI anything about your finances..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[#52525b] outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-8 h-8 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95"
            >
              <Send size={14} className="text-white" />
            </button>
          </form>
          <p className="text-[10px] text-[#52525b] mt-2 text-center">
            Zorvyn AI analyzes your connected transactions for personalized insights
          </p>
        </div>
      </div>
    </div>
  );
}
