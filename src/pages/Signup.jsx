import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    companyName: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('הסיסמאות לא תואמות');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('הסיסמא חייבת להכיל לפחות 6 תווים');
      setIsLoading(false);
      return;
    }

    try {
      const response = await base44.auth.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        redirectUrl: window.location.origin
      });

      if (response) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'כשל ביצירת חשבון. נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await base44.auth.loginWithGoogle({
        redirectUrl: window.location.origin + '/dashboard'
      });
    } catch (err) {
      console.error('Google signup error:', err);
      setError('כשל בהרשמה דרך Google');
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V8.5m-8-5v5m5-5v5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ProFlow AI</h1>
          <p className="text-slate-400">צור חשבון חדש והתחל לנהל את העסק שלך</p>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
          <button type="button" onClick={handleGoogleSignup} disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg transition border border-gray-300 mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            הרשמה עם Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">או</span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">שם פרטי</label>
                <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-right" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">שם משפחה</label>
                <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-right" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">כתובת אימייל</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-right" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">סיסמא</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="........" required className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-right" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">אימות סיסמא</label>
              <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="........" required className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-right" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">שם חברה (אופציונלי)</label>
              <input name="companyName" type="text" value={formData.companyName} onChange={handleChange} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-right" />
            </div>

            {error && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {isLoading ? 'יוצר חשבון...' : 'צור חשבון'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">כבר יש לך חשבון?</span>
            </div>
          </div>

          <button type="button" onClick={handleBackToLogin} className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-lg transition border border-slate-600">
            כניסה
          </button>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">
          ביצירת חשבון, אתה מסכים לתנאי השירות ומדיניות הפרטיות
        </p>
      </div>
    </div>
  );
}
