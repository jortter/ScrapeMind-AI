import React from 'react';
import { Sparkles, TrendingDown, Award, ExternalLink, CheckCircle2, Layers, BarChart3, Coins, MapPin } from 'lucide-react';
import { ResearchAgentTask, ScrapedListingItem, AppLanguage, AppCurrency } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DICTIONARY, formatPrice } from '../utils/i18n';

interface DashboardOverviewProps {
  agent: ResearchAgentTask;
  onSelectListing: (listing: ScrapedListingItem) => void;
  onRunScrape: () => void;
  isScraping: boolean;
  language: AppLanguage;
  currency: AppCurrency;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  agent,
  onSelectListing,
  onRunScrape,
  isScraping,
  language,
  currency,
}) => {
  const summary = agent.summary;
  const listings = agent.listings || [];
  const t = DICTIONARY[language];

  const topPick = listings.reduce((best, curr) => {
    if (!best) return curr;
    if (curr.dealGrade === 'A+' && best.dealGrade !== 'A+') return curr;
    if (curr.price < best.price) return curr;
    return best;
  }, listings[0] as ScrapedListingItem | undefined);

  const avgPrice = summary?.averagePrice || (listings.length ? Math.round(listings.reduce((acc, i) => acc + i.price, 0) / listings.length) : 0);
  const lowestPrice = summary?.lowestPrice || (listings.length ? Math.min(...listings.map((i) => i.price)) : 0);
  const highestPrice = summary?.highestPrice || (listings.length ? Math.max(...listings.map((i) => i.price)) : 0);
  const maxSavings = avgPrice > lowestPrice ? avgPrice - lowestPrice : 0;

  const chartData = summary?.priceBuckets || [
    { range: '< 15.000€', count: 2 },
    { range: '15.000€ - 20.000€', count: 5 },
    { range: '20.000€ - 25.000€', count: 3 },
    { range: '25.000€+', count: 1 },
  ];

  return (
    <div className="space-y-5">
      
      {/* Bento Row 1: Top Key Stats Grid (4 Bento Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Offers Scraped */}
        <div className="bg-slate-900/90 border border-slate-800/90 p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-black/20 hover:border-slate-700/80 transition-all">
          <div>
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              {t.totalListings}
            </p>
            <p className="text-2xl font-extrabold text-white font-mono mt-1">
              {listings.length} <span className="text-xs font-sans text-slate-400 font-normal">{language === 'es' ? 'anuncios' : 'listings'}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Avg Market Price */}
        <div className="bg-slate-900/90 border border-slate-800/90 p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-black/20 hover:border-slate-700/80 transition-all">
          <div>
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              {t.averagePrice}
            </p>
            <p className="text-2xl font-extrabold text-slate-100 font-mono mt-1">
              {formatPrice(avgPrice, currency)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        {/* Lowest Price Found */}
        <div className="bg-slate-900/90 border border-slate-800/90 p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-black/20 hover:border-slate-700/80 transition-all">
          <div>
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              {t.lowestPrice}
            </p>
            <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
              {formatPrice(lowestPrice, currency)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        {/* Max Potential Savings */}
        <div className="bg-slate-900/90 border border-slate-800/90 p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-black/20 hover:border-slate-700/80 transition-all">
          <div>
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              {language === 'es' ? 'Ahorro Máximo Chollo' : 'Max Deal Savings'}
            </p>
            <p className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
              {formatPrice(maxSavings, currency)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Bento Row 2: AI Executive Summary & Top Pick Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* AI Market Executive Summary (2 columns) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800/90 p-5 sm:p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px]">
                <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">
                  {language === 'es' ? 'Resumen Ejecutivo de Mercado IA' : 'AI Market Intelligence Summary'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {language === 'es' ? 'Análisis web grounded en tiempo real en España y Europa' : 'Synthesized grounded web research in Europe'}
                </p>
              </div>
            </div>
            
            <button
              onClick={onRunScrape}
              disabled={isScraping}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium underline flex items-center space-x-1"
            >
              <span>{isScraping ? t.scrapingWeb : (language === 'es' ? 'Re-ejecutar Scraper' : 'Re-run Scraper')}</span>
            </button>
          </div>

          {/* Executive Summary Text */}
          <div className="text-slate-200 text-sm leading-relaxed space-y-2">
            <p>{summary?.executiveSummary || (language === 'es' ? 'No se ha generado ningún resumen. Haz clic en "Ejecutar Scraper" para iniciar el rastreo web en vivo.' : 'No summary generated yet. Click "Run Scraper" to start.')}</p>
          </div>

          {/* Market Insights Bullet List */}
          {summary?.marketInsights && summary.marketInsights.length > 0 && (
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <h4 className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.marketInsights}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {summary.marketInsights.map((insight, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendation */}
          {summary?.recommendation && (
            <div className="bg-emerald-950/30 border border-emerald-800/50 p-3.5 rounded-xl text-xs text-emerald-200">
              <span className="font-bold text-emerald-300">💡 {t.topRecommendation}: </span>
              {summary.recommendation}
            </div>
          )}

          {/* Search Grounding Citations */}
          {summary?.citations && summary.citations.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80">
              <p className="text-[11px] font-mono font-semibold text-slate-400 mb-2">{t.citationsAndSources}:</p>
              <div className="flex flex-wrap gap-2">
                {summary.citations.map((cite, idx) => (
                  <a
                    key={idx}
                    href={cite.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-[11px] text-cyan-300 border border-slate-700/80 transition-colors"
                  >
                    <span className="truncate max-w-[200px]">{cite.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Top Pick Spotlight Card (1 column) */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/90 p-5 rounded-2xl flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1">
                <Award className="w-3 h-3" />
                <span>#1 {language === 'es' ? 'Chollo Top' : 'Top Value Deal'}</span>
              </span>
              {topPick && (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500 text-slate-950">
                  {t.grade} {topPick.dealGrade}
                </span>
              )}
            </div>

            {topPick ? (
              <div className="space-y-3">
                {topPick.imageUri && (
                  <div className="relative h-36 rounded-xl overflow-hidden border border-slate-800/80">
                    <img
                      src={topPick.imageUri}
                      alt={topPick.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-slate-950/90 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-lg border border-slate-700 shadow-md">
                      {formatPrice(topPick.price, currency)}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-2">{topPick.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{topPick.sourceName} • {topPick.location || 'España / Europa'}</span>
                  </p>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <p className="text-emerald-400 font-semibold">{topPick.dealReason}</p>
                  {topPick.pros && topPick.pros.length > 0 && (
                    <p className="text-slate-400 text-[11px] line-clamp-2">
                      <span className="text-slate-300 font-medium">{t.pros}:</span> {topPick.pros.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-8 text-center">{language === 'es' ? 'No hay ofertas destacadas todavía.' : 'No top pick available yet.'}</p>
            )}
          </div>

          {topPick && (
            <button
              onClick={() => onSelectListing(topPick)}
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 text-center"
            >
              {language === 'es' ? 'Ver Detalles Completos y Enlace' : 'View Full Deal Details & Link'}
            </button>
          )}

        </div>

      </div>

      {/* Bento Row 3: Price Distribution Histogram */}
      <div className="bg-slate-900/90 border border-slate-800/90 p-5 sm:p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-mono">{t.priceDistribution}</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {language === 'es' ? 'Rango Detectado: ' : 'Scraped Range: '}
            {formatPrice(lowestPrice, currency)} &ndash; {formatPrice(highestPrice, currency)}
          </span>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="range" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#06b6d4' : '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

