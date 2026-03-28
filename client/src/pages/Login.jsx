import { useState } from 'react';
import { Lock, User, ShieldAlert, Sparkles, Hexagon } from 'lucide-react';

export default function Login({ setRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (email === 'admin@edumerge.com' && password === 'admin123') setRole('Admin');
    else if (email === 'officer@edumerge.com' && password === 'officer123') setRole('Officer');
    else if (email === 'management@edumerge.com' && password === 'manage123') setRole('Management');
    else setError('Invalid email or password');
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col justify-center items-center py-12 px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Animated glow backgrounds */}
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen mix-blend-lighten animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen mix-blend-lighten animate-pulse duration-[12000ms]"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 flex flex-col items-center relative z-10">
        <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-4 rounded-3xl shadow-[0_0_40px_rgba(99,102,241,0.5)] mb-6 animate-bounce duration-[3000ms]">
          <Hexagon className="w-12 h-12 text-white fill-white/20" />
        </div>
        <h2 className="text-center text-4xl font-black tracking-tight bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm leading-tight">
          Edumerge Portal
        </h2>
        <p className="mt-3 text-center text-[15px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
          Sign In To Your Account <Sparkles className="w-4 h-4 text-indigo-400"/>
        </p>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in slide-in-from-bottom-8 duration-700 fade-in zoom-in-95">
        <div className="backdrop-blur-2xl bg-slate-900/60 py-10 px-6 sm:px-12 shadow-[0_8px_32px_rgba(0,0,0,0.5)] sm:rounded-[2rem] border border-slate-700/50 ring-1 ring-white/10">
          <form className="space-y-7" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Email address</label>
              <div className="relative rounded-xl group/input shadow-inner">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-indigo-400 text-slate-500">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950/80 text-white focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500 block w-full pl-12 sm:text-[15px] font-medium border border-slate-700/60 rounded-xl py-3.5 transition-all shadow-sm placeholder:text-slate-600 outline-none"
                  placeholder="admin@edumerge.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative rounded-xl group/input shadow-inner">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-indigo-400 text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-950/80 text-white focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500 block w-full pl-12 sm:text-[15px] font-medium border border-slate-700/60 rounded-xl py-3.5 transition-all shadow-sm placeholder:text-slate-600 outline-none tracking-widest"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-950/40 p-4 border border-red-500/30 backdrop-blur-md animate-pulse">
                <div className="flex items-center">
                  <ShieldAlert className="h-5 w-5 text-red-400 mr-3" />
                  <h3 className="text-sm font-semibold text-red-300 tracking-wide">{error}</h3>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full relative group overflow-hidden flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-[15px] font-bold text-white transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.7)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 tracking-wider">SIGN IN</span>
              </button>
            </div>
          </form>

          <div className="mt-10 border-t border-slate-800/80 pt-8 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest border border-slate-800 rounded-full">Demo Credentials</span>
            <div className="space-y-3 mt-4">
              <DemoCard label="ADMIN" sub="System Setup" user="admin@edumerge.com" pass="admin123" />
              <DemoCard label="OFFICER" sub="Admissions" user="officer@edumerge.com" pass="officer123" />
              <DemoCard label="MANAGEMENT" sub="Dashboard View" user="management@edumerge.com" pass="manage123" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoCard({label, sub, user, pass}) {
  return (
    <div className="flex justify-between items-center bg-slate-950/50 p-3 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors group">
      <div>
        <p className="text-xs font-black text-indigo-400 tracking-widest uppercase">{label}</p>
        <p className="text-[10px] text-slate-500 font-bold uppercase">{sub}</p>
      </div>
      <div className="text-right">
        <p className="text-xs font-semibold text-slate-200">{user}</p>
        <p className="text-[10px] font-mono text-slate-500 mt-0.5">{pass}</p>
      </div>
    </div>
  )
}
