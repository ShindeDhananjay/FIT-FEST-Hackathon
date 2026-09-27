'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Phone,
  User,
  Clock,
  Navigation,
  Leaf,
  Sparkles,
  Calendar,
  MapPin,
  Check,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  HelpCircle,
  Award,
} from 'lucide-react';
import { WasteCategory, WastePickupRequest, CitizenUser } from '@/types/waste';
import { WASTE_CATEGORIES, PUNE_ZONES, TIME_SLOTS } from '@/constants/wasteCategories';

interface BookingWizardProps {
  onSuccess: (newRequest: WastePickupRequest) => void;
  onOpenAiScanner: () => void;
  prefilledCategory?: WasteCategory;
  prefilledDescription?: string;
  prefilledWeight?: number;
  citizenUser?: CitizenUser | null;
}

interface SimpleCategory {
  id: WasteCategory;
  name: string;
  emoji: string;
  examples: string;
  color: string;
  bgColor: string;
  borderColor: string;
  points: number;
}

const CATEGORIES: SimpleCategory[] = [
  {
    id: 'organic',
    name: 'Food & Garden Waste',
    emoji: '🥬',
    examples: 'Vegetable peels, food scraps, fallen garden leaves',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50/80',
    borderColor: 'border-emerald-500',
    points: 10,
  },
  {
    id: 'plastic',
    name: 'Dry Plastics & Bottles',
    emoji: '🧴',
    examples: 'Water bottles, containers, clean packaging wraps',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50/80',
    borderColor: 'border-blue-500',
    points: 15,
  },
  {
    id: 'paper',
    name: 'Cardboard & Paper',
    emoji: '📦',
    examples: 'Newspapers, courier boxes, books, office paper',
    color: 'text-amber-800',
    bgColor: 'bg-amber-50/80',
    borderColor: 'border-amber-500',
    points: 12,
  },
  {
    id: 'ewaste',
    name: 'Electronic Gadgets',
    emoji: '📱',
    examples: 'Old phones, chargers, cables, appliances, batteries',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50/80',
    borderColor: 'border-purple-500',
    points: 40,
  },
  {
    id: 'metal',
    name: 'Metals & Scrap',
    emoji: '🥫',
    examples: 'Beverage cans, tin boxes, steel scrap, foils',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-500',
    points: 35,
  },
  {
    id: 'hazardous',
    name: 'Bulbs & Paint Chemicals',
    emoji: '💡',
    examples: 'Fluorescent tubes, paint cans, cleaning solvents',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50/80',
    borderColor: 'border-rose-500',
    points: 25,
  },
];

const PRESET_AMOUNTS = [
  { label: 'Small Bag', sub: '~3 kg', weight: 3 },
  { label: 'Medium Sack', sub: '~5 kg', weight: 5 },
  { label: 'Large Box', sub: '~10 kg', weight: 10 },
  { label: 'Bulk Batch', sub: '~25 kg', weight: 25 },
];

export const BookingWizard: React.FC<BookingWizardProps> = ({
  onSuccess,
  onOpenAiScanner,
  prefilledCategory,
  prefilledDescription,
  prefilledWeight,
  citizenUser,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [category, setCategory] = useState<WasteCategory>(prefilledCategory || 'plastic');
  const [estimatedWeightKg, setEstimatedWeightKg] = useState<number>(prefilledWeight || 5);
  const [cityZone, setCityZone] = useState(() => citizenUser?.area || PUNE_ZONES[0]);
  const [pickupAddress, setPickupAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [scheduledSlot, setScheduledSlot] = useState(TIME_SLOTS[0]);
  const [contactName, setContactName] = useState(() => citizenUser?.name || 'Dhananjay Shinde');
  const [contactPhone, setContactPhone] = useState(() => citizenUser?.phone || '+91 98223 91023');

  useEffect(() => {
    if (prefilledCategory) {
      setCategory(prefilledCategory);
    }
  }, [prefilledCategory]);

  useEffect(() => {
    if (prefilledWeight) {
      setEstimatedWeightKg(prefilledWeight);
    }
  }, [prefilledWeight]);

  const selectedCategoryMeta = CATEGORIES.find((c) => c.id === category) || CATEGORIES[1];
  const activeCategoryInfo = WASTE_CATEGORIES[category];
  const calculatedPoints = Math.round(estimatedWeightKg * activeCategoryInfo.ecoPointsPerKg);
  const calculatedCo2 = Number((estimatedWeightKg * activeCategoryInfo.co2Factor).toFixed(1));

  const handleUseGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPickupAddress(`Flat 402, Near Ferguson College Road, Shivaji Nagar, Pune`);
        },
        () => {
          setPickupAddress(`FC Road, Shivaji Nagar, Pune`);
        }
      );
    } else {
      setPickupAddress(`FC Road, Shivaji Nagar, Pune`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trackingCode = `ECO-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest: WastePickupRequest = {
      id: `REQ-${Date.now()}`,
      trackingCode,
      category,
      itemDescription: `${selectedCategoryMeta.name} pickup`,
      estimatedWeightKg,
      quantityUnits: `${estimatedWeightKg} kg`,
      pickupAddress: pickupAddress || `${cityZone}, Pune`,
      cityZone,
      landmark,
      coordinates: { lat: 18.5204, lng: 73.8567 },
      scheduledDate,
      scheduledSlot,
      contactName,
      contactPhone,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      ecoPointsEarned: calculatedPoints,
      co2OffsetKg: calculatedCo2,
    };
    onSuccess(newRequest);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4.5rem)] bg-gradient-to-b from-[#f8faf9] to-[#edf3ef] py-4 sm:py-6 lg:py-10 px-3 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header Row spanning full width */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                PMC Municipal Waste Booking
              </span>
              <span className="text-xs text-gray-500 font-medium">· Doorstep Collection Free ₹0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              Schedule Your Waste Pickup
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Select your materials, tell us where to arrive, and get verified recycling points.
            </p>
          </div>

          {/* Quick AI Trigger */}
          <button
            type="button"
            onClick={onOpenAiScanner}
            className="self-start md:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm text-xs font-bold transition-all cursor-pointer group"
          >
            <Sparkles className="h-4 w-4 text-emerald-600 group-hover:rotate-12 transition-transform" />
            <span>Identify Waste with AI Camera</span>
          </button>
        </div>

        {/* 2-Column Full Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: Main Interactive Form Flow (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Stepper Header */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="grid grid-cols-4 gap-1 sm:gap-2">
                {[
                  { num: 1, title: 'Waste Type', desc: 'Select items' },
                  { num: 2, title: 'Location', desc: 'Pune address' },
                  { num: 3, title: 'Schedule', desc: 'Date & time' },
                  { num: 4, title: 'Confirm', desc: 'Final review' },
                ].map((s, idx) => {
                  const isDone = s.num < step;
                  const isCurrent = s.num === step;

                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => s.num <= step && setStep(s.num as 1 | 2 | 3 | 4)}
                      disabled={s.num > step}
                      className={`flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl text-left transition-all ${
                        isCurrent
                          ? 'bg-emerald-50 text-emerald-900 font-bold'
                          : isDone
                          ? 'hover:bg-gray-50 cursor-pointer text-gray-700'
                          : 'opacity-40 cursor-not-allowed text-gray-400'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {isDone ? <Check className="h-4 w-4 stroke-[3]" /> : s.num}
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-xs font-bold leading-tight">{s.title}</p>
                        <p className="text-[10px] text-gray-400 font-normal">{s.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">

                {/* STEP 1: CATEGORY & QUANTITY */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          1. What waste items are you disposing?
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          Select the primary material. You can hand over segregated bags directly to our driver.
                        </p>
                      </div>

                      {/* 6 Expansive Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                        {CATEGORIES.map((c) => {
                          const isSelected = category === c.id;
                          return (
                            <div
                              key={c.id}
                              onClick={() => setCategory(c.id)}
                              className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between group overflow-hidden ${
                                isSelected
                                  ? `${c.borderColor} ${c.bgColor} shadow-md scale-[1.02]`
                                  : 'border-gray-200/80 bg-white hover:border-emerald-300 hover:shadow-xs'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <span className="text-4xl p-2 rounded-xl bg-white shadow-2xs">
                                  {c.emoji}
                                </span>
                                {isSelected ? (
                                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-bold text-gray-400 group-hover:text-emerald-600">
                                    Select
                                  </span>
                                )}
                              </div>

                              <div>
                                <h3 className="text-sm font-extrabold text-gray-900 leading-snug">
                                  {c.name}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                  {c.examples}
                                </p>
                              </div>

                              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                                  +{c.points} pts/kg
                                </span>
                                <span className="text-[10px] text-gray-400 font-semibold">
                                  Recyclable
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* How much do you have */}
                      <div className="pt-4 border-t border-gray-100 space-y-3">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                          2. How much volume approximately?
                        </label>

                        {/* Presets */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {PRESET_AMOUNTS.map((p) => (
                            <button
                              key={p.weight}
                              type="button"
                              onClick={() => setEstimatedWeightKg(p.weight)}
                              className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                                estimatedWeightKg === p.weight
                                  ? 'border-emerald-600 bg-emerald-50/80 shadow-xs'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
                            >
                              <p className="text-xs font-bold text-gray-900">{p.label}</p>
                              <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{p.sub}</p>
                            </button>
                          ))}
                        </div>

                        {/* Adjuster Counter */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <span className="text-xs font-bold text-gray-700">Custom weight:</span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setEstimatedWeightKg((w) => Math.max(1, w - 1))}
                              className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 cursor-pointer shadow-2xs font-bold"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="text-base font-black text-gray-900 w-16 text-center">
                              {estimatedWeightKg} kg
                            </span>
                            <button
                              type="button"
                              onClick={() => setEstimatedWeightKg((w) => w + 1)}
                              className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 cursor-pointer shadow-2xs font-bold"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                      >
                        <span>Next: Enter Pickup Address</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: ADDRESS */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          2. Where should the collector arrive?
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          Our electric collection vehicle will come right to your gate or society entrance.
                        </p>
                      </div>

                      {/* Area Select */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Pune Municipal Corporation (PMC) Area
                        </label>
                        <select
                          value={cityZone}
                          onChange={(e) => setCityZone(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        >
                          {PUNE_ZONES.map((z) => (
                            <option key={z} value={z}>
                              📍 {z}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Address */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Full Street Address / Building / Society
                          </label>
                          <button
                            type="button"
                            onClick={handleUseGps}
                            className="text-xs text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Navigation className="h-3 w-3" />
                            <span>Auto-detect GPS Location</span>
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={pickupAddress}
                          onChange={(e) => setPickupAddress(e.target.value)}
                          placeholder="e.g. Flat 302, Sai Residency, Opposite Ferguson College Main Gate, Pune"
                          required
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      {/* Landmark */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Nearby Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="e.g. Near HDFC Bank ATM or Next to Ganpati Mandir"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-6 py-4 rounded-2xl bg-white hover:bg-gray-100 text-gray-700 font-bold text-sm border border-gray-200 cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Next: Pick Date & Time Slot</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: SCHEDULE */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          3. When should we come?
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          Choose a day and time slot convenient for you.
                        </p>
                      </div>

                      {/* Date */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Pickup Date
                        </label>
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        />
                      </div>

                      {/* Time Slots */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Preferred Time Window
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {TIME_SLOTS.map((slot) => {
                            const isSelected = scheduledSlot === slot;
                            return (
                              <div
                                key={slot}
                                onClick={() => setScheduledSlot(slot)}
                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                                  isSelected
                                    ? 'border-emerald-600 bg-emerald-50 text-gray-900 font-bold shadow-xs'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <Clock className="h-4 w-4 text-emerald-600" />
                                  <span className="text-xs sm:text-sm">{slot.split('(')[0]}</span>
                                </div>
                                {isSelected && <Check className="h-4 w-4 text-emerald-600 stroke-[3]" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Contact details */}
                      {citizenUser && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>
                            Auto-filled from your citizen account: <strong>{citizenUser.name}</strong> ({citizenUser.phone})
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Citizen Name
                          </label>
                          <input
                            type="text"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="Your full name"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Mobile Number (for SMS & Driver Call)
                          </label>
                          <input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="+91 98223 91023"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-6 py-4 rounded-2xl bg-white hover:bg-gray-100 text-gray-700 font-bold text-sm border border-gray-200 cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        className="flex-1 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Next: Final Review</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: REVIEW & CONFIRM */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                      <div className="text-center pb-2">
                        <span className="text-5xl mb-2 inline-block">{selectedCategoryMeta.emoji}</span>
                        <h2 className="text-xl font-black text-gray-900">{selectedCategoryMeta.name}</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Estimated ~{estimatedWeightKg} kg waste</p>
                      </div>

                      <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-xs">Date & Time:</span>
                          <span className="font-bold text-gray-900">{scheduledDate} · {scheduledSlot.split('(')[0]}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-xs">Pickup Ward:</span>
                          <span className="font-bold text-gray-900">{cityZone.split(',')[0]}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-xs">Doorstep Address:</span>
                          <span className="font-bold text-gray-900 text-right max-w-[280px] truncate">{pickupAddress || cityZone}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-xs">Citizen Contact:</span>
                          <span className="font-bold text-gray-900">{contactName} ({contactPhone})</span>
                        </div>
                        <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-base">
                          <span className="font-extrabold text-emerald-800">Total Pickup Charge:</span>
                          <span className="font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">FREE ₹0</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-6 py-4 rounded-2xl bg-white hover:bg-gray-100 text-gray-700 font-bold text-sm border border-gray-200 cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-xl shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Confirm & Dispatch Pickup 🚀</span>
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </form>
          </div>

          {/* RIGHT COLUMN: Expansive Sticky Live Order Summary & Impact (4 Cols) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">

            {/* Live Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                  Live Order Preview
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Free Doorstep
                </span>
              </div>

              {/* Selected Material Card */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-3xl p-2 rounded-xl bg-white shadow-2xs">
                  {selectedCategoryMeta.emoji}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{selectedCategoryMeta.name}</h4>
                  <p className="text-xs text-gray-500 font-medium">Estimated: ~{estimatedWeightKg} kg</p>
                </div>
              </div>

              {/* Dynamic Points Earned Counter */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/15 space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-100 font-semibold">
                  <span>EcoPoints Reward</span>
                  <Award className="h-4 w-4 text-emerald-200" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black tracking-tight">+{calculatedPoints}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">pts</span>
                </div>
                <p className="text-[11px] text-emerald-100/90 font-medium pt-1 border-t border-emerald-400/40">
                  🌱 Offsetting approximately ~{calculatedCo2} kg of carbon emissions.
                </p>
              </div>

              {/* Location & Slot Snapshot */}
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Zone: <strong>{cityZone.split(',')[0]}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>Date: <strong>{scheduledDate}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Slot: <strong>{scheduledSlot.split('(')[0]}</strong></span>
                </div>
              </div>

              {/* Pune Municipal Assurance Badge */}
              <div className="pt-3 border-t border-gray-100 flex items-start gap-2.5 text-xs text-gray-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Authorized PMC smart municipal waste partner. Zero disposal fees.
                </p>
              </div>
            </div>

            {/* Help Callout */}
            <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-gray-600">
                <HelpCircle className="h-4 w-4 text-gray-400" />
                <span>Need quick assistance?</span>
              </div>
              <span className="font-mono font-bold text-gray-900">1800-233-8888</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
