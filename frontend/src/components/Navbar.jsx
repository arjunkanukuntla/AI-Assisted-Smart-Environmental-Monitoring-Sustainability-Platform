import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Shield,
  LogOut,
  ChevronDown,
  Menu,
  X,
  User
} from 'lucide-react';

export default function Navbar({
  activeTab = 'home',
  setActiveTab,
  stationsCount = 130
}) {
  const { user, isAdmin, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'map', label: 'Live Map' },
    { id: 'stations', label: 'Stations' },
    { id: 'analytics', label: 'Forecasts' },
    { id: 'optimization', label: 'Route Planner' },
    { id: 'incidents', label: 'Report Issue' },
    { id: 'docs', label: 'Docs' }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#09090B] border-b border-[#27272A] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

        {/* Left: Brand Identity */}
        <div className="flex items-center gap-5 shrink-0">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-7 h-7 rounded-md bg-white text-zinc-950 flex items-center justify-center font-bold text-xs">
              ES
            </div>
            <div>
              <span className="text-sm font-semibold text-white block leading-tight">
                EcoSphere
              </span>
              <span className="text-xs text-zinc-400 block">
                Environmental Monitor
              </span>
            </div>
          </button>

          {/* Platform Status */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#18181B] border border-[#27272A] text-xs text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{stationsCount} stations online</span>
          </div>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((item) => {
            const isSelected = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Auth & Admin Actions */}
        <div className="flex items-center gap-2.5 shrink-0">

          {/* Admin Panel button if signed in as Admin */}
          {user && isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                activeTab === 'admin'
                  ? 'bg-zinc-800 text-white border-zinc-600'
                  : 'bg-[#18181B] text-zinc-300 border-[#27272A] hover:bg-zinc-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-zinc-300" />
              <span>Admin Console</span>
            </button>
          )}

          {/* ── Role pill: visible to everyone so RBAC is obvious ── */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-md hover:bg-zinc-800 border border-transparent hover:border-[#27272A] transition-colors"
                aria-label="User Account Menu"
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-md border flex items-center justify-center shrink-0 ${
                  isAdmin ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-sky-500/20 border-sky-500/30'
                }`}>
                  <span className="text-xs font-semibold text-white">
                    {(user.full_name || user.email || 'U')[0].toUpperCase()}
                  </span>
                </div>

                {/* Name + role pill */}
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-medium text-white max-w-[100px] truncate leading-tight">
                    {user.full_name || user.email}
                  </div>
                  <div className={`text-[11px] font-semibold leading-tight ${
                    isAdmin ? 'text-emerald-400' : 'text-sky-400'
                  }`}>
                    {isAdmin ? '🛡 Administrator' : '👤 Citizen'}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Flyout */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#121215] border border-[#27272A] rounded-lg shadow-2xl overflow-hidden z-50">
                  <div className="p-3 border-b border-[#27272A] bg-[#09090B]">
                    <div className="text-xs font-semibold text-white truncate">{user.full_name || user.email}</div>
                    <div className="text-xs text-zinc-400 truncate mt-0.5">{user.email}</div>
                    {/* Prominent role badge */}
                    <span className={`inline-flex items-center gap-1.5 mt-2 text-xs px-2.5 py-1 rounded-md font-semibold ${
                      isAdmin
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                    }`}>
                      {isAdmin ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {isAdmin ? 'System Administrator' : 'Public Citizen'}
                    </span>
                    {isAdmin && (
                      <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                        Full access: station provisioning, incident triage, IoT controls.
                      </p>
                    )}
                  </div>
                  <div className="p-1 space-y-0.5">
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('admin');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-zinc-200 hover:text-white hover:bg-zinc-800 transition-colors text-left"
                      >
                        <Shield className="w-3.5 h-3.5 text-zinc-400" />
                        Admin Console
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNavClick('map');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-zinc-200 hover:text-white hover:bg-zinc-800 transition-colors text-left"
                    >
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      Live Station Map
                    </button>
                    <div className="border-t border-[#27272A] my-1"></div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={openAuthModal}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 border border-[#27272A] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('map')}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
              >
                Open Map
              </button>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#27272A] bg-[#0D0D10] px-4 py-3 space-y-1">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-3 py-2 rounded-md text-xs font-medium text-amber-400 hover:bg-zinc-900"
            >
              Admin Console
            </button>
          )}
        </div>
      )}
    </header>
  );
}
