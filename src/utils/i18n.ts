import { AppLanguage, AppCurrency } from '../types';

export const CURRENCY_SYMBOLS: Record<AppCurrency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
};

export function formatPrice(amount: number | undefined | null, currency: AppCurrency = 'EUR'): string {
  if (amount === undefined || amount === null || isNaN(amount)) return 'N/A';
  const symbol = CURRENCY_SYMBOLS[currency] || '€';
  const formatted = amount.toLocaleString(currency === 'EUR' ? 'es-ES' : 'en-US');

  if (currency === 'EUR') {
    return `${formatted}${symbol}`;
  }
  return `${symbol}${formatted}`;
}

export const DICTIONARY = {
  es: {
    appName: 'ScrapeMind AI',
    appSubtitle: 'Agente de Scraping Web y Radar de Ofertas en España y Europa',
    selectAgent: 'Seleccionar Agente de Investigación',
    runScraper: 'Ejecutar Scraper',
    scrapingWeb: 'Scrapeando Web...',
    templates: 'Plantillas',
    newAgent: 'Nuevo Agente Scraper',
    alerts: 'Alertas Automatizadas',
    noAlerts: 'Sin alertas pendientes',
    location: 'Ubicación / País',
    language: 'Idioma',
    currency: 'Moneda',
    
    // Bento Overview
    activeMission: 'Misión Activa',
    targetPlatforms: 'Plataformas Objetivo',
    marketInsights: 'Observaciones de Mercado',
    totalListings: 'Ofertas Encontradas',
    averagePrice: 'Precio Medio',
    lowestPrice: 'Precio Mínimo',
    highestPrice: 'Precio Máximo',
    topRecommendation: 'Recomendación Principal',
    searchParams: 'Parámetros de Búsqueda',
    viewAllListings: 'Ver Todos los Anuncios',
    priceDistribution: 'Distribución de Precios',
    citationsAndSources: 'Fuentes y Citas Grounded',
    runScraperNow: 'Ejecutar Scraper Ahora',
    marketOverviewTab: 'Resumen de Mercado',
    scrapedListingsTab: 'Anuncios Scrapeados',
    alertsTab: 'Notificaciones de Alerta',
    alertsTitle: 'Alertas Automatizadas de Ofertas',
    markAllRead: 'Marcar todas como leídas',
    clearAlerts: 'Borrar historial de alertas',
    dealGradeScore: 'Justificación de Nota de Chollo IA',
    specsAndAttributes: 'Especificaciones y Atributos Principales',
    
    // Filters & Sorting
    sortBy: 'Ordenar por',
    sortByGrade: 'Mejor Nota (A+ al principio)',
    sortByPriceAsc: 'Precio: Menor a Mayor',
    sortByPriceDesc: 'Precio: Mayor a Menor',
    sortByDate: 'Fecha de publicación',
    searchListings: 'Buscar en anuncios encontrados...',
    
    // Listing Card
    grade: 'Nota',
    mileage: 'Kilometraje',
    year: 'Año',
    pros: 'Puntos a favor',
    cons: 'A mejorar',
    viewOriginalListing: 'Ir al anuncio original',
    dealScoreExplanation: 'Evaluación del precio frente al estado y mercado',
    savedFavorite: 'Guardado',
    saveFavorite: 'Guardar',
    
    // Modals & Forms
    createNewTitle: 'Crear Agente de Scraping Personalizado',
    createNewDesc: 'Define los parámetros exactos y objetivos. El agente rastreará la web en tiempo real.',
    agentNameLabel: 'Nombre del Agente / Tema de Búsqueda',
    agentNamePlaceholder: 'Ej. SUV Audi Q5 en España con menos de 80.000 km',
    categoryLabel: 'Categoría de Mercado',
    userGoalsLabel: 'Objetivos del Usuario y Preferencias Exactas',
    userGoalsPlaceholder: 'Explica lo que buscas: Ej. "Quiero encontrar la mejor oferta de coche de ocasión con etiqueta ECO en Madrid..."',
    minPriceLabel: 'Precio Mínimo',
    maxPriceLabel: 'Precio Máximo',
    locationLabel: 'Ubicación / Región',
    locationPlaceholder: 'Ej. Madrid, Barcelona, España, Alemania',
    countryLabel: 'País Principal',
    keywordsLabel: 'Palabras Clave de Búsqueda',
    excludeKeywordsLabel: 'Palabras a Excluir',
    minYearLabel: 'Año Mínimo',
    maxMileageLabel: 'Km / Uso Máximo',
    alertConfigTitle: 'Configuración de Alertas Automáticas',
    enableAlerts: 'Activar Alertas de Ofertas Chollo',
    alertThresholdLabel: 'Notificar si el precio cae de:',
    notifyFrequency: 'Frecuencia de Notificación',
    cancel: 'Cancelar',
    startScrapingAgent: 'Lanzar Agente Scraper',
    
    // Categories
    used_cars: 'Coches y Vehículos de Ocasión',
    electronics: 'Electrónica y Tecnología',
    real_estate: 'Inmobiliaria y Alquiler',
    competitor_intel: 'Análisis de Competencia',
    collectibles: 'Coleccionismo y Antigüedades',
    custom: 'Búsqueda Personalizada',
  },
  en: {
    appName: 'ScrapeMind AI',
    appSubtitle: 'Web Scraping Agent & European Deal Intelligence Radar',
    selectAgent: 'Select Research Agent',
    runScraper: 'Run Scraper',
    scrapingWeb: 'Scraping Web...',
    templates: 'Templates',
    newAgent: 'New Scraper Agent',
    alerts: 'Automated Alerts',
    noAlerts: 'No unread alerts',
    location: 'Location / Country',
    language: 'Language',
    currency: 'Currency',
    
    // Bento Overview
    activeMission: 'Active Mission',
    targetPlatforms: 'Target Platforms',
    marketInsights: 'Market Observations',
    totalListings: 'Total Listings Found',
    averagePrice: 'Average Price',
    lowestPrice: 'Lowest Price',
    highestPrice: 'Highest Price',
    topRecommendation: 'Top Recommendation',
    searchParams: 'Search Parameters',
    viewAllListings: 'View All Listings',
    priceDistribution: 'Price Distribution',
    citationsAndSources: 'Sources & Grounded Citations',
    runScraperNow: 'Run Scraper Now',
    marketOverviewTab: 'Market Overview',
    scrapedListingsTab: 'Scraped Offers',
    alertsTab: 'Alert Notifications',
    alertsTitle: 'Automated Listing Alerts',
    markAllRead: 'Mark all as read',
    clearAlerts: 'Clear alert history',
    dealGradeScore: 'AI Deal Score Justification',
    specsAndAttributes: 'Key Specifications & Attributes',
    
    // Filters & Sorting
    sortBy: 'Sort by',
    sortByGrade: 'Best Deal Grade (A+ first)',
    sortByPriceAsc: 'Price: Low to High',
    sortByPriceDesc: 'Price: High to Low',
    sortByDate: 'Date Found',
    searchListings: 'Search found listings...',
    
    // Listing Card
    grade: 'Grade',
    mileage: 'Mileage',
    year: 'Year',
    pros: 'Pros',
    cons: 'Cons',
    viewOriginalListing: 'Visit Original Listing',
    dealScoreExplanation: 'Price evaluation against condition and market value',
    savedFavorite: 'Saved',
    saveFavorite: 'Save',
    
    // Modals & Forms
    createNewTitle: 'Create Custom Scraping Agent',
    createNewDesc: 'Define exact search criteria and goals. The agent will scrape and analyze European sources.',
    agentNameLabel: 'Agent Name / Search Topic',
    agentNamePlaceholder: 'e.g. Used Audi Q5 in Spain under 80,000 km',
    categoryLabel: 'Market Category',
    userGoalsLabel: 'User Goals & Exact Preferences',
    userGoalsPlaceholder: 'Explain what you want: e.g. "Find the best deals on SUV with Eco badge in Madrid..."',
    minPriceLabel: 'Min Price',
    maxPriceLabel: 'Max Price',
    locationLabel: 'Location / Region',
    locationPlaceholder: 'e.g. Madrid, Barcelona, Spain, Germany',
    countryLabel: 'Primary Country',
    keywordsLabel: 'Search Keywords',
    excludeKeywordsLabel: 'Exclude Keywords',
    minYearLabel: 'Min Year',
    maxMileageLabel: 'Max Mileage / Km',
    alertConfigTitle: 'Automated Alert Configuration',
    enableAlerts: 'Enable High-Value Deal Alerts',
    alertThresholdLabel: 'Notify if price drops below:',
    notifyFrequency: 'Notification Frequency',
    cancel: 'Cancel',
    startScrapingAgent: 'Launch Scraping Agent',
    
    // Categories
    used_cars: 'Used Cars & Vehicles',
    electronics: 'Electronics & Tech',
    real_estate: 'Real Estate & Rentals',
    competitor_intel: 'Competitor Intelligence',
    collectibles: 'Collectibles & Antiques',
    custom: 'Custom Search',
  }
};
