export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ShortUrl {
  id: string;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  customAlias?: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface UrlListResponse {
  data: ShortUrl[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AnalyticsSummary {
  totalClicks: number;
  clicksToday: number;
  url: {
    id: string;
    shortCode: string;
    originalUrl: string;
    createdAt: string;
  };
}

export interface TimeSeriesPoint {
  date: string;
  clicks: number;
}

export interface Breakdown {
  byCountry: { country: string; clicks: number }[];
  byBrowser: { browser: string; clicks: number }[];
}
