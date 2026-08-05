import React from 'react';
import { Bot, Bell, Plus, Sparkles, RefreshCw, Globe, DollarSign, MapPin } from 'lucide-react';
import { ResearchAgentTask, TriggeredAlert, AppLanguage, AppCurrency } from '../types';
import { DICTIONARY } from '../utils/i18n';

interface NavbarProps {
  agents: ResearchAgentTask[];
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  onOpenNewModal: () => void;
  onOpenPresetModal: () => void;
  alerts: TriggeredAlert[];
  onOpenAlertsModal: () => void;
  isScrapingActive: boolean;
  onRunCurrentScrape: () => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  currency: AppCurrency;
  onCurrencyChange: (curr: AppCurrency) => void;
  locationFilter: string;
  onLocationChange: (loc: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  onOpenNewModal,
  onOpenPresetModal,
  alerts,
  onOpenAlertsModal,
  isScrapingActive,
  onRunCurrentScrape,
  language,
  onLanguageChange,
  currency,
  onCurrencyChange,
  locationFilter,
  onLocationChange,
}) => {
  const unreadAlerts = alerts.filter((a) => !a.read).length;
  const currentAgent = agents.find((a) => a.id === selectedAgentId);
  const t = DICTIONARY[language];

  return (
    <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-cyan-500 to-emerald-500 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[15px] flex items-center justify-center text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-mono">ScrapeMind</span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  AGENT ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden xl:block font-sans">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Active Agent Selector */}
          <div className="flex-1 max-w-sm mx-2 hidden lg:block">
            <select
              value={selectedAgentId}
              onChange={(e) => onSelectAgent(e.target.value)}
              className="w-full bg-slate-900/90 text-slate-200 border border-slate-800 rounded-xl py-1.5 pl-3 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium text-ellipsis overflow-hidden"
            >
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  🤖 {agent.title} ({agent.scrapedCount || 0} {language === 'es' ? 'anuncios' : 'listings'})
                </option>
              ))}
            </select>
          </div>

          {/* Controls: Location, Language, Currency, Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            
            {/* Location Selector */}
            <div className="relative hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-xs">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 mr-1 shrink-0" />
              <select
                value={locationFilter}
                onChange={(e) => onLocationChange(e.target.value)}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
                title={t.location}
              >
                <option value="España">🇪🇸 España</option>
                <option value="Madrid">🇪🇸 Madrid</option>
                <option value="Barcelona">🇪🇸 Barcelona</option>
                <option value="Valencia">🇪🇸 Valencia</option>
                <option value="Europa">🇪🇺 Europa / All EU</option>
                <option value="Alemania">🇩🇪 Alemania</option>
                <option value="Francia">🇫🇷 Francia</option>
                <option value="Italia">🇮🇹 Italia</option>
                <option value="UK">🇬🇧 Reino Unido</option>
              </select>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs">
              <button
                onClick={() => onLanguageChange('es')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  language === 'es'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Español"
              >
                🇪🇸 ES
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  language === 'en'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="English"
              >
                🇬🇧 EN
              </button>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs">
              <button
                onClick={() => onCurrencyChange('EUR')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  currency === 'EUR'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Euros (€)"
              >
                € EUR
              </button>
              <button
                onClick={() => onCurrencyChange('USD')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  currency === 'USD'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="US Dollars ($)"
              >
                $ USD
              </button>
            </div>

            {/* Run Current Scrape Button */}
            {currentAgent && (
              <button
                onClick={onRunCurrentScrape}
                disabled={isScrapingActive}
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors disabled:opacity-50"
                title={t.runScraper}
              >
                <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isScrapingActive ? 'animate-spin' : ''}`} />
                <span>{isScrapingActive ? t.scrapingWeb : t.runScraper}</span>
              </button>
            )}

            {/* Presets Button */}
            <button
              onClick={onOpenPresetModal}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.templates}</span>
            </button>

            {/* Alerts Bell */}
            <button
              onClick={onOpenAlertsModal}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              title={t.alerts}
            >
              <Bell className="w-4 h-4 text-slate-300" />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadAlerts}
                </span>
              )}
            </button>

            {/* Create New Agent */}
            <button
              onClick={onOpenNewModal}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white transition-all shadow-md shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t.newAgent}</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

