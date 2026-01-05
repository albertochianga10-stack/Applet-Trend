
import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Package, Users, DollarSign, ArrowUpRight, ArrowDownRight, Zap, FileText, ExternalLink, Loader2 } from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_SALES_CHART } from '../constants';
import { MarketInsight, TimeRange, Product } from '../types';
import { getMarketInsights, getDetailedReport } from '../services/geminiService';

interface DashboardProps {
  searchQuery: string;
  setModal: (content: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ searchQuery, setModal }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; dir: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const data = await getMarketInsights();
      setInsights(data);
      setLoadingInsights(false);
    };
    fetchInsights();
  }, []);

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const reportContent = await getDetailedReport("Tendências de e-commerce em Angola para 2025");
      setModal({
        title: "Relatório Estratégico Applemar",
        body: (
          <div className="prose prose-slate max-w-none">
            <div className="p-4 bg-amber-50 rounded-xl mb-4 border border-amber-100">
              <p className="text-amber-800 text-sm font-medium">Este relatório foi gerado em tempo real usando dados agregados do Google Search e tendências de mercado local.</p>
            </div>
            <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
              {reportContent}
            </div>
          </div>
        )
      });
    } catch (error) {
      alert("Erro ao gerar relatório. Tente novamente.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.dir === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.dir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [searchQuery, sortConfig]);

  const toggleSort = (key: keyof Product) => {
    setSortConfig(prev => ({
      key,
      dir: prev?.key === key && prev.dir === 'asc' ? 'desc' : 'asc'
    }));
  };

  const showProvinciaDetail = () => {
    setModal({
      title: "Distribuição Regional",
      body: (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 font-medium">Top Províncias por Volume de Vendas:</p>
          <div className="space-y-3">
            {[
              { name: 'Luanda', val: 65, color: 'bg-amber-500' },
              { name: 'Benguela', val: 18, color: 'bg-blue-500' },
              { name: 'Huambo', val: 10, color: 'bg-emerald-500' },
              { name: 'Outras', val: 7, color: 'bg-slate-300' }
            ].map(p => (
              <div key={p.name}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>{p.name}</span>
                  <span>{p.val}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${p.color} h-full`} style={{ width: `${p.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    });
  };

  const stats = [
    { label: 'Vendas Totais', value: 'Kz 24.5M', change: '+12.5%', icon: DollarSign, color: 'bg-blue-500' },
    { label: 'Produtos Ativos', value: '1,284', change: '+3.2%', icon: Package, color: 'bg-amber-500' },
    { label: 'Visitas Hoje', value: '45.2k', change: '+18.1%', icon: Users, color: 'bg-emerald-500' },
    { label: 'Taxa Conversão', value: '4.8%', change: '-0.4%', icon: TrendingUp, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Painel Applemar Trend</h2>
          <p className="text-slate-500">Inteligência baseada em Google Trends e dados de mercado local.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {(['day', 'week', 'month'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                timeRange === range ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {range === 'day' ? 'Hoje' : range === 'week' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                {stat.change}
                {stat.change.startsWith('+') ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</h3>
            <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg">Análise de Crescimento</h3>
            <button onClick={showProvinciaDetail} className="text-amber-600 text-sm font-bold hover:underline px-3 py-1 bg-amber-50 rounded-lg">Ver Províncias</button>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_SALES_CHART}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl flex flex-col border border-slate-800 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl transition-all duration-500 group-hover:bg-amber-500/20"></div>
          <div className="flex items-center gap-2 mb-6">
            <Zap className="text-amber-400 fill-amber-400" size={24} />
            <h3 className="font-bold text-lg">Google Trends (Angola)</h3>
          </div>
          
          <div className="space-y-6 flex-1 overflow-y-auto max-h-[380px] pr-2 scrollbar-hide">
            {loadingInsights ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                <p className="text-xs text-slate-400 font-bold uppercase">Sincronizando com Search Engine...</p>
              </div>
            ) : (
              <>
                {insights.map((insight, idx) => (
                  <div key={idx} className="group/item cursor-default border-l-4 border-amber-500/20 hover:border-amber-500 pl-4 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-amber-400 text-sm uppercase tracking-tighter">{insight.trend}</span>
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300 font-bold">
                        {Math.round(insight.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3 font-medium">{insight.reason}</p>
                    
                    {insight.sources && insight.sources.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {insight.sources.map((source, sIdx) => (
                          <a 
                            key={sIdx} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] text-amber-500/60 hover:text-amber-400 transition-colors font-bold"
                          >
                            <ExternalLink size={10} />
                            <span className="truncate max-w-[180px]">{source.title || 'Ver fonte'}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          <button 
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
            className="mt-6 w-full py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-amber-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl"
          >
            {isGeneratingReport ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <FileText size={20} />
            )}
            Gerar Relatório IA
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Top Produtos Market-Wide</h3>
          <div className="flex gap-2">
            <button onClick={() => alert('Filtro de estoque aplicado')} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100">Disponibilidade</button>
            <button onClick={() => alert('Filtro de preço aplicado')} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100">Preço</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-100">
                <th className="pb-4 font-bold text-slate-500 text-xs uppercase cursor-pointer hover:text-slate-900" onClick={() => toggleSort('name')}>Produto</th>
                <th className="pb-4 font-bold text-slate-500 text-xs uppercase">Categoria</th>
                <th className="pb-4 font-bold text-slate-500 text-xs uppercase">Região</th>
                <th className="pb-4 font-bold text-slate-500 text-xs uppercase cursor-pointer" onClick={() => toggleSort('avgPrice')}>Preço Médio</th>
                <th className="pb-4 font-bold text-slate-500 text-xs uppercase cursor-pointer" onClick={() => toggleSort('salesGrowth')}>Crescimento</th>
                <th className="pb-4 font-bold text-slate-500 text-xs uppercase text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative overflow-hidden w-12 h-12 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                        <img src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={product.name} />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-xs font-bold text-slate-600 uppercase">{product.category}</td>
                  <td className="py-4 text-xs text-slate-600 font-black">{product.region}</td>
                  <td className="py-4 text-sm text-slate-900 font-bold">Kz {product.avgPrice.toLocaleString()}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-1">
                      <ArrowUpRight size={14} className="text-emerald-500" />
                      <span className="text-sm text-emerald-600 font-black">{product.salesGrowth}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => setModal({
                        title: `Análise: ${product.name}`,
                        body: <div className="space-y-4"><p className="text-slate-600">Analizando mercado competitivo para {product.name}...</p></div>
                      })}
                      className="p-2.5 bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white rounded-xl transition-all active:scale-90"
                    >
                      <TrendingUp size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
