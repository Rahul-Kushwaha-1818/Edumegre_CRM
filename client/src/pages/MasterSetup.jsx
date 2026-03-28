import { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, BookOpen, Loader2, Save, Hexagon } from 'lucide-react';

export default function MasterSetup() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    institution: '', campus: '', department: '', programName: '', programCode: '',
    academicYear: '2026', courseType: 'UG', entryType: 'Regular', admissionMode: 'Government',
    totalIntake: 0,
    quotas: [
      { quotaName: 'KCET', assignedSeats: 0 },
      { quotaName: 'COMEDK', assignedSeats: 0 },
      { quotaName: 'Management', assignedSeats: 0 },
      { quotaName: 'Supernumerary', assignedSeats: 0 }
    ]
  });

  const API_BASE = import.meta.env.VITE_API_URL || 'https://edumegre-crm.onrender.com';

  const fetchPrograms = () => {
    setLoading(true);
    axios.get(`${API_BASE}/api/programs`)
      .then(res => { setPrograms(res.data); setLoading(false); })
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchPrograms(); }, []);

  const handleQuotaChange = (index, value) => {
    const newQuotas = [...formData.quotas];
    newQuotas[index].assignedSeats = parseInt(value) || 0;
    setFormData({ ...formData, quotas: newQuotas });
  };

  const calculateStandardQuotas = () => {
    return formData.quotas.reduce((sum, q) => q.quotaName !== 'Supernumerary' ? sum + q.assignedSeats : sum, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (calculateStandardQuotas() !== parseInt(formData.totalIntake)) {
      alert("Error: Total base quota must exactly equal Total Intake!");
      return;
    }
    axios.post(`${API_BASE}/api/programs`, formData)
      .then(() => {
        alert("Program Created Successfully");
        fetchPrograms();
      })
      .catch(err => alert("Error: " + err.response?.data?.msg));
  };

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
      <div className="flex flex-col mb-10">
        <h2 className="text-4xl font-black bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-sm tracking-tight flex items-center">
          <SettingsIcon className="w-10 h-10 mr-4 text-indigo-400 opacity-60 animate-[spin_10s_linear_infinite]" />
          Master Setup
        </h2>
        <p className="text-slate-400 mt-2 font-medium tracking-wide uppercase text-xs ml-14">Configure programs and quotas.</p>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-2xl rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.4)] border border-slate-700/60 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-screen"></div>
        <div className="bg-slate-900/60 border-b border-slate-700/60 px-8 py-6 flex items-center">
          <div className="bg-indigo-500/20 p-2.5 rounded-xl border border-indigo-500/30 mr-4 shadow-inner">
            <Building2 className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold tracking-widest uppercase text-slate-200">Create Program</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <InputField label="Institution" placeholder="e.g., MVIT" value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} />
            <InputField label="Campus" placeholder="e.g., North Campus" value={formData.campus} onChange={(e) => setFormData({...formData, campus: e.target.value})} />
            <InputField label="Department" placeholder="e.g., Computer Science" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
            <InputField label="Program / Branch" placeholder="e.g., B.E Computer Science" value={formData.programName} onChange={(e) => setFormData({...formData, programName: e.target.value})} />
            <InputField label="Program Code" placeholder="CSE" value={formData.programCode} onChange={(e) => setFormData({...formData, programCode: e.target.value})} />
            <InputField label="Academic Year" value={formData.academicYear} onChange={(e) => setFormData({...formData, academicYear: e.target.value})} />
            
            <SelectField label="Course Type" value={formData.courseType} onChange={(e) => setFormData({...formData, courseType: e.target.value})} options={['UG', 'PG']} />
            <SelectField label="Entry Type" value={formData.entryType} onChange={(e) => setFormData({...formData, entryType: e.target.value})} options={['Regular', 'Lateral']} />
            <SelectField label="Admission Mode" value={formData.admissionMode} onChange={(e) => setFormData({...formData, admissionMode: e.target.value})} options={['Government', 'Management']} />
            
            <div className="md:col-span-3 mt-6 p-8 bg-slate-900/80 rounded-3xl border border-slate-700/50 shadow-inner grid grid-cols-1 md:grid-cols-5 gap-6 items-end relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 group-hover:opacity-100 opacity-50 transition-opacity duration-700 pointer-events-none"></div>
              
              <InputField type="number" glow="from-emerald-500" label="Total Intake" value={formData.totalIntake} onChange={(e) => setFormData({...formData, totalIntake: e.target.value})} />
              
              {formData.quotas.map((q, idx) => (
                <InputField key={idx} type="number" label={`${q.quotaName} Quota`} value={q.assignedSeats} onChange={(e) => handleQuotaChange(idx, e.target.value)} />
              ))}
            </div>
            
            <div className="md:col-span-3 -mt-2">
              <div className={`p-4 rounded-2xl flex justify-between items-center text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-500 border shadow-2xl ${
                calculateStandardQuotas() === parseInt(formData.totalIntake) 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
              }`}>
                <span>Total Base Quota: {calculateStandardQuotas()}</span>
                <span>Target Intake: {formData.totalIntake}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button type="submit" className="relative group overflow-hidden bg-transparent border border-indigo-500/50 hover:border-indigo-400 text-indigo-300 font-bold py-3.5 px-8 rounded-2xl flex items-center transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] uppercase tracking-widest text-[13px]">
              <div className="absolute inset-0 w-0 bg-indigo-500/20 group-hover:w-full transition-all duration-700 ease-out"></div>
              <Save className="w-4 h-4 mr-3 relative z-10" />
              <span className="relative z-10">Save Program</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-2xl rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.4)] border border-slate-700/60 overflow-hidden relative">
        <div className="bg-slate-900/60 border-b border-slate-700/60 px-8 py-6 flex items-center">
          <div className="bg-purple-500/20 p-2.5 rounded-xl border border-purple-500/30 mr-4 shadow-inner">
            <BookOpen className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold tracking-widest uppercase text-slate-200">Configured Programs</h3>
        </div>
        
        {loading ? (
          <div className="flex h-[300px] justify-center items-center"><Loader2 className="animate-spin w-10 h-10 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" /></div>
        ) : (
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead className="bg-[#0b1021]/80 text-slate-400 font-black uppercase tracking-widest border-b border-slate-700/80">
                <tr>
                  <th className="px-8 py-5">Program Details</th>
                  <th className="px-8 py-5">Institution</th>
                  <th className="px-8 py-5 text-center">Total Intake</th>
                  <th className="px-8 py-5">Quotas Defined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {programs.map(p => (
                  <tr key={p._id} className="hover:bg-slate-800/50 transition-colors duration-300">
                    <td className="px-8 py-5 font-bold text-slate-200">{p.programName} <span className="text-indigo-400">({p.programCode})</span> <br/><span className="text-[10px] font-bold text-slate-500 tracking-widest">{p.courseType} • {p.entryType}</span></td>
                    <td className="px-8 py-5 font-semibold text-slate-300">{p.institution} | {p.campus} <br/><span className="text-[11px] font-black uppercase tracking-widest text-purple-400/80">{p.department}</span></td>
                    <td className="px-8 py-5 font-black text-2xl text-center text-slate-100 font-mono tracking-tighter">{p.totalIntake}</td>
                    <td className="px-8 py-5">
                      <div className="flex gap-2 flex-wrap">
                        {p.quotas.map(q => (
                          <span key={q._id} className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-inner">
                            <span className="text-slate-300">{q.quotaName}:</span> <span className="text-indigo-400">{q.assignedSeats}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {programs.length === 0 && <tr><td colSpan="4" className="p-12 text-center text-slate-500 font-bold tracking-widest uppercase">No Programs Configured</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder, glow="" }) {
  return (
    <div className="flex flex-col group/input relative">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</label>
      <input type={type} min="0" value={value} onChange={onChange} placeholder={placeholder} required className={`px-5 py-3.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 text-slate-200 transition-all duration-300 shadow-inner placeholder:text-slate-600 font-medium ${glow === 'from-emerald-500' ? 'focus:ring-emerald-500/50 focus:border-emerald-400 text-emerald-300 bg-emerald-950/20 border-emerald-900/50' : ''}`} />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col group/input relative">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</label>
      <div className="relative">
        <select value={value} onChange={onChange} className="w-full px-5 py-3.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 text-slate-200 transition-all duration-300 shadow-inner appearance-none font-bold uppercase tracking-wider text-xs">
          {options.map(opt => <option key={opt} value={opt} className="bg-slate-800">{opt}</option>)}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-500">
          <Hexagon className="w-4 h-4 shrink-0 transition-transform group-focus-within/input:rotate-90 duration-500"/>
        </div>
      </div>
    </div>
  );
}

function SettingsIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  )
}
