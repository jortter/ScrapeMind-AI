import React from 'react';
import { Bell, Trash2, ExternalLink, Check, X } from 'lucide-react';
import { TriggeredAlert, AppLanguage, AppCurrency } from '../types';
import { DICTIONARY, formatPrice } from '../utils/i18n';

interface AlertsPanelProps {
  alerts: TriggeredAlert[];
  onMarkAllRead: () => void;
  onClearAlerts: () => void;
  onOpenListingUrl: (url: string) => void;
  onSimulateTestAlert: () => void;
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  currency: AppCurrency;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onMarkAllRead,
  onClearAlerts,
  onOpenListingUrl,
  onSimulateTestAlert,
  isOpen,
  onClose,
  language,
  currency,
}) => {
  if (!isOpen) return null;

  const unreadCount = alerts.filter((a) => !a.read).length;
  const t = DICTIONARY[language];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono">
                {t.alertsTitle} ({alerts.length})
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {unreadCount > 0 
                  ? (language === 'es' ? `${unreadCount} alertas sin leer` : `${unreadCount} unread alert notifications`)
                  : (language === 'es' ? 'Al día, sin alertas pendientes' : 'All alerts caught up')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onSimulateTestAlert}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
            >
              {language === 'es' ? 'Simular Alerta' : 'Test Simulation'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={onMarkAllRead}
            disabled={unreadCount === 0}
            className="text-cyan-400 hover:text-cyan-300 disabled:opacity-40 font-medium flex items-center space-x-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{t.markAllRead}</span>
          </button>
          
          <button
            onClick={onClearAlerts}
            disabled={alerts.length === 0}
            className="text-slate-400 hover:text-rose-400 disabled:opacity-40 flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.clearAlerts}</span>
          </button>
        </div>

        {/* List of Alerts */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                alert.read
                  ? 'bg-slate-950/40 border-slate-800 text-slate-300'
                  : 'bg-amber-950/20 border-amber-500/40 text-slate-100 shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {t.grade} {alert.dealGrade}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {formatPrice(alert.price, currency)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">({alert.agentTitle})</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">{alert.listingTitle}</h4>
                  <p className="text-xs text-amber-200 mt-1 font-medium">{alert.reason}</p>
                </div>

                <a
                  href={alert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors shrink-0"
                  title={t.viewOriginalListing}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              {language === 'es' ? 'No hay notificaciones de alerta aún. Haz clic en "Simular Alerta" o ejecuta un rastreo web con límites de precio.' : 'No alert notifications yet. Click "Test Simulation" or run a web scrape with price thresholds.'}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            {language === 'es' ? 'Cerrar' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};

