import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#09090b] text-foreground z-50">
      <div className="flex flex-col items-center space-y-6 p-8 rounded-2xl bg-[#18181b]/80 border border-zinc-800 shadow-2xl backdrop-blur-md">
        {/* Cute pulsing brain icon container */}
        <div className="relative">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center relative overflow-hidden shadow-lg shadow-primary/30">
            {/* SVG Brain Icon */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-10 h-10 text-primary-foreground z-10 animate-pulse"
            >
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2Z" />
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2Z" />
            </svg>
            <div className="absolute inset-1 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin [animation-duration:1.5s]" />
          </div>
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping [animation-duration:2.5s]" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            SPY AI
          </h3>
          <p className="text-sm text-zinc-400">
            Preparing your career coach experience...
          </p>
        </div>
      </div>
    </div>
  );
}
