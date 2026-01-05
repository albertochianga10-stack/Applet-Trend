
export interface Product {
  id: string;
  name: string;
  category: string;
  region: string;
  avgPrice: number;
  salesGrowth: number;
  popularityScore: number;
  lastUpdated: string;
  image: string;
}

export interface SalesData {
  date: string;
  sales: number;
  revenue: number;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'merchant';
  avatar: string;
}

export type TimeRange = 'day' | 'week' | 'month';

export interface MarketInsight {
  trend: string;
  reason: string;
  confidence: number;
  sources?: { uri: string; title: string }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface Report {
  id: string;
  title: string;
  date: string;
  type: 'PDF' | 'EXCEL' | 'CSV';
  size: string;
}
