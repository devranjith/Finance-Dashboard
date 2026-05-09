import React from 'react';
import { Newspaper, ExternalLink, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_NEWS = [
  {
    id: '1',
    headline: 'Tech Stocks Rally as AI Innovations Drive Market Growth',
    source: 'Financial Times',
    time: '2 hours ago',
    url: '#',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400',
    summary: 'Major technology companies saw significant gains today as new artificial intelligence products were announced, pushing the NASDAQ to record highs.'
  },
  {
    id: '2',
    headline: 'Federal Reserve Hints at Possible Rate Cuts Later This Year',
    source: 'Wall Street Journal',
    time: '4 hours ago',
    url: '#',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=400',
    summary: 'In a recent press conference, the Fed chair suggested that if inflation continues to cool, we might see interest rate cuts by Q3.'
  },
  {
    id: '3',
    headline: 'Understanding Index Funds: A Beginner\'s Guide to Passive Investing',
    source: 'Investopedia',
    time: '1 day ago',
    url: '#',
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80&w=400',
    summary: 'Index funds offer a low-cost, diversified way to invest in the stock market. Learn why Warren Buffett recommends them for most retail investors.'
  }
];

export function StockNewsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-blue-400" />
            Market Insights & Education
          </h1>
          <p className="text-[#A1A1AA] mt-1">Develop your financial knowledge with the latest updates.</p>
        </div>
        <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
          <TrendingUp className="w-4 h-4" /> Market Open
        </div>
      </div>

      <div className="grid gap-6">
        {MOCK_NEWS.map((news, index) => (
          <motion.a
            href={news.url}
            key={news.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex flex-col md:flex-row gap-6 bg-[#27272A] border border-[#3f3f46] hover:border-blue-500/30 rounded-2xl p-4 transition-all hover:bg-[#27272A]/80"
          >
            <div className="w-full md:w-64 h-40 shrink-0 rounded-xl overflow-hidden relative">
              <img src={news.image} alt={news.headline} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-black/50 backdrop-blur-md px-2 py-1 rounded-md">
                {news.source}
              </span>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-xs text-[#A1A1AA] mb-2">{news.time}</div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {news.headline}
              </h3>
              <p className="text-[#A1A1AA] text-sm leading-relaxed mb-4 line-clamp-2">
                {news.summary}
              </p>
              <div className="mt-auto flex items-center text-sm font-medium text-blue-400 group-hover:text-blue-300">
                Read full article <ExternalLink className="w-4 h-4 ml-1.5" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
      
      <div className="text-center mt-10">
        <p className="text-[#A1A1AA] text-sm">
          Want live news? We can connect this to a real API (like Finnhub or AlphaVantage) in the next iteration!
        </p>
      </div>
    </div>
  );
}
