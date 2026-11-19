import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Activity, Lock, Mail, User, ShieldCheck,
  AlertCircle, Eye, EyeOff, Building2, Loader2, Check
} from 'lucide-react';

export default function AuthPage() {
  const { login, register, authError, loading } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPass, setShowPass] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'citizen',
    department: ''
  });

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters required';
    if (mode === 'register' && !form.fullName.trim()) errs.fullName = 'Full name is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    if (mode === 'register') {
      await register({
        email: form.email,
        password: form.password,
        full_name: form.fullName,
        role: form.role,
        department: form.department || (form.role === 'admin' ? 'Operations' : 'Field Research')
      });
    } else {
      await login(form.email, form.password);
    }
  };

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    if (fieldErrors[key]) setFieldErrors(f => ({ ...f, [key]: undefined }));
  };

  const inputCls = (err) =>
    `w-full pl-9 pr-3 py-2.5 bg-[#09090B] border ${err ? 'border-red-500/70' : 'border-[#27272A]'} rounded-md text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-300 transition-colors`;

  return (
    <div className="min-h-screen bg-[#09090B] flex font-sans antialiased text-zinc-100">

      {/* LEFT BRAND PANEL (Linear/Vercel Aesthetic) */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[460px] flex-col justify-between bg-[#0D0D10] border-r border-[#27272A] p-10 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white text-zinc-950 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4 text-zinc-950" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white tracking-tight">
              EcoSphere
            </div>
            <div className="text-xs text-zinc-400">Environmental Intelligence</div>
          </div>
        </div>

        {/* Tagline block */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl xl:text-3xl font-semibold text-white leading-tight tracking-tight" style={{ textWrap: 'balance' }}>
              High-fidelity sensor telemetry & environmental analytics.
            </h1>
            <p className="text-zinc-400 text-sm mt-3.5 leading-relaxed" style={{ textWrap: 'pretty' }}>
              Precision environmental monitoring across 130 regional telemetry nodes. Real-time air and water analysis, automated anomaly detection, and logistics optimization.
            </p>
          </div>

          {/* Core capabilities */}
          <ul className="space-y-3">
            {[
              '130 continuous regional telemetry sensor nodes',
              'Deterministic AQI & WQI predictive forecasting',
              'Operational route optimization & telemetry benchmarks',
              'ISO 14064 & EPA CEMS compliance standard exports'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-zinc-200" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* System stamp */}
        <div className="text-xs text-zinc-400 font-mono">
          v2.5.0 · Platform Status: Operational
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">

          {/* Mobile brand header */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-md bg-white text-zinc-950 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-zinc-950" />
            </div>
            <span className="text-sm font-semibold text-white">EcoSphere</span>
          </div>

          <h2 className="text-xl font-semibold text-white mb-1 tracking-tight">
            {mode === 'login' ? 'Sign in to platform' : 'Create an account'}
          </h2>
          <p className="text-xs text-zinc-400 mb-6">
            {mode === 'login'
              ? 'Enter credentials to access telemetry operational console.'
              : 'Register to monitor regional sensor streams.'}
          </p>

          {/* Error banner */}
          {authError && (
            <div className="mb-5 p-3 rounded-md bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Dr. Priya Sharma"
                      value={form.fullName}
                      onChange={set('fullName')}
                      className={inputCls(fieldErrors.fullName)}
                    />
                  </div>
                  {fieldErrors.fullName && <p className="mt-1 text-xs text-red-400">{fieldErrors.fullName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Role</label>
                    <select
                      value={form.role}
                      onChange={set('role')}
                      className="w-full px-3 py-2.5 bg-[#09090B] border border-[#27272A] rounded-md text-xs text-white focus:outline-none focus:border-zinc-400 transition-colors"
                    >
                      <option value="citizen">Field Observer</option>
                      <option value="admin">Operations Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Affiliation</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Organization"
                        value={form.department}
                        onChange={set('department')}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#09090B] border border-[#27272A] rounded-md text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="name@organization.com"
                  value={form.email}
                  onChange={set('email')}
                  className={inputCls(fieldErrors.email)}
                />
              </div>
              {fieldErrors.email && <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  className={`${inputCls(fieldErrors.password)} pr-10`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-200 transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>}
            </div>

            {/* Premium Crisp White CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-md bg-white hover:bg-zinc-200 disabled:opacity-60 text-zinc-950 font-semibold text-xs tracking-tight transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-950" />
                  <span>Signing in…</span>
                </>
              ) : (
                mode === 'login' ? 'Sign in to Console' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center mt-5">
            {mode === 'login' ? (
              <p className="text-xs text-zinc-400">
                Don't have an account?{' '}
                <button
                  onClick={() => { setMode('register'); setFieldErrors({}); }}
                  className="text-white hover:underline underline-offset-4 font-medium transition-colors"
                >
                  Register
                </button>
              </p>
            ) : (
              <p className="text-xs text-zinc-400">
                Already registered?{' '}
                <button
                  onClick={() => { setMode('login'); setFieldErrors({}); }}
                  className="text-white hover:underline underline-offset-4 font-medium transition-colors"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
