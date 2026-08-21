'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MetricsGrid } from '@/components/analytics/MetricsGrid';
import { PickupBookingForm } from '@/components/resident/PickupBookingForm';
import { ComplaintForm } from '@/components/resident/ComplaintForm';
import { SmartCategorizer } from '@/components/categorizer/SmartCategorizer';
import { WasteKnowledgeBase } from '@/components/categorizer/WasteKnowledgeBase';
import { FleetMap } from '@/components/tracking/FleetMap';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { DriverView } from '@/components/driver/DriverView';
import { mockPickups, mockVehicles, mockComplaints, mockAnalytics } from '@/lib/mockData';
import { PickupRequest } from '@/lib/types';
import { Sparkles, ArrowRight, Shield, Leaf, HeartHandshake } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('resident');
  const [pickupsList, setPickupsList] = useState<PickupRequest[]>(mockPickups);
  const [metrics, setMetrics] = useState(mockAnalytics);

  const handlePickupCreated = (newPickup: PickupRequest) => {
    setPickupsList((prev) => [newPickup, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      pickupsThisWeek: prev.pickupsThisWeek + 1,
      co2SavedKg: Number((prev.co2SavedKg + 1.2).toFixed(1)),
    }));
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        {/* Environmental Telemetry Header */}
        <MetricsGrid metrics={metrics} />

        {/* Tab 1: Resident Portal (Default Home) */}
        {activeTab === 'resident' && (
          <div className="space-y-12 animate-fadeIn">
            {/* Hero Card */}
            <div className="bg-gradient-to-r from-green-800 via-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold border border-white/20 text-green-200">
                  <Leaf className="w-4 h-4 text-green-300" /> Clean & Green Municipal Initiative
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Doorstep Waste Segregation, On-Demand Pickups & Carbon Tracking
                </h2>
                <p className="text-green-100 text-sm sm:text-base leading-relaxed">
                  Never miss garbage collection again. Schedule doorstep pickups for recyclable streams, identify segregation bin types with AI, and track municipal sanitation trucks in real-time.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('booking-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white text-green-900 hover:bg-green-50 font-bold px-6 py-3 rounded-2xl text-sm transition shadow-lg flex items-center gap-2"
                  >
                    Schedule Pickup <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('fleet')}
                    className="bg-green-700/60 hover:bg-green-700 text-white border border-green-400/30 font-semibold px-5 py-3 rounded-2xl text-sm transition backdrop-blur-md"
                  >
                    Live Truck Map
                  </button>
                </div>
              </div>
            </div>

            {/* Resident Booking & Smart Categorizer Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="booking-section">
              <PickupBookingForm onPickupCreated={handlePickupCreated} />
              <SmartCategorizer />
            </div>

            {/* Fleet Radar Snapshot */}
            <div>
              <FleetMap vehicles={mockVehicles} />
            </div>

            {/* Know Your Waste Knowledge Base */}
            <div>
              <WasteKnowledgeBase />
            </div>
          </div>
        )}

        {/* Tab 2: Smart Categorizer Deep Dive */}
        {activeTab === 'categorizer' && (
          <div className="space-y-8 animate-fadeIn">
            <SmartCategorizer />
            <WasteKnowledgeBase />
          </div>
        )}

        {/* Tab 3: Fleet Tracking Radar */}
        {activeTab === 'fleet' && (
          <div className="space-y-8 animate-fadeIn">
            <FleetMap vehicles={mockVehicles} />
          </div>
        )}

        {/* Tab 4: Citizen Grievance & Missed Pickup Report */}
        {activeTab === 'complaints' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
            <ComplaintForm />
          </div>
        )}

        {/* Tab 5: Municipality Admin Dashboard */}
        {activeTab === 'admin' && (
          <div className="space-y-8 animate-fadeIn">
            <AdminDashboard
              pickups={pickupsList}
              vehicles={mockVehicles}
              complaints={mockComplaints}
            />
          </div>
        )}

        {/* Tab 6: Driver Mobile View */}
        {activeTab === 'driver' && (
          <div className="space-y-8 animate-fadeIn">
            <DriverView pickups={pickupsList} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
