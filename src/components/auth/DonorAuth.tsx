import React, { useState } from 'react';

interface DonorAuthProps {
  onLoginSuccess: (data: { type: string; identifier: string }) => void;
}

export const DonorAuth: React.FC<DonorAuthProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'phone' | 'aadhar'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'phone' && (!phoneNumber || !password)) {
      alert('कृपया मोबाइल नंबर और पासवर्ड दर्ज करें');
      return;
    }
    if (authMode === 'aadhar' && (!aadharNumber || !password)) {
      alert('कृपया आधार नंबर और पासवर्ड दर्ज करें');
      return;
    }
    onLoginSuccess({
      type: authMode,
      identifier: authMode === 'phone' ? phoneNumber : 'VERIFIED_AADHAAR_TOKEN'
    });
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl text-white my-8">
      <h2 className="text-xl font-bold text-center mb-4 text-red-500">रक्त कवच - डोनर लॉगिन</h2>
      
      <div className="flex bg-slate-800 p-1 rounded-xl mb-6">
        <button 
          type="button"
          onClick={() => setAuthMode('phone')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${authMode === 'phone' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
        >
          मोबाइल नंबर
        </button>
        <button 
          type="button"
          onClick={() => setAuthMode('aadhar')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${authMode === 'aadhar' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
        >
          आधार सत्यापन
        </button>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {authMode === 'phone' ? (
          <div>
            <label className="block text-xs text-slate-400 mb-1">मोबाइल नंबर</label>
            <input 
              type="tel" 
              placeholder="+91 9050093930" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs text-slate-400 mb-1">आधार कार्ड नंबर (12 अंक)</label>
            <input 
              type="password" 
              maxLength={12}
              placeholder="•••• •••• ••••" 
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>
        )}

        <div>
          <label className="block text-xs text-slate-400 mb-1">सुरक्षित पासवर्ड</label>
          <input 
            type="password" 
            placeholder="अपना पासवर्ड भरें" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition shadow-lg shadow-red-900/40"
        >
          सुरक्षित प्रवेश करें
        </button>
      </form>
    </div>
  );
};
