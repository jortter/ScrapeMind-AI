import React from 'react';
import { Terminal, CheckCircle2, Loader2, AlertTriangle, Sparkles, Globe, Cpu } from 'lucide-react';
import { AgentExecutionLog } from '../types';

interface AgentExecutionConsoleProps {
  logs: AgentExecutionLog[];
  isScraping: boolean;
  topicTitle: string;
}

export const AgentExecutionConsole: React.FC<AgentExecutionConsoleProps> = ({
  logs,
  isScraping,
  topicTitle,
}) => {
  if (!isScraping && logs.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mb-6">
      
      {/* Console Top Bar */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-slate-200">
            AGENT EXECUTION CONSOLE // {topicTitle}
          </span>
        </div>
        {isScraping && (
          <div className="flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[10px] font-mono font-semibold text-cyan-300 uppercase tracking-wider">
              Scraping Web in Real-Time
            </span>
          </div>
        )}
      </div>

      {/* Log Output Stream */}
      <div className="p-4 font-mono text-xs space-y-2.5 bg-slate-950/90 text-slate-300 max-h-64 overflow-y-auto">
        {logs.map((log) => {
          let icon = <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />;
          let textColor = 'text-slate-300';

          if (log.status === 'completed') {
            icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
            textColor = 'text-emerald-300';
          } else if (log.status === 'failed') {
            icon = <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
            textColor = 'text-rose-300';
          } else if (log.status === 'running') {
            textColor = 'text-cyan-300 font-semibold';
          }

          return (
            <div key={log.id} className="flex items-start space-x-2.5 leading-relaxed">
              <span className="text-slate-500 text-[10px] shrink-0 pt-0.5">{log.timestamp}</span>
              <span className="shrink-0 pt-0.5">{icon}</span>
              <div className="flex-1">
                <span className={`font-semibold ${textColor}`}>{log.stepName}:</span>{' '}
                <span className="text-slate-300">{log.message}</span>
                {log.details && (
                  <p className="text-[11px] text-slate-400 mt-0.5 pl-2 border-l border-slate-800 italic">
                    {log.details}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
