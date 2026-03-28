import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Users, Save, CheckCircle, Shield, AlertTriangle, Fingerprint } from 'lucide-react';

export default function ApplicantManagement() {
  const [applicants, setApplicants] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', dob: '', 
    gender: 'Male', category: 'GM', entryType: 'Regular', marks: '', 
    programApplied: '', quotaType: 'KCET', allotmentNumber: ''
  });

  const API_BASE = import.meta.env.VITE_API_URL || 'https://edumegre-crm.onrender.com';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, progRes] = await Promise.all([
        axios.get(`${API_BASE}/api/applicants`),
        axios.get(`${API_BASE}/api/programs`)
      ]);
      setApplicants(appRes.data);
      setPrograms(progRes.data);
      if (progRes.data.length > 0 && !formData.programApplied) {
        setFormData(prev => ({ ...prev, programApplied: progRes.data[0]._id }));
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    axios.post(`${API_BASE}/api/applicants`, formData)
      .then(() => {
        alert("Applicant Generated Successfully");
        fetchData();
        setFormData({ ...formData, firstName: '', lastName: '', email: '', phone: '', marks: '', allotmentNumber: '' });
      })
      .catch(err => alert("Error: " + (err.response?.data?.msg || err.message)))
      .finally(() => setSubmitting(false));
  };

  const handleUpdateStatus = (id, field, value) => {
    axios.put(`${API_BASE}/api/applicants/${id}`, { [field]: value })
      .then(() => fetchData())
      .catch(err => alert("Update Failure"));
  };

  const handleAllocate = (id) => {
    axios.put(`${API_BASE}/api/applicants/${id}/allocate`)
      .then(() => { alert("Seat Allocated Successfully"); fetchData(); })
      .catch(err => alert("Allocation Failure: " + (err.response?.data?.msg || err.message)));
  };

  const handleConfirm = (id) => {
    axios.put(`${API_BASE}/api/applicants/${id}/confirm`)
      .then(res => { alert(`Admission Confirmed!\nAdmission Number: ${res.data.admissionNumber}`); fetchData(); })
      .catch(err => alert("Confirmation Failure: " + (err.response?.data?.msg || err.message)));
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
      <div className="flex flex-col mb-10 relative">
        <h2 className="text-4xl font-black bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-sm tracking-tight flex items-center">
          <Fingerprint className="w-10 h-10 mr-4 text-indigo-400 opacity-60" />
          Applicant Management
        </h2>
        <p className="text-slate-400 mt-2 font-medium tracking-widest uppercase text-xs ml-14">Process admitted applicants.</p>
        <div className="absolute top-0 right-0 w-[400px] h-[40px] bg-indigo-500/20 blur-[50px] -z-10 pointer-events-none mix-blend-screen"></div>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-2xl rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.4)] border border-slate-700/60 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700"></div>
        <div className="bg-slate-900/60 border-b border-slate-700/60 px-8 py-6 flex items-center">
          <div className="bg-indigo-500/20 p-2.5 rounded-xl border border-indigo-500/30 mr-4 shadow-inner">
            <UserPlus className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold tracking-widest uppercase text-slate-200">Create Applicant</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <InputField label="First Name" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            <InputField label="Last Name" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            <InputField label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <InputField label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <InputField label="Date of Birth" type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
            <InputField label="Marks (%)" type="number" step="0.01" value={formData.marks} onChange={(e) => setFormData({...formData, marks: e.target.value})} />
            
            <SelectField label="Gender" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} options={['Male', 'Female', 'Other']} />
            <SelectField label="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} options={['GM', 'SC', 'ST', 'OBC', 'Other']} />
            <SelectField label="Entry Type" value={formData.entryType} onChange={(e) => setFormData({...formData, entryType: e.target.value})} options={['Regular', 'Lateral']} />
            <SelectField label="Quota Type" value={formData.quotaType} onChange={(e) => setFormData({...formData, quotaType: e.target.value})} options={['KCET', 'COMEDK', 'Management', 'Supernumerary']} />
            
            <div className="flex flex-col md:col-span-2 group/select">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Apply For Program</label>
              <select required value={formData.programApplied} onChange={(e) => setFormData({...formData, programApplied: e.target.value})} className="px-5 py-3.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 text-slate-200 tracking-wider shadow-inner font-bold uppercase text-xs appearance-none">
                {programs.map(p => <option className="bg-slate-800" key={p._id} value={p._id}>{p.programName} ━ {p.institution}</option>)}
              </select>
            </div>
            {['KCET', 'COMEDK'].includes(formData.quotaType) && (
              <InputField label="Allotment Number" glow="true" value={formData.allotmentNumber} onChange={(e) => setFormData({...formData, allotmentNumber: e.target.value})} />
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={submitting || programs.length === 0} className="relative group overflow-hidden bg-transparent border border-indigo-500/50 hover:border-indigo-400 text-indigo-300 font-bold py-3.5 px-8 rounded-2xl flex items-center transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] uppercase tracking-widest text-[13px] disabled:opacity-50 disabled:cursor-not-allowed">
              <div className="absolute inset-0 w-0 bg-indigo-500/20 group-hover:w-full transition-all duration-700 ease-out"></div>
              <Save className="w-4 h-4 mr-3 relative z-10" />
              <span className="relative z-10">{submitting ? 'PROCESSING...' : 'REGISTER APPLICANT'}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-2xl rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.4)] border border-slate-700/60 overflow-hidden relative">
        <div className="bg-slate-900/60 border-b border-slate-700/60 px-8 py-6 flex items-center">
          <div className="bg-purple-500/20 p-2.5 rounded-xl border border-purple-500/30 mr-4 shadow-inner">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold tracking-widest uppercase text-slate-200">Applicant Queue</h3>
        </div>
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0b1021]/80 text-slate-400 font-bold uppercase tracking-widest text-[10px] border-b border-slate-700/80">
              <tr>
                <th className="px-8 py-5">Applicant Details</th>
                <th className="px-8 py-5">Program & Quota</th>
                <th className="px-8 py-5 text-center">Docs Status</th>
                <th className="px-8 py-5 text-center">Fee Status</th>
                <th className="px-8 py-5 text-center">Allocation</th>
                <th className="px-8 py-5 text-center">Final State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-300 font-medium">
              {applicants.map(app => (
                <tr key={app._id} className="hover:bg-slate-800/50 transition-colors duration-300 group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-200 text-base">{app.firstName} {app.lastName}</span>
                      <span className="text-xs text-slate-500 tracking-wider font-mono">{app.email}</span>
                      {app.admissionNumber && <span className="text-[11px] font-mono font-black text-emerald-400 mt-2 bg-emerald-500/10 border border-emerald-500/30 w-fit px-2 py-0.5 rounded shadow-[0_0_10px_rgba(16,185,129,0.2)]">{app.admissionNumber}</span>}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-indigo-400 uppercase tracking-widest text-xs mb-1">{app.programApplied?.programName}</span>
                      <span className="text-[9px] font-black tracking-widest bg-slate-900 border border-slate-700 text-slate-400 px-2 py-1 rounded inline-flex w-fit shadow-inner">{app.quotaType}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <select 
                      value={app.documentStatus} 
                      onChange={(e) => handleUpdateStatus(app._id, 'documentStatus', e.target.value)}
                      disabled={app.admissionStatus === 'Confirmed'}
                      className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none cursor-pointer appearance-none text-center shadow-inner transition-colors border ${app.documentStatus === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-700 hover:border-slate-500'}`}
                    >
                      <option className="bg-slate-900" value="Pending">PENDING</option>
                      <option className="bg-slate-900" value="Verified">VERIFIED</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <select 
                      value={app.feeStatus} 
                      onChange={(e) => handleUpdateStatus(app._id, 'feeStatus', e.target.value)}
                      disabled={app.admissionStatus === 'Confirmed'}
                      className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none cursor-pointer appearance-none text-center shadow-inner transition-colors border ${app.feeStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}
                    >
                      <option className="bg-slate-900" value="Pending">PENDING</option>
                      <option className="bg-slate-900" value="Paid">PAID</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-center">
                    {app.admissionStatus === 'Pending' ? (
                      <div className="flex flex-col items-center">
                        {(() => {
                          const quotaInfo = app.programApplied?.quotas?.find(q => q.quotaName === app.quotaType);
                          const remaining = quotaInfo ? (quotaInfo.assignedSeats - quotaInfo.filledSeats) : 0;
                          const isFull = remaining <= 0;
                          return (
                            <>
                              <button 
                                onClick={() => handleAllocate(app._id)} 
                                disabled={isFull}
                                className={`font-black uppercase tracking-widest px-4 py-2 rounded-xl text-[10px] transition-all shadow-lg mb-2 relative overflow-hidden group/btn ${isFull ? 'bg-rose-950/30 text-rose-500 cursor-not-allowed border border-rose-500/30 line-through' : 'border border-indigo-500/50 hover:border-indigo-400 text-indigo-300 hover:text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]'}`}
                              >
                                {isFull ? '' : <div className="absolute inset-0 bg-indigo-500/20 w-0 group-hover/btn:w-full transition-all duration-500 ease-out z-0"></div>}
                                <span className="relative z-10">{isFull ? 'QUOTA FULL' : 'ALLOCATE SEAT'}</span>
                              </button>
                              <span className={`text-[9px] font-black tracking-widest bg-slate-900 border px-2 py-0.5 rounded shadow-inner ${isFull ? 'text-rose-500 border-rose-500/30 bg-rose-500/5' : 'text-amber-500 border-slate-700'}`}>
                                {isFull ? <span className="flex items-center"><AlertTriangle className="w-3 h-3 mr-1"/> BLOCK ACTIVE</span> : `${remaining} SEATS LEFT`}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <span className="text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)] flex items-center justify-center w-fit mx-auto"><Shield className="w-3 h-3 mr-1"/> {app.admissionStatus}</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-center">
                    {app.admissionStatus === 'Allocated' && app.feeStatus === 'Paid' && app.documentStatus === 'Verified' ? (
                      <button onClick={() => handleConfirm(app._id)} className="bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500/30 hover:border-emerald-400 text-emerald-400 font-black uppercase tracking-widest px-4 py-2 rounded-xl text-[10px] transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] animate-pulse hover:animate-none">
                        CONFIRM ADMISSION
                      </button>
                    ) : app.admissionStatus === 'Confirmed' ? (
                      <div className="flex items-center justify-center text-emerald-400 font-bold text-xs uppercase tracking-widest bg-emerald-500/5 px-3 py-1.5 border border-emerald-500/20 rounded-lg shadow-inner">
                        <CheckCircle className="w-4 h-4 mr-2" /> CONFIRMED
                      </div>
                    ) : (
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest border border-slate-700 px-2 py-1 rounded bg-slate-900">PENDING REQS</span>
                    )}
                  </td>
                </tr>
              ))}
              {applicants.length === 0 && <tr><td colSpan="6" className="p-12 text-center text-slate-500 font-bold tracking-widest uppercase text-xs">NO APPLICANTS YET</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, step, glow }) {
  return (
    <div className="flex flex-col group/input relative">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</label>
      <input type={type} step={step} value={value} onChange={onChange} required className={`px-5 py-3.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-slate-200 transition-all duration-300 shadow-inner font-medium ${glow ? 'focus:ring-purple-500/50 text-purple-300 border-purple-500/30 bg-purple-950/20' : 'focus:ring-indigo-500/50'}`} />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col group/input">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</label>
      <select value={value} onChange={onChange} className="px-5 py-3.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent text-slate-200 tracking-wider shadow-inner font-bold uppercase text-xs appearance-none transition-all duration-300">
        {options.map(opt => <option className="bg-slate-800" key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
