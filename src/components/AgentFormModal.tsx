import React, { useState } from 'react';
import { X, Bot, Sparkles, Sliders, Bell, Globe, CheckCircle2, DollarSign, MapPin, Tag } from 'lucide-react';
import { ResearchAgentTask, SearchParams, AlertConfig, AppLanguage, AppCurrency } from '../types';

interface AgentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (agentData: Partial<ResearchAgentTask>) => void;
  initialData?: ResearchAgentTask | null;
  language?: AppLanguage;
  currency?: AppCurrency;
}

const PRESETS = [
  {
    id: 'used_cars',
    title: 'Used Vehicles / Cars',
    icon: '🚗',
    topicCategory: 'used_cars' as const,
    defaultTitle: 'Used SUVs under $20,000 (Chicago area)',
    goals: 'Find reliable second-hand SUVs (Toyota RAV4, Honda CR-V, Mazda CX-5) under $20,000 with low mileage (<65k miles) and clean title.',
    minPrice: 10000,
    maxPrice: 20000,
    location: 'Chicago, IL',
    keywords: 'RAV4 CR-V CX-5 clean title low miles',
    excludeKeywords: 'salvage flood rebuilt parts accident',
    platforms: ['CarGurus', 'Autotrader', 'Facebook Marketplace', 'Cars.com'],
    minYear: 2018,
    maxMileage: 65000,
    alertPrice: 18500
  },
  {
    id: 'electronics',
    title: 'Laptops & Refurbished Tech',
    icon: '💻',
    topicCategory: 'electronics' as const,
    defaultTitle: 'MacBook Pro 14" M2/M3 Refurbished Deals',
    goals: 'Monitor certified refurbished or open-box 14-inch MacBook Pro laptops with 16GB/18GB RAM under $1,350 across major outlets.',
    minPrice: 900,
    maxPrice: 1350,
    location: 'Online Stores',
    keywords: 'MacBook Pro 14 M2 Pro M3 16GB 18GB RAM',
    excludeKeywords: 'cracked screen icloud locked water damage 8gb',
    platforms: ['Apple Refurbished', 'eBay Refurbished', 'B&H Photo', 'Micro Center'],
    alertPrice: 1200
  },
  {
    id: 'real_estate',
    title: 'Housing & Rentals',
    icon: '🏠',
    topicCategory: 'real_estate' as const,
    defaultTitle: '2-Bedroom Apartments under $2,400/mo',
    goals: 'Scrape 2-bedroom rental apartments in safe neighborhoods with in-unit laundry and parking under $2,400/month.',
    minPrice: 1600,
    maxPrice: 2400,
    location: 'Austin, TX',
    keywords: '2 bedroom in-unit laundry parking pet friendly',
    excludeKeywords: 'roommate sublet lease takeover shared room',
    platforms: ['Zillow', 'Trulia', 'Apartments.com', 'Craigslist'],
    alertPrice: 2200
  },
  {
    id: 'competitor_intel',
    title: 'Competitor SaaS & Pricing',
    icon: '📊',
    topicCategory: 'competitor_intel' as const,
    defaultTitle: 'AI Developer Tool Pricing & Features Matrix',
    goals: 'Track competitor pricing tiers, enterprise seats, free tier limits, and feature breakdowns across developer AI platforms.',
    minPrice: 0,
    maxPrice: 500,
    location: 'Global Online',
    keywords: 'SaaS developer platform pricing plans seats enterprise API limits',
    excludeKeywords: 'outdated 2021 2022',
    platforms: ['Company Websites', 'G2', 'ProductHunt', 'TechCrunch'],
    alertPrice: 100
  }
];

export const AgentFormModal: React.FC<AgentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(initialData?.title || '');
  const [topicCategory, setTopicCategory] = useState<ResearchAgentTask['topicCategory']>(
    initialData?.topicCategory || 'used_cars'
  );
  const [userGoals, setUserGoals] = useState(initialData?.userGoals || '');
  
  // Search Params
  const [minPrice, setMinPrice] = useState<number | undefined>(initialData?.searchParams?.minPrice);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialData?.searchParams?.maxPrice);
  const [location, setLocation] = useState(initialData?.searchParams?.location || '');
  const [keywords, setKeywords] = useState(initialData?.searchParams?.keywords || '');
  const [excludeKeywords, setExcludeKeywords] = useState(initialData?.searchParams?.excludeKeywords || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    initialData?.searchParams?.targetPlatforms || ['CarGurus', 'Autotrader', 'Facebook Marketplace', 'eBay']
  );
  const [minYear, setMinYear] = useState<number | undefined>(initialData?.searchParams?.minYear);
  const [maxMileage, setMaxMileage] = useState<number | undefined>(initialData?.searchParams?.maxMileage);

  // Alert Config
  const [alertEnabled, setAlertEnabled] = useState(initialData?.alertConfig?.enabled ?? true);
  const [maxPriceThreshold, setMaxPriceThreshold] = useState<number | undefined>(
    initialData?.alertConfig?.maxPriceThreshold
  );
  const [minDealGrade, setMinDealGrade] = useState<'A+' | 'A' | 'B' | 'C'>(
    (initialData?.alertConfig?.minDealGrade as any) || 'A'
  );
  const [notifyFrequency, setNotifyFrequency] = useState<'instant' | 'hourly' | 'daily'>(
    initialData?.alertConfig?.notifyFrequency || 'instant'
  );

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setTitle(preset.defaultTitle);
    setTopicCategory(preset.topicCategory);
    setUserGoals(preset.goals);
    setMinPrice(preset.minPrice);
    setMaxPrice(preset.maxPrice);
    setLocation(preset.location);
    setKeywords(preset.keywords);
    setExcludeKeywords(preset.excludeKeywords);
    setSelectedPlatforms(preset.platforms);
    setMinYear(preset.minYear);
    setMaxMileage(preset.maxMileage);
    setMaxPriceThreshold(preset.alertPrice);
  };

  const togglePlatform = (p: string) => {
    if (selectedPlatforms.includes(p)) {
      setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !userGoals.trim()) return;

    const agentData: Partial<ResearchAgentTask> = {
      title: title.trim(),
      topicCategory,
      userGoals: userGoals.trim(),
      searchParams: {
        minPrice,
        maxPrice,
        location: location.trim(),
        targetPlatforms: selectedPlatforms,
        keywords: keywords.trim(),
        excludeKeywords: excludeKeywords.trim(),
        minYear,
        maxMileage,
        sortBy: 'deal_grade',
      },
      alertConfig: {
        enabled: alertEnabled,
        maxPriceThreshold,
        minDealGrade,
        notifyFrequency,
        notifyMethod: 'in_app',
      },
      status: 'idle',
      scrapedCount: initialData?.scrapedCount || 0,
    };

    onSubmit(agentData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl text-slate-100 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialData ? 'Edit AI Scraper Agent' : 'Create New AI Scraper Research Agent'}
              </h2>
              <p className="text-xs text-slate-400">
                Define target goals, parameters, and automated alert triggers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Presets Quick Picker */}
          {!initialData && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Start with a Template Preset</span>
                </label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="flex flex-col items-start p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/50 text-left transition-all group"
                  >
                    <span className="text-xl mb-1">{p.icon}</span>
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                      {p.title}
                    </span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">
                      {p.defaultTitle}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Core Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Research Agent Name *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Used Toyota RAV4 & Honda CR-V (Under $20k)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                User Objectives & Detailed Instructions *
              </label>
              <textarea
                required
                rows={3}
                value={userGoals}
                onChange={(e) => setUserGoals(e.target.value)}
                placeholder="Describe what you want the AI agent to look for, specific preferences, clean history requirements, feature priorities, or specific seller conditions..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Search Parameters Grid */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Specific Search Parameters & Filters</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Min & Max Price */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Price Range ($ USD)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={minPrice || ''}
                    onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Min ($)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <span className="text-slate-500 text-xs">to</span>
                  <input
                    type="number"
                    value={maxPrice || ''}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Max ($)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Location / Region
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Chicago, IL or Nationwide Online"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Mandatory Search Keywords
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., AWD clean title low miles 16GB"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Exclude terms */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Exclude Keywords / Negative terms
                </label>
                <input
                  type="text"
                  value={excludeKeywords}
                  onChange={(e) => setExcludeKeywords(e.target.value)}
                  placeholder="e.g., salvage flood rebuilt parts accident"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Vehicle specific: Min Year & Max Mileage */}
              {topicCategory === 'used_cars' && (
                <>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Min Year
                    </label>
                    <input
                      type="number"
                      value={minYear || ''}
                      onChange={(e) => setMinYear(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="e.g., 2018"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Max Mileage
                    </label>
                    <input
                      type="number"
                      value={maxMileage || ''}
                      onChange={(e) => setMaxMileage(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="e.g., 65000"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </>
              )}

            </div>

            {/* Target Platforms */}
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1.5">
                Target Marketplaces / Search Sources
              </label>
              <div className="flex flex-wrap gap-2">
                {['CarGurus', 'Autotrader', 'Facebook Marketplace', 'Craigslist', 'eBay Refurbished', 'B&H Photo', 'Amazon', 'Zillow'].map((p) => {
                  const active = selectedPlatforms.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center space-x-1 ${
                        active
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {active && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                      <span>{p}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Automated Alert Rules */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Bell className="w-3.5 h-3.5" />
                <span>Automated Alert Trigger Configuration</span>
              </h3>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertEnabled}
                  onChange={(e) => setAlertEnabled(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-xs text-slate-300 font-medium">Enable Alerts</span>
              </label>
            </div>

            {alertEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Alert if Price &le; ($)
                  </label>
                  <input
                    type="number"
                    value={maxPriceThreshold || ''}
                    onChange={(e) => setMaxPriceThreshold(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 19000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Min Deal Grade Requirement
                  </label>
                  <select
                    value={minDealGrade}
                    onChange={(e) => setMinDealGrade(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="A+">Grade A+ (Top Exceptional Value)</option>
                    <option value="A">Grade A or higher</option>
                    <option value="B">Grade B or higher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Check Frequency
                  </label>
                  <select
                    value={notifyFrequency}
                    onChange={(e) => setNotifyFrequency(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="instant">Instant Real-time Alerts</option>
                    <option value="hourly">Hourly Digest</option>
                    <option value="daily">Daily Summary</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-lg shadow-cyan-600/30 flex items-center space-x-1.5"
            >
              <Bot className="w-4 h-4" />
              <span>{initialData ? 'Update Agent Task' : 'Launch Research Agent'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
