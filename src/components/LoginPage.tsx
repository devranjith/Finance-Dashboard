import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { PieChart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function LoginPage() {
  const { signInWithGoogle } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#18181A] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#27272A]/80 backdrop-blur-xl border border-[#3f3f46] rounded-3xl p-10 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-500 flex items-center justify-center border border-purple-500/30">
              <PieChart size={32} />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-[#A1A1AA]">Sign in to your Finance Dashboard to manage your wealth and tasks.</p>
          </div>

          <Button 
            onClick={signInWithGoogle}
            className="w-full bg-white hover:bg-gray-100 text-black font-semibold h-12 text-base flex items-center justify-center gap-3 rounded-xl transition-all hover:scale-[1.02]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </Button>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#A1A1AA]">
            <Sparkles size={14} className="text-purple-400" />
            Secured by Zorvyn AI
          </div>
        </div>
      </motion.div>
    </div>
  );
}
