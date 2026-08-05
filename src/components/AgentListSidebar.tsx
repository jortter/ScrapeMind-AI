import React from 'react';
import { Bot, Plus, Trash2, RefreshCw, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { ResearchAgentTask, AppLanguage } from '../types';

interface AgentListSidebarProps {
  agents: ResearchAgentTask[];
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  onOpenNewModal: () => void;
  onDeleteAgent: (id: string) => void;
  isScraping: boolean;
  onRunCurrentScrape: () => void;
  language?: AppLanguage;
}

export const AgentListSidebar: React.FC<AgentListSidebarProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  onOpenNewModal,
  onDeleteAgent,
  isScraping,
  onRunCurrentScrape,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Research Agents ({agents.length})
          </h3>
        </div>
        <button
          onClick={onOpenNewModal}
          className="p-1 rounded-lg bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border border-cyan-500/30 transition-colors"
          title="Create New Agent"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Agents List */}
      <div className="space-y-2">
        {agents.map((agent) => {
          const isSelected = agent.id === selectedAgentId;

          return (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer group flex items-start justify-between ${
                isSelected
                  ? 'bg-slate-800 border-cyan-500/60 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex-1 pr-2">
                <div className="flex items-center space-x-1.5 mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {agent.title}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-1">{agent.userGoals}</p>

                <div className="flex items-center space-x-2 mt-2 text-[10px] text-slate-500">
                  <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {agent.scrapedCount || 0} listings
                  </span>
                  {agent.alertConfig.enabled && (
                    <span className="text-amber-400 font-semibold">• Alerts Active</span>
                  )}
                </div>
              </div>

              {agents.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteAgent(agent.id);
                  }}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Agent"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="pt-2">
        <button
          onClick={onRunCurrentScrape}
          disabled={isScraping}
          className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-2 shadow-md shadow-cyan-600/20 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
          <span>{isScraping ? 'Running AI Scraper...' : 'Execute Agent Search'}</span>
        </button>
      </div>

    </div>
  );
};
