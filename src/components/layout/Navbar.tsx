'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Home, Search, ShieldCheck, MapPin, AlertCircle, PackageCheck, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'resident', label: 'Resident Portal', icon: Home },
    { id: 'categorizer', label: 'Smart Categorizer', icon: Search },
    { id: 'fleet', label: 'Fleet Radar', icon: MapPin },
    { id: 'complaints', label: 'Report Issue', icon: AlertCircle },
    { id: 'admin', label: 'Municipal Admin', icon: ShieldCheck },
    { id: 'driver', label: 'Driver View', icon: Truck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-green-800 via-green-700 to-emerald-700 text-white shadow-lg backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('resident')}>
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm border border-white/30">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                CleanCarbon<span className="text-green-200">Tracks</span>
              </h1>
              <p className="text-xs text-green-100 font-medium">Modular Municipal Waste & Telematics Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <nav className="hidden md:flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-green-800 shadow-md'
                        : 'text-green-50 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-green-700' : 'text-green-200'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Quick Standalone Engines Dropdown / Pill */}
            <div className="hidden lg:flex items-center gap-1 bg-green-900/60 p-1 rounded-xl border border-green-500/30 text-xs">
              <span className="text-green-300 font-bold px-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Modules:
              </span>
              <Link
                href="/modules/categorizer"
                className="px-2.5 py-1 rounded-lg bg-green-800/80 hover:bg-green-600 text-white font-medium transition"
              >
                M1: Categorizer
              </Link>
              <Link
                href="/modules/fleet"
                className="px-2.5 py-1 rounded-lg bg-green-800/80 hover:bg-green-600 text-white font-medium transition"
              >
                M2: Radar
              </Link>
              <Link
                href="/modules/scheduling"
                className="px-2.5 py-1 rounded-lg bg-green-800/80 hover:bg-green-600 text-white font-medium transition"
              >
                M3: Booking
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Tab Scroll */}
        <div className="flex md:hidden overflow-x-auto pb-3 pt-1 space-x-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-white text-green-800 shadow-sm font-bold'
                    : 'bg-green-900/50 text-green-100 hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
