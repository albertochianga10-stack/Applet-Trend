
import React, { useState, useEffect, useMemo } from 'react';
import { User, Product, Notification } from './types';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import { Package, Search, Filter, SlidersHorizontal, ArrowUp, ArrowDown, Info, AlertTriangle, X } from 'lucide-react';
import { MOCK_PRODUCTS, ANGOLA_REGIONS, CATEGORIES } from './constants';

const STORAGE_KEY = 'applemar_trend_user';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Alta de Preços', message: 'Os preços de Eletrônicos subiram 5% em Luanda.', time: '10 min ago', read: false, type: 'warning' },
    { id: '2', title: 'Nova Tendência', message: 'Painéis Solares estão em alta no Google Trends Angola.', time: '1h ago', read: false, type: 'info' }
  ]);
  const [modalContent, setModalContent] = useState<{ title: string; body: React.ReactNode } | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to parse saved user session", e);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      const timer = setTimeout(() => setLoading(false), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLogin = (u: User) => {
    try {
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      setActiveTab('dashboard');
    } catch (err) {
      setError("Erro ao salvar sessão local.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md border border-red-100">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">Ops! Algo correu mal</h1>
          <p className="text-slate-500 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">Recarregar</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Sincronizando Tendências Angola...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <Layout 
        user={user} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        notifications={notifications}
        onMarkRead={markAllRead}
      >
        {activeTab === 'dashboard' && <Dashboard searchQuery={searchQuery} setModal={setModalContent} />}
        {activeTab === 'trends' && <TrendsView searchQuery={searchQuery} setModal={setModalContent} />}
        {activeTab === 'products' && <ProductsView searchQuery={searchQuery} setModal={setModalContent} />}
        {activeTab === 'reports' && <Reports setModal={setModalContent} />}
      </Layout>

      {/* Global Modal System */}
      {modalContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">{modalContent.title}</h3>
              <button onClick={() => setModalContent(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {modalContent.body}
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setModalContent(null)} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TrendsView: React.FC<{ searchQuery: string; setModal: any }> = ({ searchQuery, setModal }) => {
  const categories = CATEGORIES;
  const filteredCats = categories.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

  const showCatDetail = (cat: string) => {
    setModal({
      title: `Tendências em ${cat}`,
      body: (
        <div className="space-y-4">
          <p className="text-slate-600">Analizando dados do Google Trends para {cat} em Angola...</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl">
              <p className="text-xs text-emerald-600 font-bold uppercase">Volume de Busca</p>
              <p className="text-2xl font-bold text-emerald-900">+45%</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl">
              <p className="text-xs text-amber-600 font-bold uppercase">Saturação</p>
              <p className="text-2xl font-bold text-amber-900">Baixa</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Neste momento, a categoria {cat} apresenta uma oportunidade de mercado significativa, especialmente nas províncias de Luanda e Benguela.
          </p>
        </div>
      )
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Análise de Tendências</h2>
        <div className="flex gap-2">
          <button onClick={() => alert('Filtros ativados')} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"><Filter size={20}/></button>
          <button onClick={() => alert('Visualização alterada')} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"><SlidersHorizontal size={20}/></button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCats.map(cat => (
          <div key={cat} onClick={() => showCatDetail(cat)} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:border-amber-200 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg">{cat}</h3>
              <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold flex items-center">
                <ArrowUp size={12} className="mr-1"/> +{Math.floor(Math.random() * 30) + 5}%
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-4">Aumento de interesse observado nas principais plataformas digitais de Angola.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>Interesse do Mercado</span>
                <span>{Math.floor(Math.random() * 40) + 60}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ProductsView: React.FC<{ searchQuery: string; setModal: any }> = ({ searchQuery, setModal }) => {
  const [selectedRegion, setSelectedRegion] = useState('Todas as Regiões');
  const [selectedCategory, setSelectedCategory] = useState('Todas as Categorias');

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'Todas as Regiões' || p.region === selectedRegion;
      const matchesCategory = selectedCategory === 'Todas as Categorias' || p.category === selectedCategory;
      return matchesSearch && matchesRegion && matchesCategory;
    });
  }, [searchQuery, selectedRegion, selectedCategory]);

  const showProductDetail = (p: Product) => {
    setModal({
      title: p.name,
      body: (
        <div className="flex flex-col md:flex-row gap-6">
          <img src={p.image} className="w-full md:w-48 h-48 object-cover rounded-2xl shadow-md" alt={p.name} />
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold">{p.category}</span>
              <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold">{p.region}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">Kz {p.avgPrice.toLocaleString()}</p>
            <p className="text-sm text-slate-600">Este produto teve um crescimento de vendas de <strong>{p.salesGrowth}%</strong> no último mês. A pontuação de popularidade é de <strong>{p.popularityScore}/100</strong>.</p>
            <div className="flex gap-3">
              <button className="flex-1 bg-amber-500 text-white py-2 rounded-xl font-bold hover:bg-amber-600">Monitorar Preço</button>
              <button className="flex-1 border border-slate-200 py-2 rounded-xl font-bold hover:bg-slate-50">Ver Concorrentes</button>
            </div>
          </div>
        </div>
      )
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Catálogo de Produtos</h2>
        <div className="flex gap-2">
          <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500">
            <option>Todas as Regiões</option>
            {ANGOLA_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500">
            <option>Todas as Categorias</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} onClick={() => showProductDetail(product)} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
            <div className="relative h-48 overflow-hidden">
              <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm">{product.category}</div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-slate-900 mb-1 truncate">{product.name}</h4>
              <p className="text-xs text-slate-500 mb-3 flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full"></span>{product.region}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Kz {product.avgPrice.toLocaleString()}</span>
                <span className="text-xs font-bold text-emerald-600">+{product.salesGrowth}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
