import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    axios.get(`${API_BASE}/api/dashboard`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div className="flex h-full min-h-[500px] items-center justify-center"><Loader2 className="animate-spin w-12 h-12 text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col mb-10">
        <h2 className="text-4xl font-black bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-sm tracking-tight">Overview Dashboard</h2>
        <p className="text-slate-400 mt-2 font-medium tracking-wide">Seat and admission filling status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Intake Capacity" value={data.stats.totalIntake} icon={<Users className="w-8 h-8 text-indigo-400" />} color="from-indigo-500/10 to-transparent border-indigo-500/30" glow="shadow-[0_0_30px_rgba(99,102,241,0.1)]" />
        <StatCard title="Seats Filled" value={data.stats.totalFilled} icon={<CheckCircle className="w-8 h-8 text-emerald-400" />} color="from-emerald-500/10 to-transparent border-emerald-500/30" glow="shadow-[0_0_30px_rgba(16,185,129,0.1)]" />
        <StatCard title="Remaining Seats" value={data.stats.totalAvailable} icon={<Clock className="w-8 h-8 text-amber-400" />} color="from-amber-500/10 to-transparent border-amber-500/30" glow="shadow-[0_0_30px_rgba(245,158,11,0.1)]" />
        <StatCard title="Pending Fees/Docs" value={data.stats.pendingFees + data.stats.pendingDocs} icon={<AlertCircle className="w-8 h-8 text-rose-400" />} color="from-rose-500/10 to-transparent border-rose-500/30" glow="shadow-[0_0_30px_rgba(244,63,94,0.1)]" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">
        <div className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700/50 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
          <h3 className="text-xs font-black text-slate-400 tracking-[0.2em] mb-8 uppercase">Overall Quota Status</h3>
          <div className="space-y-6 relative z-10">
            {Object.entries(data.quotaStats).map(([qName, qData]) => {
              const perc = qData.total === 0 ? 0 : (qData.filled / qData.total) * 100;
              return (
                <div key={qName} className="flex flex-col">
                  <div className="flex justify-between text-sm font-black mb-2 tracking-wider uppercase">
                    <span className="text-slate-200">{qName}</span>
                    <span className="text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">{qData.filled} / {qData.total}</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-700/50 overflow-hidden shadow-inner relative">
                    <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-[1500ms] shadow-[0_0_10px_rgba(99,102,241,0.6)] animate-pulse" style={{ width: `${perc}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700/50 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>
          <h3 className="text-xs font-black text-slate-400 tracking-[0.2em] mb-6 uppercase relative z-10">Program-wise Tracking</h3>
          <div className="overflow-x-auto relative z-10 w-full rounded-2xl border border-slate-700/50 shadow-inner bg-slate-900/50">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-700/80">
                <tr>
                  <th className="px-6 py-5">Program</th>
                  <th className="px-6 py-5">Intake</th>
                  <th className="px-6 py-5">Filled</th>
                  <th className="px-6 py-5">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {data.programWise.map(prog => (
                  <tr key={prog.id} className="hover:bg-slate-800/30 transition-colors duration-300">
                    <td className="px-6 py-5 font-bold text-slate-200">{prog.name}</td>
                    <td className="px-6 py-5 font-mono text-slate-400">{prog.intake}</td>
                    <td className="px-6 py-5 font-mono text-emerald-400 font-bold">{prog.filled}</td>
                    <td className="px-6 py-5 font-mono text-amber-400 font-bold">{prog.remaining}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, glow }) {
  return (
    <div className={`p-8 rounded-[2rem] bg-gradient-to-br bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 flex flex-col justify-between transition-all hover:-translate-y-2 duration-500 group relative overflow-hidden ${glow}`}>
      <div className={`absolute inset-0 bg-gradient-to-br opacity-50 ${color} group-hover:opacity-100 transition-opacity duration-700`}></div>
      <div className="flex justify-between items-start relative z-10 mb-6">
        <div className="p-4 bg-slate-900/60 rounded-2xl shadow-inner border border-slate-700/50 group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
        <p className="text-5xl font-black text-slate-100 tracking-tighter drop-shadow-md">{value}</p>
      </div>
    </div>
  );
}
