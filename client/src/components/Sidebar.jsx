import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Users, Shield, LogOut, Hexagon } from 'lucide-react';

export default function Sidebar({ role, setRole }) {
  const location = useLocation();

  const allLinks = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5 mr-3" />, allowed: ['Management'] },
    { name: 'Master Setup', path: '/setup', icon: <Settings className="w-5 h-5 mr-3" />, allowed: ['Admin'] },
    { name: 'Applicants', path: '/applicants', icon: <Users className="w-5 h-5 mr-3" />, allowed: ['Officer'] }
  ];

  const visibleLinks = allLinks.filter(l => l.allowed.includes(role));

  return (
    <div className="w-72 bg-slate-900/50 backdrop-blur-3xl border-r border-slate-800/60 h-screen overflow-y-auto p-6 flex flex-col shadow-2xl relative z-20 shrink-0">
      <div className="flex flex-col items-center justify-center py-6 border-b border-indigo-500/20 mb-8 gap-3">
        <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2.5 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">
          <Hexagon className="w-8 h-8 text-white fill-white/20" />
        </div>
        <h1 className="text-xl font-black tracking-wide bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
          EDUMERGE BRS
        </h1>
      </div>

      <nav className="flex flex-col space-y-3 flex-1">
        {visibleLinks.map(link => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 font-semibold text-[15px] group ${
                isActive 
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-indigo-300 border border-indigo-500/30 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.2)]' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
              }`}
            >
              <span className={`transition-colors duration-300 ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400'}`}>
                {link.icon}
              </span>
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-slate-800/60">
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="bg-indigo-500/20 p-2.5 rounded-full mb-3 ring-1 ring-indigo-500/30">
            <Shield className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">Logged In As</p>
          <p className="text-sm font-black text-slate-200 mb-4 tracking-wide">
            {role === 'Officer' ? 'Admission Officer' : role === 'Admin' ? 'Administrator' : 'Management'}
          </p>
          <button 
            onClick={() => setRole(null)} 
            className="w-full flex items-center justify-center text-xs font-bold text-slate-300 hover:text-white bg-slate-700/50 hover:bg-red-500/80 py-2.5 rounded-xl transition-all duration-300 z-10 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:border-red-500/50 border border-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
