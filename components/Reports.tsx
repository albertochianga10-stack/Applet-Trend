
import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter, Share2, Plus, TrendingUp, Check, Loader2 } from 'lucide-react';
import { Report } from '../types';

interface ReportsProps {
  setModal: (content: any) => void;
}

const Reports: React.FC<ReportsProps> = ({ setModal }) => {
  const [schedules, setSchedules] = useState([
    { id: '1', title: 'Resumo Semanal', desc: 'Toda Segunda, 08:00', active: true },
    { id: '2', title: 'Alertas de Tendência', desc: 'Em tempo real', active: true }
  ]);

  const [reports, setReports] = useState<Report[]>([
    { id: '1', title: 'Relatório Trimestral Q3 2024', date: '15 Out, 2024', type: 'PDF', size: '2.4 MB' },
    { id: '2', title: 'Análise de Preços: Luanda vs Benguela', date: '10 Out, 2024', type: 'EXCEL', size: '840 KB' },
    { id: '3', title: 'Tendências de Consumo Eletrônicos', date: '05 Out, 2024', type: 'PDF', size: '1.2 MB' },
  ]);

  const [isCreating, setIsCreating] = useState(false);

  const handleToggle = (id: string) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleDownload = (report: Report) => {
    // Simulate real download by creating a fake blob
    const element = document.createElement("a");
    const file = new Blob([`Applemar Report: ${report.title}\nDate: ${report.date}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${report.title}.${report.type.toLowerCase()}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = (title: string) => {
    navigator.clipboard.writeText(`https://applemar.trend/reports/shared/${Math.random().toString(36).substr(2, 9)}`);
    alert(`Link para "${title}" copiado para área de transferência!`);
  };

  const createNewReport = () => {
    setIsCreating(true);
    setTimeout(() => {
      const newReport: Report = {
        id: Math.random().toString(),
        title: 'Relatório Customizado ' + (reports.length + 1),
        date: 'Hoje',
        type: 'PDF',
        size: '1.5 MB'
      };
      setReports([newReport, ...reports]);
      setIsCreating(false);
      setModal({
        title: "Relatório Gerado",
        body: <div className="text-center p-6"><Check size={48} className="text-emerald-500 mx-auto mb-4" /><p className="font-bold">Seu relatório foi gerado e adicionado à lista.</p></div>
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Centro de Relatórios</h2>
          <p className="text-slate-500">Gere e baixe análises detalhadas do mercado angolano.</p>
        </div>
        <button 
          onClick={createNewReport}
          disabled={isCreating}
          className="bg-amber-500 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 active:scale-95 disabled:opacity-50"
        >
          {isCreating ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
          Novo Relatório
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className="flex-1 flex items-center gap-2 text-slate-400">
              <Calendar size={18} />
              <input type="text" defaultValue="Últimos 30 dias" className="text-sm font-bold outline-none bg-transparent w-full text-slate-700" />
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <button className="flex items-center gap-2 text-xs font-black uppercase text-slate-600 hover:text-amber-600 transition-colors">
              <Filter size={16} />
              Filtros
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-amber-200 transition-all shadow-sm hover:shadow-xl">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl shadow-sm ${report.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{report.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{report.date}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="text-[10px] font-black text-amber-500">{report.type}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="text-[10px] font-bold text-slate-400">{report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleShare(report.title)}
                    className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <Share2 size={20} />
                  </button>
                  <button 
                    onClick={() => handleDownload(report)}
                    className="p-3 bg-slate-50 text-slate-600 hover:bg-amber-500 hover:text-white rounded-xl transition-all shadow-sm"
                  >
                    <Download size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Agendamentos</h3>
            <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">Configurações automáticas de entrega via e-mail corporativo.</p>
            <div className="space-y-4">
              {schedules.map(schedule => (
                <div key={schedule.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{schedule.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{schedule.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleToggle(schedule.id)}
                    className={`w-12 h-7 rounded-full relative transition-colors duration-300 shadow-inner ${schedule.active ? 'bg-amber-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${schedule.active ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>
              ))}
            </div>
            <button 
              onClick={() => {
                const id = Math.random().toString();
                setSchedules([...schedules, { id, title: 'Novo Alerta', desc: 'Customizado', active: true }]);
              }}
              className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase hover:border-amber-300 hover:text-amber-600 transition-all active:scale-98"
            >
              + Adicionar Alerta
            </button>
          </div>

          <div className="bg-amber-500 p-6 rounded-3xl text-white shadow-2xl shadow-amber-500/30 group">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <TrendingUp size={20} className="group-hover:translate-x-1 transition-transform" />
              Insights Pro
            </h3>
            <p className="text-xs font-bold text-amber-50 opacity-90 leading-relaxed uppercase tracking-wide">
              Utilize exportações em CSV para integrar com o PowerBI e visualizar mapas de calor por zona logística de Luanda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
