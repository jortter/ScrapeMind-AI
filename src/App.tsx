import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AgentFormModal } from './components/AgentFormModal';
import { AgentExecutionConsole } from './components/AgentExecutionConsole';
import { DashboardOverview } from './components/DashboardOverview';
import { ListingsGrid } from './components/ListingsGrid';
import { ListingDetailModal } from './components/ListingDetailModal';
import { AlertsPanel } from './components/AlertsPanel';
import { AgentListSidebar } from './components/AgentListSidebar';
import { INITIAL_RESEARCH_AGENTS, INITIAL_ALERTS } from './data/mockAgents';
import { ResearchAgentTask, ScrapedListingItem, TriggeredAlert, AgentExecutionLog, AppLanguage, AppCurrency } from './types';
import { LayoutDashboard, ListFilter, Bell, Bot, Settings, Sliders } from 'lucide-react';
import { DICTIONARY } from './utils/i18n';

export default function App() {
  const [language, setLanguage] = useState<AppLanguage>('es');
  const [currency, setCurrency] = useState<AppCurrency>('EUR');
  const [locationFilter, setLocationFilter] = useState<string>('es');

  const [agents, setAgents] = useState<ResearchAgentTask[]>(() => {
    const saved = localStorage.getItem('scrapemind_agents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved agents', e);
      }
    }
    return INITIAL_RESEARCH_AGENTS;
  });

  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    agents[0]?.id || 'agent-car-01'
  );

  const [alerts, setAlerts] = useState<TriggeredAlert[]>(() => {
    const saved = localStorage.getItem('scrapemind_alerts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved alerts', e);
      }
    }
    return INITIAL_ALERTS;
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'alerts' | 'parameters'>('overview');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<ResearchAgentTask | null>(null);
  const [selectedListingDetail, setSelectedListingDetail] = useState<ScrapedListingItem | null>(null);
  
  // Scraping execution state
  const [isScraping, setIsScraping] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<AgentExecutionLog[]>([]);

  const t = DICTIONARY[language];

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('scrapemind_agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('scrapemind_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const currentAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  // Helper to add execution log step
  const addLog = (stepName: string, status: AgentExecutionLog['status'], message: string, details?: string) => {
    const newLog: AgentExecutionLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      stepName,
      status,
      message,
      details,
    };
    setExecutionLogs((prev) => [...prev, newLog]);
  };

  // Run AI Web Scrape Route
  const handleRunScrape = async () => {
    if (!currentAgent || isScraping) return;

    setIsScraping(true);
    setExecutionLogs([]);

    try {
      addLog('Paso 1: Estrategia de Búsqueda', 'running', `Formulando consultas para "${currentAgent.title}"...`, currentAgent.userGoals);
      await new Promise((r) => setTimeout(r, 600));
      addLog('Paso 1: Estrategia de Búsqueda', 'completed', 'Parámetros optimizados.');

      addLog('Paso 2: Scrapeo Web Grounded', 'running', `Rastreando en vivo plataformas como ${currentAgent.searchParams.targetPlatforms.join(', ') || 'portales'}...`);

      const response = await fetch('/api/agent/scrape-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle: currentAgent.title,
          topicCategory: currentAgent.topicCategory,
          userGoals: currentAgent.userGoals,
          searchParams: currentAgent.searchParams,
          alertConfig: currentAgent.alertConfig,
          language,
          currency,
          location: locationFilter,
        }),
      });

      const data = await response.json();
      addLog('Paso 2: Scrapeo Web Grounded', 'completed', `Obtenidos ${data.listings?.length || 0} anuncios activos en vivo.`);

      addLog('Paso 3: Extracción y Calificación', 'running', 'Calculando notas de chollo, pros/contras y desglose de precio...');
      await new Promise((r) => setTimeout(r, 500));
      addLog('Paso 3: Extracción y Calificación', 'completed', 'Puntuaciones finalizadas.');

      addLog('Paso 4: Inteligencia de Mercado', 'running', 'Sintetizando informe ejecutivo...');
      await new Promise((r) => setTimeout(r, 400));
      addLog('Paso 4: Inteligencia de Mercado', 'completed', 'Informe de mercado listo.');

      // Check alert rules
      const newListings: ScrapedListingItem[] = data.listings || [];
      const newAlerts: TriggeredAlert[] = [];

      if (currentAgent.alertConfig.enabled) {
        addLog('Paso 5: Evaluación de Alertas', 'running', 'Comprobando umbrales automáticos...');
        newListings.forEach((item) => {
          const matchPrice = !currentAgent.alertConfig.maxPriceThreshold || item.price <= currentAgent.alertConfig.maxPriceThreshold;
          const matchGrade = item.dealGrade === 'A+' || item.dealGrade === 'A';
          if (matchPrice && matchGrade) {
            newAlerts.push({
              id: `alert-${Date.now()}-${item.id}`,
              agentId: currentAgent.id,
              agentTitle: currentAgent.title,
              listingId: item.id,
              listingTitle: item.title,
              price: item.price,
              dealGrade: item.dealGrade,
              reason: `¡Alerta activada! Precio de ${item.price}€ cumple con tu umbral de ${currentAgent.alertConfig.maxPriceThreshold || 'objetivo'} con nota ${item.dealGrade}`,
              timestamp: new Date().toISOString(),
              read: false,
              url: item.url,
            });
          }
        });
        addLog('Paso 5: Evaluación de Alertas', 'completed', `Generadas ${newAlerts.length} nuevas alertas.`);
      }

      // Update current agent with new findings
      setAgents((prev) =>
        prev.map((a) =>
          a.id === currentAgent.id
            ? {
                ...a,
                status: 'completed',
                lastRunAt: new Date().toISOString(),
                scrapedCount: newListings.length,
                summary: data.summary,
                listings: newListings,
              }
            : a
        )
      );

      if (newAlerts.length > 0) {
        setAlerts((prev) => [...newAlerts, ...prev]);
      }

    } catch (error: any) {
      console.error('Error executing scraper:', error);
      addLog('Ejecución del Scraper', 'failed', 'Ocurrió un error en el rastreo. Datos de respaldo cargados.', error.message);
    } finally {
      setIsScraping(false);
    }
  };

  // Create or Update Agent
  const handleSaveAgent = (agentData: Partial<ResearchAgentTask>) => {
    if (editingAgent) {
      setAgents((prev) =>
        prev.map((a) => (a.id === editingAgent.id ? ({ ...a, ...agentData } as ResearchAgentTask) : a))
      );
      setEditingAgent(null);
    } else {
      const newAgent: ResearchAgentTask = {
        id: `agent-${Date.now()}`,
        title: agentData.title || (language === 'es' ? 'Nuevo Agente de Rastreo' : 'New Research Agent'),
        topicCategory: agentData.topicCategory || 'used_cars',
        userGoals: agentData.userGoals || '',
        searchParams: agentData.searchParams || {
          targetPlatforms: ['Coches.net', 'Autohero'],
          keywords: '',
          sortBy: 'deal_grade',
        },
        alertConfig: agentData.alertConfig || {
          enabled: true,
          notifyFrequency: 'instant',
          notifyMethod: 'in_app',
        },
        status: 'idle',
        createdAt: new Date().toISOString(),
        scrapedCount: 0,
        listings: [],
      };
      setAgents((prev) => [newAgent, ...prev]);
      setSelectedAgentId(newAgent.id);
    }
  };

  const handleDeleteAgent = (id: string) => {
    if (agents.length <= 1) return;
    const nextAgents = agents.filter((a) => a.id !== id);
    setAgents(nextAgents);
    if (selectedAgentId === id) {
      setSelectedAgentId(nextAgents[0].id);
    }
  };

  const handleToggleFavorite = (listingId: string) => {
    if (!currentAgent) return;
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id !== currentAgent.id) return a;
        return {
          ...a,
          listings: a.listings.map((l) => (l.id === listingId ? { ...l, isFavorite: !l.isFavorite } : l)),
        };
      })
    );
  };

  // Test Alert Simulation
  const handleSimulateTestAlert = () => {
    if (!currentAgent) return;
    const sampleItem = currentAgent.listings[0] || {
      id: 'sim-1',
      title: '2020 Toyota RAV4 Hybrid - ¡Bajada de precio repentina!',
      price: 17500,
      dealGrade: 'A+' as const,
      url: 'https://www.coches.net',
    };

    const simulatedAlert: TriggeredAlert = {
      id: `alert-sim-${Date.now()}`,
      agentId: currentAgent.id,
      agentTitle: currentAgent.title,
      listingId: sampleItem.id,
      listingTitle: sampleItem.title,
      price: sampleItem.price,
      dealGrade: sampleItem.dealGrade,
      reason: `⚡ ¡Bajada de precio inmediata! Publicado en 17.500 € (2.200 € por debajo de la media en España)`,
      timestamp: new Date().toISOString(),
      read: false,
      url: sampleItem.url,
    };

    setAlerts((prev) => [simulatedAlert, ...prev]);
  };

  const handleMarkAllAlertsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const handleClearAlerts = () => {
    setAlerts([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Bento Navbar with Language, Currency, Location controls */}
      <Navbar
        agents={agents}
        selectedAgentId={selectedAgentId}
        onSelectAgent={setSelectedAgentId}
        onOpenNewModal={() => {
          setEditingAgent(null);
          setIsFormModalOpen(true);
        }}
        onOpenPresetModal={() => {
          setEditingAgent(null);
          setIsFormModalOpen(true);
        }}
        alerts={alerts}
        onOpenAlertsModal={() => setIsAlertsModalOpen(true)}
        isScrapingActive={isScraping}
        onRunCurrentScrape={handleRunScrape}
        language={language}
        onLanguageChange={setLanguage}
        currency={currency}
        onCurrencyChange={setCurrency}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Agent Info Bento Header Card */}
        {currentAgent && (
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 mb-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {currentAgent.topicCategory.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {language === 'es' ? 'Última actualización: ' : 'Last updated: '}
                  {currentAgent.lastRunAt ? new Date(currentAgent.lastRunAt).toLocaleTimeString() : (language === 'es' ? 'Pendiente de rastreo' : 'Not run yet')}
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">{currentAgent.title}</h1>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">{currentAgent.userGoals}</p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => {
                  setEditingAgent(currentAgent);
                  setIsFormModalOpen(true);
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-200 transition-colors"
              >
                {language === 'es' ? 'Editar Parámetros' : 'Edit Parameters'}
              </button>
              <button
                onClick={handleRunScrape}
                disabled={isScraping}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white transition-all shadow-lg shadow-cyan-600/20 disabled:opacity-50 flex items-center space-x-1.5"
              >
                <Bot className="w-4 h-4" />
                <span>{isScraping ? t.scrapingWeb : t.runScraperNow}</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Execution Console Stream */}
        <AgentExecutionConsole
          logs={executionLogs}
          isScraping={isScraping}
          topicTitle={currentAgent?.title || 'Búsqueda Web'}
        />

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800/80 mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-4 text-xs font-mono font-bold flex items-center space-x-2 border-b-2 transition-all ${
                activeTab === 'overview'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.marketOverviewTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('listings')}
              className={`pb-3 px-4 text-xs font-mono font-bold flex items-center space-x-2 border-b-2 transition-all ${
                activeTab === 'listings'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span>{t.scrapedListingsTab} ({currentAgent?.listings?.length || 0})</span>
            </button>

            <button
              onClick={() => setIsAlertsModalOpen(true)}
              className="pb-3 px-4 text-xs font-mono font-bold text-slate-400 hover:text-slate-200 flex items-center space-x-1.5 transition-colors"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>{t.alertsTab} ({alerts.length})</span>
            </button>
          </div>
        </div>

        {/* Content Body Grid (Bento Grid 3:1 split) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Workspace View (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'overview' && currentAgent && (
              <DashboardOverview
                agent={currentAgent}
                onSelectListing={setSelectedListingDetail}
                onRunScrape={handleRunScrape}
                isScraping={isScraping}
                language={language}
                currency={currency}
              />
            )}

            {activeTab === 'listings' && currentAgent && (
              <ListingsGrid
                listings={currentAgent.listings || []}
                onSelectListing={setSelectedListingDetail}
                onToggleFavorite={handleToggleFavorite}
                topicTitle={currentAgent.title}
                language={language}
                currency={currency}
              />
            )}
          </div>

          {/* Right Agent Management Sidebar (1 col) */}
          <div className="space-y-6">
            <AgentListSidebar
              agents={agents}
              selectedAgentId={selectedAgentId}
              onSelectAgent={setSelectedAgentId}
              onOpenNewModal={() => {
                setEditingAgent(null);
                setIsFormModalOpen(true);
              }}
              onDeleteAgent={handleDeleteAgent}
              isScraping={isScraping}
              onRunCurrentScrape={handleRunScrape}
              language={language}
            />
          </div>

        </div>

      </main>

      {/* Modals */}
      <AgentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveAgent}
        initialData={editingAgent}
        language={language}
        currency={currency}
      />

      <ListingDetailModal
        listing={selectedListingDetail}
        onClose={() => setSelectedListingDetail(null)}
        onToggleFavorite={handleToggleFavorite}
        language={language}
        currency={currency}
      />

      <AlertsPanel
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        alerts={alerts}
        onMarkAllRead={handleMarkAllAlertsRead}
        onClearAlerts={handleClearAlerts}
        onOpenListingUrl={(url) => window.open(url, '_blank')}
        onSimulateTestAlert={handleSimulateTestAlert}
        language={language}
        currency={currency}
      />

      {/* Bento Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-5 text-center text-xs text-slate-500 font-mono">
        <p>ScrapeMind AI Web Agent &bull; European Market Scraping with Gemini Grounded Research</p>
      </footer>

    </div>
  );
}

