import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const expired = new URLSearchParams(location.search).get('expired');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        navigate('/', { replace: true });
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const field = 'w-full mt-1 text-sm border border-surface-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400';

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-100 p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center mb-3">
            <Sparkles size={26} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-surface-800">Salon Billing</h1>
          <p className="text-sm text-surface-400">Sign in to your account</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-xl border border-surface-100 shadow-card p-6 space-y-4">
          {expired && (
            <p className="text-xs bg-warning-50 text-warning-600 rounded-lg px-3 py-2">
              Your session expired. Please sign in again.
            </p>
          )}
          {error && (
            <p className="text-sm bg-danger-50 text-danger-600 rounded-lg px-3 py-2">{error}</p>
          )}

          <div>
            <label className="text-xs font-medium text-surface-500">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              required autoComplete="email" className={field} placeholder="you@salon.com" />
          </div>
          <div>
            <label className="text-xs font-medium text-surface-500">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required autoComplete="current-password" className={field} placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
            Sign in
          </button>
        </form>

        <p className="text-center text-xs text-surface-400 mt-5">Orrenza Salon Billing</p>
      </div>
    </div>
  );
}
