
import { Product, SalesData } from './types';

export const ANGOLA_REGIONS = [
  'Luanda', 'Benguela', 'Huambo', 'Cabinda', 'Lubango', 'Namibe', 'Malange'
];

export const CATEGORIES = [
  'Eletrônicos', 'Moda', 'Alimentos', 'Beleza', 'Eletrodomésticos', 'Construção'
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Smartphone Galaxy S23',
    category: 'Eletrônicos',
    region: 'Luanda',
    avgPrice: 450000,
    salesGrowth: 15,
    popularityScore: 98,
    lastUpdated: new Date().toISOString(),
    image: 'https://picsum.photos/seed/s23/200/200'
  },
  {
    id: '2',
    name: 'Kit de Painel Solar 500W',
    category: 'Construção',
    region: 'Benguela',
    avgPrice: 120000,
    salesGrowth: 22,
    popularityScore: 92,
    lastUpdated: new Date().toISOString(),
    image: 'https://picsum.photos/seed/solar/200/200'
  },
  {
    id: '3',
    name: 'Óleo Vegetal (5L)',
    category: 'Alimentos',
    region: 'Huambo',
    avgPrice: 6500,
    salesGrowth: 5,
    popularityScore: 95,
    lastUpdated: new Date().toISOString(),
    image: 'https://picsum.photos/seed/oil/200/200'
  },
  {
    id: '4',
    name: 'Vestido Estampado Tradicional',
    category: 'Moda',
    region: 'Luanda',
    avgPrice: 12000,
    salesGrowth: 35,
    popularityScore: 88,
    lastUpdated: new Date().toISOString(),
    image: 'https://picsum.photos/seed/dress/200/200'
  }
];

export const MOCK_SALES_CHART: SalesData[] = [
  { date: 'Seg', sales: 400, revenue: 2400 },
  { date: 'Ter', sales: 300, revenue: 1398 },
  { date: 'Qua', sales: 900, revenue: 9800 },
  { date: 'Qui', sales: 1480, revenue: 3908 },
  { date: 'Sex', sales: 1890, revenue: 4800 },
  { date: 'Sáb', sales: 2390, revenue: 3800 },
  { date: 'Dom', sales: 3490, revenue: 4300 },
];
