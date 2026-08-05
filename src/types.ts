export type DealGrade = 'A+' | 'A' | 'B' | 'C';
export type AppLanguage = 'es' | 'en';
export type AppCurrency = 'EUR' | 'USD' | 'GBP';

export interface ScrapedListingItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  url: string;
  domain: string;
  sourceName: string;
  location?: string;
  country?: string;
  year?: number;
  mileage?: number;
  specs?: string[];
  dealGrade: DealGrade;
  dealReason: string;
  pros: string[];
  cons: string[];
  dateFound: string;
  snippet: string;
  isNewAlert?: boolean;
  isFavorite?: boolean;
  imageUri?: string;
}

export interface GroundingCitation {
  title: string;
  uri: string;
  snippet?: string;
}

export interface ResearchSummary {
  topicTitle: string;
  executiveSummary: string;
  marketInsights: string[];
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
  priceBuckets: { range: string; count: number }[];
  totalListingsFound: number;
  citations: GroundingCitation[];
  recommendation: string;
}

export interface AlertConfig {
  enabled: boolean;
  maxPriceThreshold?: number;
  minDealGrade?: DealGrade;
  requireKeywords?: string[];
  notifyFrequency: 'instant' | 'hourly' | 'daily';
  notifyMethod: 'in_app' | 'browser' | 'email';
}

export interface SearchParams {
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  country?: string;
  maxDistanceMiles?: number;
  targetPlatforms: string[];
  keywords: string;
  excludeKeywords?: string;
  minYear?: number;
  maxMileage?: number;
  sortBy: 'price_asc' | 'price_desc' | 'deal_grade' | 'date';
}

export interface ResearchAgentTask {
  id: string;
  title: string;
  topicCategory: 'used_cars' | 'real_estate' | 'electronics' | 'competitor_intel' | 'collectibles' | 'custom';
  userGoals: string;
  searchParams: SearchParams;
  alertConfig: AlertConfig;
  status: 'idle' | 'running' | 'completed' | 'error';
  lastRunAt?: string;
  createdAt: string;
  scrapedCount: number;
  summary?: ResearchSummary;
  listings: ScrapedListingItem[];
}

export interface AgentExecutionLog {
  id: string;
  timestamp: string;
  stepName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  message: string;
  details?: string;
}

export interface TriggeredAlert {
  id: string;
  agentId: string;
  agentTitle: string;
  listingId: string;
  listingTitle: string;
  price: number;
  dealGrade: DealGrade;
  reason: string;
  timestamp: string;
  read: boolean;
  url: string;
}

