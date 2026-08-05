import React from 'react';
import { X, ExternalLink, Star, Check, AlertCircle, MapPin, Calendar, Gauge, ShieldCheck } from 'lucide-react';
import { ScrapedListingItem, DealGrade, AppLanguage, AppCurrency } from '../types';
import { DICTIONARY, formatPrice } from '../utils/i18n';

interface ListingDetailModalProps {
  listing: ScrapedListingItem | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  language: AppLanguage;
  currency: AppCurrency;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  onToggleFavorite,
  language,
  currency,
}) => {
  if (!listing) return null;
  const t = DICTIONARY[language];

  const getBadgeColor = (grade: DealGrade) => {
    switch (grade) {
      case 'A+':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      case 'A':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50';
      case 'B':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold border ${getBadgeColor(listing.dealGrade)}`}>
              {t.grade} {listing.dealGrade}
            </span>
            <span className="text-xs text-slate-400 font-mono">• {listing.sourceName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleFavorite(listing.id)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
            >
              <Star className={`w-5 h-5 ${listing.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Main Title & Price */}
          <div>
            <h2 className="text-xl font-bold text-white leading-snug">{listing.title}</h2>
            
            <div className="flex flex-wrap items-baseline gap-3 mt-2">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                {formatPrice(listing.price, currency)}
              </span>
              {listing.originalPrice && listing.originalPrice > listing.price && (
                <span className="text-sm text-slate-400 line-through font-mono">
                  {language === 'es' ? 'Precio Estimado: ' : 'Est. Market: '}
                  {formatPrice(listing.originalPrice, currency)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-3">
              {listing.location && (
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{listing.location}</span>
                </span>
              )}
              {listing.year && (
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{language === 'es' ? 'Año' : 'Year'}: {listing.year}</span>
                </span>
              )}
              {listing.mileage && (
                <span className="flex items-center space-x-1">
                  <Gauge className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'es' ? 'Kilometraje' : 'Km'}: {listing.mileage.toLocaleString()} km</span>
                </span>
              )}
            </div>
          </div>

          {/* AI Deal Grade Justification */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.dealGradeScore}</span>
            </h3>
            <p className="text-xs text-slate-200">{listing.dealReason}</p>
          </div>

          {/* Key Specs */}
          {listing.specs && listing.specs.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-300 mb-2">{t.specsAndAttributes}:</h3>
              <div className="flex flex-wrap gap-1.5">
                {listing.specs.map((spec, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-200 border border-slate-700">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Pros */}
            {listing.pros && listing.pros.length > 0 && (
              <div className="bg-emerald-950/30 border border-emerald-800/40 p-3.5 rounded-xl space-y-1.5">
                <h4 className="text-xs font-bold text-emerald-300 flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{t.pros}</span>
                </h4>
                <ul className="space-y-1 text-xs text-emerald-200">
                  {listing.pros.map((p, i) => (
                    <li key={i}>• {p}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cons */}
            {listing.cons && listing.cons.length > 0 && (
              <div className="bg-rose-950/30 border border-rose-800/40 p-3.5 rounded-xl space-y-1.5">
                <h4 className="text-xs font-bold text-rose-300 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{t.cons}</span>
                </h4>
                <ul className="space-y-1 text-xs text-rose-200">
                  {listing.cons.map((c, i) => (
                    <li key={i}>• {c}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Original Snippet */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-slate-400">{language === 'es' ? 'Fragmento/Descripción Scrapeada:' : 'Scraped Snippet / Description:'}</h3>
            <p className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800 leading-relaxed italic">
              "{listing.snippet}"
            </p>
          </div>

        </div>

        {/* Footer Link */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">Fuente: {listing.domain}</span>
          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs transition-all flex items-center space-x-2 shadow-lg shadow-cyan-600/20"
          >
            <span>{t.viewOriginalListing}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};

