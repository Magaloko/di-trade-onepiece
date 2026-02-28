import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User, Shield, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { demoLogin, adminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = 'E-Mail ist erforderlich';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Ungültige E-Mail-Adresse';
    if (!password) errs.password = 'Passwort ist erforderlich';
    else if (password.length < 6) errs.password = 'Mindestens 6 Zeichen';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsLoading(true);
    setTimeout(() => { demoLogin(); navigate('/'); }, 800);
  };

  const handleDemo = () => { demoLogin(); navigate('/'); };
  const handleAdmin = () => { adminLogin(); navigate('/admin'); };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${hasError ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '12px',
    color: '#e4e4e7',
    fontSize: '14px',
    outline: 'none',
  });

  return (
    <div
      className="min-h-screen grid lg:grid-cols-2"
      style={{ background: '#050508' }}
    >
      {/* ── Left panel: branding ─────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #12121a 0%, #1a0505 100%)' }}
      >
        {/* Glow orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(255,61,61,0.15) 0%, transparent 70%)' }}
        />

        <span
          className="font-orbitron font-black text-3xl relative"
          style={{ background: 'linear-gradient(135deg,#ff3d3d,#ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
        >
          DI-TRADE
        </span>

        <div className="relative">
          <h2 className="font-orbitron font-black text-4xl leading-tight mb-6" style={{ color: '#e4e4e7' }}>
            Deine Sammlung.<br />
            <span style={{ background: 'linear-gradient(135deg,#ffd700,#ffed4e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Dein Schatz.
            </span>
          </h2>
          <p className="text-base leading-relaxed" style={{ color: '#71717a', maxWidth: '380px' }}>
            Verwalte deine One Piece TCG Sammlung, tracke Preise in Echtzeit und schalte einzigartige Achievements frei.
          </p>

          {/* Feature list */}
          <ul className="mt-8 space-y-4">
            {[
              { icon: '🃏', text: 'Über 15.000 Karten in der Datenbank' },
              { icon: '📈', text: 'Echtzeit Preis-Tracking' },
              { icon: '🏆', text: 'Achievement-System für Sammler' },
              { icon: '🌟', text: 'Set-Fortschritt & Wishlist' },
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm" style={{ color: '#a1a1aa' }}>
                <span className="text-lg">{f.icon}</span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs relative" style={{ color: '#4a4a52' }}>
          © 2024 Di-Trade · One Piece © E. Oda/Shueisha, Bandai
        </p>
      </div>

      {/* ── Right panel: form ────────────────────────────── */}
      <div className="flex items-center justify-center px-6 py-16">
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Mobile logo */}
          <span
            className="lg:hidden font-orbitron font-black text-2xl block mb-8"
            style={{ background: 'linear-gradient(135deg,#ff3d3d,#ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >
            DI-TRADE
          </span>

          <h1 className="font-orbitron font-black text-3xl mb-2" style={{ color: '#e4e4e7' }}>Anmelden</h1>
          <p className="text-sm mb-8" style={{ color: '#71717a' }}>Willkommen zurück bei Di-Trade</p>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#a1a1aa' }}>
                E-Mail
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                placeholder="deine@email.de"
                style={inputStyle(!!errors.email)}
                onFocus={e => (e.target.style.borderColor = '#ff3d3d')}
                onBlur={e => (e.target.style.borderColor = errors.email ? '#ef4444' : 'rgba(255,255,255,0.1)')}
              />
              {errors.email && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#a1a1aa' }}>
                Passwort
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }}
                  placeholder="••••••••"
                  style={{ ...inputStyle(!!errors.password), paddingRight: '44px' }}
                  onFocus={e => (e.target.style.borderColor = '#ff3d3d')}
                  onBlur={e => (e.target.style.borderColor = errors.password ? '#ef4444' : 'rgba(255,255,255,0.1)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent"
                  style={{ color: '#71717a' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold cursor-pointer border-0 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,#ff3d3d,#ff6b6b)', color: '#fff', boxShadow: '0 4px 15px rgba(255,61,61,0.4)' }}
            >
              {isLoading ? 'Anmelden...' : 'Anmelden'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs uppercase" style={{ background: '#050508', color: '#4a4a52' }}>oder</span>
            </div>
          </div>

          {/* Quick access */}
          <div className="space-y-3">
            <button
              onClick={handleDemo}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold cursor-pointer border-0 transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#e4e4e7', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <User className="w-4 h-4" /> Demo-Account
            </button>
            <button
              onClick={handleAdmin}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold cursor-pointer border-0 transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,215,0,0.05)', color: '#ffd700', border: '1px solid rgba(255,215,0,0.2)' }}
            >
              <Shield className="w-4 h-4" /> Admin-Dashboard
            </button>
          </div>

          <p className="text-center text-sm mt-6" style={{ color: '#71717a' }}>
            Noch kein Account?{' '}
            <span className="cursor-pointer font-semibold" style={{ color: '#ff3d3d' }}>
              Jetzt registrieren
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
