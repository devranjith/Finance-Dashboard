import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, RefreshCw, User, Copy, Check, Zap, TrendingUp, PieChart, DollarSign } from 'lucide-react';
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
    { icon: TrendingUp, label: 'Spending', prompt: 'Analyze my spending patterns this month' },
    { icon: PieChart, label: 'Budget', prompt: 'Give me a breakdown of my budget categories' },
    { icon: DollarSign, label: 'Savings', prompt: 'What are some tips to improve my savings?' },
    { icon: Zap, label: 'Summary', prompt: 'Give me a quick financial summary' },
];

const AI_RESPONSES: Record<string, string> = {
    default: "I'm Violet AI, your intelligent financial assistant. I can help you analyze spending, optimize budgets, and provide smart financial insights. What would you like to know?",
    spending: `📊 **Spending Analysis**\n\nBased on your recent transactions:\n\n• **Housing** — $1,400 (28% of budget) — slightly over\n• **Groceries** — $120 — within budget ✅\n• **Utilities** — $60 — within budget ✅\n• **Entertainment** — $35 — well within budget ✅\n\n💡 **Insight:** Your housing costs are your largest expense. Consider reviewing subscriptions to free up savings.`,
    budget: `💰 **Budget Breakdown**\n\nHere's how your categories stack up:\n\n• Housing — $1,400 / $2,000 — 70%\n• Food & Dining — $500 / $500 — 100%\n• Transportation — $170 / $200 — 85%\n• Entertainment — $35 / $200 — 18%\n\n🎯 Watch your Food & Dining — it hit the limit this month.`,
    savings: `🚀 **Smart Savings Tips**\n\n1. **Automate savings** — Auto-transfer 20% before spending\n2. **Review subscriptions** — Cut unused services\n3. **50/30/20 Rule** — Needs / Wants / Savings\n4. **Emergency fund** — Aim for 3–6 months expenses\n5. **Invest early** — $100/month compounds significantly\n\n💡 Based on your income, save ~$400/month.`,
    summary: `⚡ **Quick Financial Summary**\n\n**Income:** $2,000 + $1,500 Freelance = **$3,500**\n**Expenses:** ~$2,165 total\n**Net Balance:** +**$1,335** this month\n\n📈 Strong freelance income! Housing is 40% of spend. Entertainment is well-controlled.\n\n🎯 Allocate $1,335 surplus — 50% savings, 50% investments.`,
};

function getAIResponse(userMessage: string): string {
    const lower = userMessage.toLowerCase();
    if (lower.includes('spend') || lower.includes('analyz') || lower.includes('pattern')) return AI_RESPONSES.spending;
    if (lower.includes('budget') || lower.includes('breakdown') || lower.includes('categor')) return AI_RESPONSES.budget;
    if (lower.includes('sav') || lower.includes('tip') || lower.includes('improv')) return AI_RESPONSES.savings;
    if (lower.includes('summar') || lower.includes('quick') || lower.includes('overview')) return AI_RESPONSES.summary;
    return `Thanks for your message! I'm analyzing your data...\n\nTry asking about:\n• Spending analysis\n• Budget breakdown\n• Savings tips\n• Quick summary`;
}

function formatMessage(content: string) {
    return content.split('\n').map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
            return <p key={i} className="font-bold text-white">{line.replace(/\*\*/g, '')}</p>;
        }
        if (line.startsWith('• ') || line.match(/^\d+\. /)) {
            return <li key={i} className="ml-3 list-disc text-[#D4D4D8] marker:text-purple-400">{line.replace(/^[•\d]+\.?\s/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>;
        }
        if (line.startsWith('#')) return null;
        if (line.trim() === '') return <br key={i} />;
        return <p key={i} className="text-[#D4D4D8]">{line}</p>;
    });
}

export function VioletAI() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '0', role: 'assistant', content: AI_RESPONSES.default, timestamp: new Date() },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const endRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { transactions } = useFinanceStore();

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim(), timestamp: new Date() };
        setMessages(p => [...p, userMsg]);
        setInput('');
        setIsTyping(true);
        inputRef.current?.blur(); // dismiss mobile keyboard after send

        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: getAIResponse(text),
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
        setMessages([{ id: '0', role: 'assistant', content: AI_RESPONSES.default, timestamp: new Date() }]);
    };

    const stats = [
        { label: 'Transactions', value: transactions.length.toString(), icon: TrendingUp, color: '#a855f7' },
        { label: 'Income Sources', value: transactions.filter(t => t.type === 'income').length.toString(), icon: DollarSign, color: '#22c55e' },
        { label: 'Expense Categories', value: [...new Set(transactions.filter(t => t.type === 'expense').map(t => t.category))].length.toString(), icon: PieChart, color: '#3b82f6' },
    ];

    return (
        /* Full height minus mobile topbar (pt-20 on mobile handled by DashboardLayout) */
        <div className="flex flex-col gap-3 h-[calc(100svh-160px)] sm:h-[calc(100vh-200px)] md:h-[calc(100vh-220px)] max-h-[860px]">

            {/* ── Stats bar ── */}
            {/* <div className="grid grid-cols-3 gap-2 sm:gap-4 flex-shrink-0">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#27272A] rounded-xl p-3 sm:p-4 border border-[#3f3f46]/50 flex items-center gap-2 sm:gap-3"
          >
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <stat.icon size={16} style={{ color: stat.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-white leading-none">{stat.value}</p>

              <p className="text-[10px] sm:text-xs text-[#A1A1AA] mt-0.5 leading-tight line-clamp-2">{stat.label}</p>
            </div>
          </div >
        ))
        }
      </div > */}

            {/* ── Chat container ── */}
            <div className="flex-1 bg-[#27272A] rounded-xl border border-[#3f3f46]/50 flex flex-col overflow-hidden min-h-0">

                {/* Chat header */}
                <div className="flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 border-b border-[#3f3f46]/50 flex-shrink-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">Violet AI</h3>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[10px] sm:text-[11px] text-[#A1A1AA]">
                                    Online
                                    <span className="hidden sm:inline"> · Financial Intelligence</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetChat}
                        className="text-[#A1A1AA] hover:text-white h-8 px-2 text-xs gap-1.5 flex-shrink-0"
                    >
                        <RefreshCw size={13} />
                        <span className="hidden sm:inline">Reset</span>
                    </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4 thin-scroll min-h-0">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
                                        <Sparkles size={12} className="text-white" />
                                    </div>
                                )}

                                <div className={`max-w-[85%] sm:max-w-[80%] group ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                                    <div
                                        className={`rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm leading-relaxed ${msg.role === 'user'
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
                                                className="opacity-0 group-hover:opacity-100 sm:transition-opacity text-[#52525b] hover:text-[#A1A1AA] active:opacity-100"
                                            >
                                                {copiedId === msg.id ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {msg.role === 'user' && (
                                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#3f3f46] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <User size={12} className="text-[#A1A1AA]" />
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
                                className="flex gap-2 sm:gap-3 items-start"
                            >
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                                    <Sparkles size={12} className="text-white" />
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

                {/* Suggestion chips */}
                <div className="px-3 sm:px-5 py-2 sm:py-3 border-t border-[#3f3f46]/30 flex-shrink-0">
                    <div className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
                        {SUGGESTED_PROMPTS.map((s) => (
                            <button
                                key={s.label}
                                onClick={() => sendMessage(s.prompt)}
                                className="flex-shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs bg-[#1c1c1f] border border-[#3f3f46]/60 text-[#A1A1AA] hover:text-white hover:border-purple-500/40 active:scale-95 transition-all"
                            >
                                <s.icon size={10} className="text-purple-400" />
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input */}
                <div className="px-3 sm:px-5 pb-3 sm:pb-4 pt-2 flex-shrink-0">
                    <form
                        onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                        className="flex gap-2 items-center bg-[#1c1c1f] border border-[#3f3f46] rounded-xl px-3 sm:px-4 py-2 focus-within:border-purple-500/50 transition-colors"
                    >
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your finances..."
                            className="flex-1 bg-transparent text-sm text-white placeholder:text-[#52525b] outline-none min-w-0"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="w-8 h-8 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95 flex-shrink-0"
                        >
                            <Send size={14} className="text-white" />
                        </button>
                    </form>
                    <p className="text-[10px] text-[#52525b] mt-1.5 text-center hidden sm:block">
                        Violet AI analyzes your connected transactions for personalized insights
                    </p>
                </div>
            </div>
        </div >
    );
}
