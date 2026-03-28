import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MasterSetup from './pages/MasterSetup';
import ApplicantManagement from './pages/ApplicantManagement';
import Login from './pages/Login';

function App() {
  const [role, setRole] = useState(null);

  if (!role) {
    return <Login setRole={setRole} />;
  }

  return (
    <Router>
      <div className="flex h-screen overflow-hidden text-slate-200 selection:bg-indigo-500/30">
        <Sidebar role={role} setRole={setRole} />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto relative z-10 w-full scroll-smooth">
          <div className="max-w-7xl mx-auto backdrop-blur-3xl bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 md:p-10 shadow-2xl relative min-h-full">
            <Routes>
              {role === 'Management' && <Route path="/" element={<Dashboard />} />}
              {role === 'Admin' && <Route path="/setup" element={<MasterSetup />} />}
              {role === 'Officer' && <Route path="/applicants" element={<ApplicantManagement />} />}
              
              <Route path="*" element={
                <Navigate to={
                  role === 'Admin' ? '/setup' : 
                  role === 'Officer' ? '/applicants' : '/'
                } replace />
              } />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
