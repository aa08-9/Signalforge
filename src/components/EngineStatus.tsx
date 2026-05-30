import React from 'react';

export default function EngineStatus() {
  return (
    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
      <h3 className="text-lg font-bold text-white mb-1 flex items-center space-x-2">
        <span className="h-2 w-2 bg-indigo-500 rounded-full animate-ping"></span>
        <span>Autonomous Engine Health</span>
      </h3>
      <div className="space-y-4 mt-4">
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/60">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-400 uppercase tracking-wide">Pattern Engine</span>
            <span className="text-emerald-400 font-mono">ACTIVE</span>
          </div>
        </div>
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/60">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-400 uppercase tracking-wide">SEO Optimizer</span>
            <span className="text-emerald-400 font-mono">READY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
