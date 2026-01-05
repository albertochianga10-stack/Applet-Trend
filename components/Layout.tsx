
import React, { useState } from 'react';
import { 
  Home, 
  BarChart3, 
  Package, 
  FileText, 
  Settings, 
  Bell, 
  Search,
  LogOut,
  User as UserIcon,
  TrendingUp,
  X
} from 'lucide-react';
import { User, Notification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: Notification[];
  onMarkRead: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeTab, setActiveTab, searchQuery, setSearchQuery, notifications, onMarkRead }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'trends', label: 'Tendências', icon: BarChart3 },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'reports', label: 'Relatórios', icon: FileText },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white p-6 shadow-2xl z-50">
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <TrendingUp className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Applemar Trend</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id 
                  ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/20 translate-x-1' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600">
              {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <UserIcon size={20} />}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center bg-slate-100 rounded-xl px-4 py-2 w-full max-w-md focus-within:ring-2 focus-within:ring-amber-500/30 transition-all border border-transparent focus-within:border-amber-200 focus-within:bg-white">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar mercado..." 
              className="bg-transparent border-none outline-none ml-2 text-sm w-full font-medium text-slate-700"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) onMarkRead();
                }}
                className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all active:scale-90"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Tray */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h4 className="font-bold text-slate-900 text-sm">Notificações</h4>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div key={n.id} className={`px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${!n.read ? 'bg-amber-50/30' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{n.title}</p>
                            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{n.message}</p>
                            <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="px-4 py-8 text-center text-slate-400 text-xs">Sem notificações no momento.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="md:hidden">
              <img src={user?.avatar || 'https://picsum.photos/seed/user/32/32'} className="w-10 h-10 rounded-full cursor-pointer border-2 border-slate-100" alt="User" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
          {children}
        </div>

        {/* Bottom Nav Mobile */}
        <nav className="md:hidden bg-white/80 backdrop-blur-md border-t border-slate-200 px-6 py-3 flex justify-between items-center shadow-lg sticky bottom-0 z-40">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 transition-all ${
                activeTab === item.id ? 'text-amber-500 scale-110' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Layout;
