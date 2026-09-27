'use client';

import React, { useState } from 'react';
import {
  Recycle,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Weight,
  Layers,
  Info,
  Apple,
  Package,
  Cpu,
  AlertTriangle,
  Wrench,
  Navigation,
} from 'lucide-react';
import { WasteCategory, WastePickupRequest } from '@/types/waste';
import { WASTE_CATEGORIES, PUNE_ZONES, TIME_SLOTS } from '@/constants/wasteCategories';

interface BookingWizardProps {
  onSuccess: (newRequest: WastePickupRequest) => void;
  onOpenAiScanner: () => void;
  prefilledCategory?: WasteCategory;
  prefilledDescription?: string;
  prefilledWeight?: number;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  onSuccess,
  onOpenAiScanner,
  prefilledCategory,
  prefilledDescription,
  prefilledWeight,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [category, setCategory] = useState<WasteCategory>(prefilledCategory || 'plastic');
  const [itemDescription, setItemDescription] = useState(
    prefilledDescription || 'Clean PET plastic water bottles & packaging cardboard'
  );
  const [estimatedWeightKg, setEstimatedWeightKg] = useState<number>(prefilledWeight || 5);
  const [quantityUnits, setQuantityUnits] = useState('2 bags');

  // Location State
  const [cityZone, setCityZone] = useState(PUNE_ZONES[0]);
  const [pickupAddress, setPickupAddress] = useState(
    'Flora Institute of Technology, Innovation Wing, Pune'
  );
  const [landmark, setLandmark] = useState('Near Academic Block B');
  const [coords, setCoords] = useState({ lat: 18.3512, lng: 73.8567 });
  const [gpsDetected, setGpsDetected] = useState(false);

  // Scheduling State
  const [scheduledDate, setScheduledDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [scheduledSlot, setScheduledSlot] = useState(TIME_SLOTS[1]);
  const [contactName, setContactName] = useState('Dhananjay Shinde');
  const [contactPhone, setContactPhone] = useState('+91 98223 91023');
  const [specialInstructions, setSpecialInstructions] = useState(
    'Please ring the bell upon arrival; bags kept at porch.'
  );

  // Calculated benefits
  const activeCategoryInfo = WASTE_CATEGORIES[category];
  const calculatedPoints = Math.round(estimatedWeightKg * activeCategoryInfo.ecoPointsPerKg);
  const calculatedCo2 = Number((estimatedWeightKg * activeCategoryInfo.co2Factor).toFixed(1));

  // Geolocation trigger
  const handleUseGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setGpsDetected(true);
          setPickupAddress(`Auto-detected GPS Location: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          setGpsDetected(true);
          setCoords({ lat: 18.3512, lng: 73.8567 });
        }
      );
    } else {
      setGpsDetected(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `FIT-${randomSuffix}`;

    const newRequest: WastePickupRequest = {
      id: `REQ-${Date.now()}`,
      trackingCode,
      category,
      itemDescription,
      estimatedWeightKg,
      quantityUnits,
      pickupAddress,
      cityZone,
      landmark,
      coordinates: coords,
      scheduledDate,
      scheduledSlot,
      contactName,
      contactPhone,
      specialInstructions,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      ecoPointsEarned: calculatedPoints,
      co2OffsetKg: calculatedCo2,
    };

    onSuccess(newRequest);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Apple':
        return <Apple className="h-5 w-5" />;
      case 'Package':
        return <Package className="h-5 w-5" />;
      case 'Cpu':
        return <Cpu className="h-5 w-5" />;
      case 'AlertTriangle':
        return <AlertTriangle className="h-5 w-5" />;
      case 'FileText':
        return <FileText className="h-5 w-5" />;
      case 'Wrench':
        return <Wrench className="h-5 w-5" />;
      default:
        return <Recycle className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Top Banner / Problem Statement alignment */}
      <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Smart On-Demand Pickup</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Schedule a Waste Collection
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Select your waste category, specify location, and our eco-fleet will pick it up directly from your doorstep with live GPS tracking.
            </p>
          </div>

          <button
            onClick={onOpenAiScanner}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="h-4 w-4" />
            <span>Try AI Waste Scanner</span>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-slate-800">
          <div
            onClick={() => setStep(1)}
            className={`cursor-pointer flex items-center gap-2 pb-1 border-b-2 text-xs font-semibold transition-all ${
              step === 1 ? 'border-emerald-400 text-emerald-300' : 'border-slate-800 text-slate-500'
            }`}
          >
            <span className="h-5 w-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">1</span>
            <span>Category & Items</span>
          </div>
          <div
            onClick={() => step > 1 && setStep(2)}
            className={`cursor-pointer flex items-center gap-2 pb-1 border-b-2 text-xs font-semibold transition-all ${
              step === 2 ? 'border-emerald-400 text-emerald-300' : 'border-slate-800 text-slate-500'
            }`}
          >
            <span className="h-5 w-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">2</span>
            <span>Location & Zone</span>
          </div>
          <div
            onClick={() => step > 2 && setStep(3)}
            className={`cursor-pointer flex items-center gap-2 pb-1 border-b-2 text-xs font-semibold transition-all ${
              step === 3 ? 'border-emerald-400 text-emerald-300' : 'border-slate-800 text-slate-500'
            }`}
          >
            <span className="h-5 w-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">3</span>
            <span>Schedule & Confirm</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* STEP 1: CATEGORY SELECTION */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="h-4 w-4 text-emerald-400" />
                  Select Waste Category
                </label>
                <span className="text-xs text-slate-400">Choose the primary material</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(Object.keys(WASTE_CATEGORIES) as WasteCategory[]).map((catKey) => {
                  const cat = WASTE_CATEGORIES[catKey];
                  const isSelected = category === catKey;

                  return (
                    <div
                      key={catKey}
                      onClick={() => setCategory(catKey)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-950/50'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`p-2.5 rounded-xl ${cat.accentBg}`}>
                          {getCategoryIcon(cat.iconName)}
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        )}
                      </div>
                      <h3 className="font-bold text-white text-sm mt-3">{cat.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cat.tagline}</p>

                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-semibold">+{cat.ecoPointsPerKg} pts/kg</span>
                        <span className="text-slate-400">Save {cat.co2Factor}kg CO₂/kg</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Disposal Instructions Box */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <Info className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-white block">Proper Segregation Tip for {activeCategoryInfo.name}:</span>
                <p className="text-slate-300 mt-0.5">{activeCategoryInfo.recyclingInstructions}</p>
              </div>
            </div>

            {/* Item Description & Weight Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Item Description & Notes
                </label>
                <input
                  type="text"
                  required
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="e.g. 20 mineral water bottles, 2 flattened cardboard boxes"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Packaging / Volume (e.g., bags, boxes)
                </label>
                <input
                  type="text"
                  required
                  value={quantityUnits}
                  onChange={(e) => setQuantityUnits(e.target.value)}
                  placeholder="e.g. 2 large bags, 1 cardboard carton"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Weight Slider with Live Incentive preview */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-2">
                  <Weight className="h-4 w-4 text-emerald-400" />
                  Estimated Total Weight: <span className="text-emerald-400 text-base">{estimatedWeightKg} kg</span>
                </label>
                <span className="text-xs text-slate-400">Approximate is fine</span>
              </div>

              <input
                type="range"
                min="1"
                max="100"
                step="0.5"
                value={estimatedWeightKg}
                onChange={(e) => setEstimatedWeightKg(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400">Green Impact Reward:</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                    +{calculatedPoints} EcoPoints
                  </span>
                  <span className="font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-500/30">
                    ~{calculatedCo2} kg CO₂ Offset
                  </span>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>Proceed to Location</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION DETAILS */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  Select City Zone & Pickup Address
                </h3>
                <button
                  type="button"
                  onClick={handleUseGps}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>{gpsDetected ? 'GPS Position Locked' : 'Auto-Detect GPS'}</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Designated Service Zone
                </label>
                <select
                  value={cityZone}
                  onChange={(e) => setCityZone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  {PUNE_ZONES.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Complete Street Address / Building / Room
                </label>
                <textarea
                  required
                  rows={2}
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="e.g. Flora Institute of Technology, Innovation Lab 102, Khed-Shivapur Tollway, Pune"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Nearby Landmark / Special Gate
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Main Auditorium Gate 3"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Interactive Campus Map Preview Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                  GIS Dispatch Routing Preview
                </span>
                <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Zone: {cityZone.split(' ')[0]}
                </span>
              </div>

              <div className="h-36 rounded-xl bg-slate-950 border border-slate-800/80 relative overflow-hidden flex items-center justify-center p-4">
                {/* Simulated Grid / Map visual */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-2 animate-bounce">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-white">{pickupAddress.slice(0, 45)}...</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Lat: {coords.lat.toFixed(4)} | Lng: {coords.lng.toFixed(4)} • Nearest depot: Flora Tech Green Facility (1.2 km)
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>Proceed to Schedule</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: SCHEDULING & CONFIRMATION */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Date & Slot selection */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-400" />
                Select Preferred Date & Pickup Time Slot
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Collection Date
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 98223 91023"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-emerald-400" />
                  Available Time Slots
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = scheduledSlot === slot;
                    return (
                      <div
                        key={slot}
                        onClick={() => setScheduledSlot(slot)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-emerald-950/60 border-emerald-500 text-white font-bold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span>{slot}</span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Contact Person Name
                  </label>
                  <div className="relative">
                    <User className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Special Handover Instructions
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Ring bell, handle glass with care"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

            </div>

            {/* Summary Ticket Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Pickup Verification Summary
                </span>
                <span className="text-xs text-slate-400">Ready to Dispatch</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Category</span>
                  <span className="font-bold text-white capitalize">{category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Weight & Units</span>
                  <span className="font-bold text-white">{estimatedWeightKg} kg ({quantityUnits})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Points Earning</span>
                  <span className="font-bold text-emerald-400">+{calculatedPoints} EcoPoints</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">CO₂ Offset</span>
                  <span className="font-bold text-cyan-400">{calculatedCo2} kg</span>
                </div>
              </div>
            </div>

            {/* Final Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>Confirm & Dispatch Request</span>
              </button>
            </div>

          </div>
        )}

      </form>

    </div>
  );
};
