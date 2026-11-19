import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, Lock, Mail, User, ShieldCheck, Building2, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register, authError, loading } = useAuth();
  const [mode, setMode] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'citizen',
    department: ''
  });

  if (!isAuthModalOpen) return null;

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email address required';
    if (!form.password) errs.password = 'Password required';
    if (mode === 'register' && !form.fullName.trim()) errs.fullName = 'Your name is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});

    if (mode === 'register') {
      await register({
        email: form.email,
        password: form.password,
        full_name: form.fullName,
        role: form.role,
        department: form.department || (form.role === 'admin' ? 'Operations Core' : 'Public Citizen')
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
    `w-full pl-9 pr-3 py-2.5 bg-[#09090B] border ${
      err ? 'border-red-500/70' : 'border-[#27272A]'
    } rounded-md text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-sans">
      <div className="relative w-full max-w-sm bg-[#121215] border border-[#27272A] rounded-xl overflow-hidden shadow-2xl">

        {/* Modal Header */}
        <div className="p-4 border-b border-[#27272A] flex items-center justify-between bg-[#0D0D10]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-white text-zinc-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4 text-zinc-950" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                {mode === 'login' ? 'Sign in to EcoSphere' : 'Create an account'}
              </h3>
              <p className="text-xs text-zinc-400">
                {mode === 'login' ? 'Use your account credentials below' : 'Join the environmental monitoring network'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error notification */}
        {authError && (
          <div className="mx-4 mt-4 p-2.5 rounded-md bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Quick role selector — only on login */}
        {mode === 'login' && (
          <div className="px-4 pt-4 space-y-1.5">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Sign in as:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {/* Admin preset */}
              <button
                type="button"
                onClick={() => {
                  setForm(f => ({ ...f, email: 'admin@ecosphere.gov', password: 'admin123' }));
                  setFieldErrors({});
                }}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  form.email === 'admin@ecosphere.gov'
                    ? 'bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/30'
                    : 'bg-[#09090B] border-[#27272A] hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin</span>
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  Add stations · manage incidents
                </div>
              </button>

              {/* Citizen preset */}
              <button
                type="button"
                onClick={() => {
                  setForm(f => ({ ...f, email: 'citizen@ecosphere.org', password: 'citizen123' }));
                  setFieldErrors({});
                }}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  form.email === 'citizen@ecosphere.org'
                    ? 'bg-sky-500/10 border-sky-500/40 ring-1 ring-sky-500/30'
                    : 'bg-[#09090B] border-[#27272A] hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  <span>Citizen</span>
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  View air/water · report issues
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">

          {/* Full name — register only */}
          {mode === 'register' && (
            <div className="relative">
              <User className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Your full name"
                value={form.fullName}
                onChange={set('fullName')}
                className={inputCls(fieldErrors.fullName)}
                autoComplete="name"
              />
              {fieldErrors.fullName && (
                <p className="text-[11px] text-red-400 mt-1">{fieldErrors.fullName}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={set('email')}
              className={inputCls(fieldErrors.email)}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <p className="text-[11px] text-red-400 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={set('password')}
              className={`${inputCls(fieldErrors.password)} pr-9`}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
            >
              {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            {fieldErrors.password && (
              <p className="text-[11px] text-red-400 mt-1">{fieldErrors.password}</p>
            )}
          </div>

          {/* Role selector — register only */}
          {mode === 'register' && (
            <div className="relative">
              <Building2 className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
              <select
                value={form.role}
                onChange={set('role')}
                className="w-full pl-9 pr-3 py-2.5 bg-[#09090B] border border-[#27272A] rounded-md text-xs text-white focus:outline-none focus:border-zinc-400 transition-colors"
              >
                <option value="citizen">Public Citizen — view data & report issues</option>
                <option value="admin">Administrator — manage stations & incidents</option>
              </select>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-700" />}
            {loading ? 'Signing in…' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>

          {/* Mode switch */}
          <p className="text-center text-xs text-zinc-400">
            {mode === 'login' ? (
              <>
                No account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setFieldErrors({}); }}
                  className="text-white underline underline-offset-2 hover:no-underline"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setFieldErrors({}); }}
                  className="text-white underline underline-offset-2 hover:no-underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
