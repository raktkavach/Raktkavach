import React, { useState } from 'react';

export default function GatewayPage() {
  const [authMode, setAuthMode] = useState<'phone' | 'aadhar'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'phone' && (!phoneNumber || !password)) {
      alert('कृपया अपना मोबाइल नंबर और पासवर्ड दर्ज करें।');
      return;
    }
    if (authMode === 'aadhar' && (!aadharNumber || !password)) {
      alert('कृपया आधार नंबर और पासवर्ड दर्ज करें।');
      return;
    }
    // सफल प्रवेश होने पर डोनर डैशबोर्ड पर रीडायरेक्ट करें
    window.location.href = '/donor';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-4 py-8">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl">
        
        {/* हेडर */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-900/50 text-xl font-black">
            र
          </div>
          <h1 className="text-2xl font-black tracking-wide text-red-500">रक्त कवच</h1>
          <p className="text-xs text-slate-400 mt-1">डोनर प्रवेश (Donor Access Gateway)</p>
        </div>

        {/* मोड स्विच बटन */}
        <div className="flex bg-slate-800 p-1 rounded-xl mb-6">
          <button 
            type="button"
            onClick={() => setAuthMode('phone')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${authMode === 'phone' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
          >
            मोबाइल नंबर
          </button>
          <button 
            type="button"
            onClick={() => setAuthMode('aadhar')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${authMode === 'aadhar' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
          >
            आधार सत्यापन
          </button>
        </div>

        {/* लॉगिन फॉर्म */}
        <form onSubmit={handleLogin} className="space-y-4">
          {authMode === 'phone' ? (
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">मोबाइल नंबर</label>
              <input 
                type="tel" 
                placeholder="9050093930" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">आधार कार्ड नंबर (12 अंक)</label>
              <input 
                type="password" 
                maxLength={12}
                placeholder="•••• •••• ••••" 
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">पासवर्ड</label>
            <input 
              type="password" 
              placeholder="••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-red-950 mt-2 text-sm"
          >
            सुरक्षित प्रवेश करें
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[11px] text-slate-500">
            शून्य डेटा प्रतिधारण नीति • आधार टोकन प्रमाणीकरण
          </p>
        </div>
      </div>
    </div>
  );
}
