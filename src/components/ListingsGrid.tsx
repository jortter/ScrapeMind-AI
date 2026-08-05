import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Star, ExternalLink, Download, Grid, List, MapPin } from 'lucide-react';
import { ScrapedListingItem, DealGrade, AppLanguage, AppCurrency } from '../types';
import { DICTIONARY, formatPrice } from '../utils/i18n';

interface ListingsGridProps {
  listings: ScrapedListingItem[];
  onSelectListing: (listing: ScrapedListingItem) => void;
  onToggleFavorite: (id: string) => void;
  topicTitle: string;
  language: AppLanguage;
  currency: AppCurrency;
}

export const ListingsGrid: React.FC<ListingsGridProps> = ({
  listings,
  onSelectListing,
  onToggleFavorite,
  topicTitle,
  language,
  currency,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deal_grade' | 'price_asc' | 'price_desc' | 'date'>('deal_grade');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const t = DICTIONARY[language];

  // Extract unique platforms
  const platforms = useMemo(() => {
    const set = new Set(listings.map((l) => l.sourceName));
    return Array.from(set);
  }, [listings]);

  // Filter & Sort logic
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        if (onlyFavorites && !item.isFavorite) return false;
        if (gradeFilter !== 'all' && item.dealGrade !== gradeFilter) return false;
        if (platformFilter !== 'all' && item.sourceName !== platformFilter) return false;
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(term);
          const matchSnippet = item.snippet.toLowerCase().includes(term);
          const matchLocation = item.location?.toLowerCase().includes(term);
          const matchSource = item.sourceName.toLowerCase().includes(term);
          if (!matchTitle && !matchSnippet && !matchLocation && !matchSource) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deal_grade') {
          const gradesOrder: Record<DealGrade, number> = { 'A+': 4, A: 3, B: 2, C: 1 };
          return (gradesOrder[b.dealGrade] || 0) - (gradesOrder[a.dealGrade] || 0);
        }
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        return 0;
      });
  }, [listings, searchTerm, gradeFilter, platformFilter, sortBy, onlyFavorites]);

  // Export CSV handler
  const handleExportCSV = () => {
    if (!listings.length) return;
    const headers = ['ID', 'Title', 'Price', 'Original Price', 'Source', 'Location', 'Deal Grade', 'URL', 'Pros', 'Snippet'];
    const rows = filteredListings.map((l) => [
      l.id,
      `"${l.title.replace(/"/g, '""')}"`,
      l.price,
      l.originalPrice || '',
      `"${l.sourceName}"`,
      `"${l.location || ''}"`,
      l.dealGrade,
      `"${l.url}"`,
      `"${(l.pros || []).join('; ')}"`,
      `"${l.snippet.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${topicTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_listings.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <div className="space-y-4">
      
      {/* Control Bar & Filters */}
      <div className="bg-slate-900/90 border border-slate-800/90 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
        
        {/* Search Term Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchListings}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          
          {/* Grade Filter */}
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">{language === 'es' ? 'Todas las Notas' : 'All Grades'}</option>
            <option value="A+">Grade A+ (Chollo)</option>
            <option value="A">Grade A (Muy bueno)</option>
            <option value="B">Grade B (Normal)</option>
          </select>

          {/* Platform Filter */}
          {platforms.length > 0 && (
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">{language === 'es' ? 'Todas las Fuentes' : 'All Sources'}</option>
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          )}

          {/* Sort By */}
          <div className="flex items-center space-x-1 bg-slate-950/80 border border-slate-800 rounded-xl px-2 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="deal_grade">{t.sortByGrade}</option>
              <option value="price_asc">{t.sortByPriceAsc}</option>
              <option value="price_desc">{t.sortByPriceDesc}</option>
            </select>
          </div>

          {/* Favorites Filter */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3 py-1.5 rounded-xl border font-medium flex items-center space-x-1 transition-colors ${
              onlyFavorites
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{t.savedFavorite}</span>
          </button>

          {/* Grid vs Table View Toggle */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded-lg ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold flex items-center space-x-1 transition-colors"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

        </div>

      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden hover:border-slate-700/90 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                
                {/* Image Header */}
                {item.imageUri ? (
                  <div className="relative h-44 overflow-hidden bg-slate-950">
                    <img
                      src={item.imageUri}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border uppercase tracking-wider ${getBadgeColor(item.dealGrade)}`}>
                        {t.grade} {item.dealGrade}
                      </span>
                      {item.isNewAlert && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500 text-white animate-pulse">
                          ALERTA
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-300 border border-slate-700"
                    >
                      <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    <div className="absolute bottom-2 right-2 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700 font-mono font-bold text-sm text-white shadow-md">
                      {formatPrice(item.price, currency)}
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-[10px] text-slate-400 line-through ml-1 font-normal font-sans">
                          {formatPrice(item.originalPrice, currency)}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getBadgeColor(item.dealGrade)}`}>
                      {t.grade} {item.dealGrade}
                    </span>
                    <div className="text-right">
                      <span className="text-base font-bold text-white font-mono">{formatPrice(item.price, currency)}</span>
                    </div>
                  </div>
                )}

                {/* Content Body */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{item.sourceName}</span>
                    {item.location && <span>• {item.location}</span>}
                    {item.dateFound && <span className="text-slate-500">({item.dateFound})</span>}
                  </p>

                  <p className="text-xs text-slate-300 line-clamp-2 italic bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                    "{item.snippet}"
                  </p>

                  {/* Specs Chips */}
                  {item.specs && item.specs.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.specs.slice(0, 3).map((spec, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] text-slate-300">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                </div>

              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
                <button
                  onClick={() => onSelectListing(item)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs font-semibold transition-colors text-center"
                >
                  {language === 'es' ? 'Ver Detalles' : 'View Details'}
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 transition-colors"
                  title={t.viewOriginalListing}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-x-auto shadow-xl">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950 text-slate-400 font-mono font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">{t.grade}</th>
                <th className="p-3">Título & Fuente</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Ubicación</th>
                <th className="p-3">Evaluación Chollo</th>
                <th className="p-3 text-right">Enlace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredListings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => onSelectListing(item)}>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getBadgeColor(item.dealGrade)}`}>
                      {item.dealGrade}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-white max-w-xs truncate">
                    {item.title}
                    <span className="block text-[10px] text-slate-400 font-normal">{item.sourceName}</span>
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-400">
                    {formatPrice(item.price, currency)}
                  </td>
                  <td className="p-3 text-slate-400">
                    {item.location || 'España'}
                  </td>
                  <td className="p-3 text-slate-300 max-w-xs truncate">
                    {item.dealReason}
                  </td>
                  <td className="p-3 text-right">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 inline-block hover:bg-cyan-600/30"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredListings.length === 0 && (
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-12 text-center text-slate-400">
          <p className="text-sm">{language === 'es' ? 'No se encontraron anuncios con los filtros aplicados.' : 'No listings found matching your filters.'}</p>
        </div>
      )}

    </div>
  );
};

