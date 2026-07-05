import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { apiRequest } from '../lib/api';

// Hapus interface LoginProps
export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hapus tipe : React.FormEvent pada parameter 'e'
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      localStorage.setItem('flinders_auth', result.token || 'true');
      onLogin();
    } catch (error) {
      setError(error.message || 'Username atau password salah.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">
      {/* ... (Sisa kode UI di bawahnya sama persis seperti sebelumnya) ... */}
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#2E6A67] px-8 py-10 flex flex-col items-center justify-center">
            <img src="/logo.png" alt="Logo Flinders Cafe" className="w-36 h-auto object-contain drop-shadow-lg" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 flex flex-col gap-5">
            <h2 className="text-center text-lg font-bold text-gray-700 mb-2">Login admin flinders</h2>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                data-testid="input-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                autoComplete="username"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2E6A67] focus:ring-1 focus:ring-[#2E6A67] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  data-testid="input-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2E6A67] focus:ring-1 focus:ring-[#2E6A67] transition pr-11"
                />
                <button
                  type="button"
                  data-testid="btn-toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end -mt-2">
              <a href="#" className="text-xs font-semibold text-[#2E6A67] hover:underline">
                Forgot Password
              </a>
            </div>

            {error && (
              <p data-testid="text-login-error" className="text-red-500 text-xs font-medium -mt-2 px-1 text-center">
                {error}
              </p>
            )}

            <button
              data-testid="btn-login"
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-[#2E6A67] text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-[#255856] shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <LogIn size={18} />
              {loading ? 'Memverifikasi...' : 'sign in'}
            </button>
          </form>
          
          <div className="bg-gray-50 py-4 text-center border-t border-gray-100">
            <a href="#" className="text-xs font-medium text-gray-500 hover:text-[#2E6A67] hover:underline transition">
              not registered yet? sign up here
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 font-medium tracking-wide">
          Flinders Cafe &copy; 2026
        </p>
      </div>
    </div>
  );
}
