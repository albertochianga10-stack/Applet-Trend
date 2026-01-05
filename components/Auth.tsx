
import React, { useState } from 'react';
import { TrendingUp, Mail, Lock, ChevronRight, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Mock logic
      const role = email.includes('admin') ? 'admin' : 'merchant';
      onLogin({
        id: '1',
        name: email.split('@')[0],
        role: role as 'admin' | 'merchant',
        avatar: `https://picsum.photos/seed/${email}/100/100`
      });
    } else {
      setError('Por favor, preencha todos os campos.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl mb-4 shadow-lg shadow-amber-200">
            <TrendingUp className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Applemar Trend</h1>
          <p className="text-slate-500 mt-2">Plataforma Analítica do Mercado Nacional</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm animate-pulse">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3 text-slate-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                  placeholder="seu@email.co.ao"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 text-slate-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-amber-500 focus:ring-amber-500" />
                <span className="text-slate-600">Lembrar acesso</span>
              </label>
              <a href="#" className="text-amber-600 font-semibold hover:underline">Esqueceu a senha?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98]"
            >
              Entrar no Painel
              <ChevronRight size={20} />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Novo no Applemar Trend? {' '}
              <a href="#" className="text-amber-600 font-bold hover:underline">Solicitar Acesso</a>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          © {new Date().getFullYear()} Applemar Trend Analytics. Orgulhosamente feito para Angola.
        </p>
      </div>
    </div>
  );
};

export default Auth;
