'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Layers,
  Leaf,
  Info,
} from 'lucide-react';
import { WasteCategory } from '@/types/waste';
import { WASTE_CATEGORIES } from '@/constants/wasteCategories';

interface AiWasteScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDetectedWaste: (data: {
    category: WasteCategory;
    description: string;
    weight: number;
  }) => void;
}

interface SampleItem {
  id: string;
  name: string;
  category: WasteCategory;
  description: string;
  weight: number;
  confidence: number;
  imageUrl: string;
  segregationAdvice: string;
}

const SAMPLE_TRASH: SampleItem[] = [
  {
    id: 'sample-1',
    name: 'PET Water Bottles Bundle',
    category: 'plastic',
    description: '15 Flattened PET mineral water bottles & beverage caps',
    weight: 2.5,
    confidence: 98.4,
    imageUrl: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&w=600&q=80',
    segregationAdvice: 'Caps separated, labels removed. 100% recyclable into polyester fiber.',
  },
  {
    id: 'sample-2',
    name: 'Laptop & Lithium Battery',
    category: 'ewaste',
    description: 'Decommissioned notebook laptop, charger brick & 2 phone batteries',
    weight: 4.8,
    confidence: 96.1,
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
    segregationAdvice: 'High recovery value (Gold, Copper, Lithium). Fire hazard: tape terminals before transit.',
  },
  {
    id: 'sample-3',
    name: 'Corrugated Shipping Cartons',
    category: 'paper',
    description: '4 Large flattened cardboard packaging boxes from online deliveries',
    weight: 6.0,
    confidence: 99.1,
    imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80',
    segregationAdvice: 'Completely dry, packing tape stripped. Suitable for high-yield pulping.',
  },
  {
    id: 'sample-4',
    name: 'Organic Kitchen Scraps',
    category: 'organic',
    description: 'Vegetable peels, melon rinds, coffee grounds and dry leaves',
    weight: 8.0,
    confidence: 97.5,
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    segregationAdvice: 'Zero plastic contamination. Ideal for campus microbial composting.',
  },
];

export const AiWasteScannerModal: React.FC<AiWasteScannerModalProps> = ({
  isOpen,
  onClose,
  onApplyDetectedWaste,
}) => {
  const [selectedSample, setSelectedSample] = useState<SampleItem>(SAMPLE_TRASH[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(true);

  if (!isOpen) return null;

  const handleRunScan = () => {
    setIsScanning(true);
    setScanCompleted(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanCompleted(true);
    }, 1200);
  };

  const handleApply = () => {
    onApplyDetectedWaste({
      category: selectedSample.category,
      description: selectedSample.description,
      weight: selectedSample.weight,
    });
    onClose();
  };

  const activeCategoryInfo = WASTE_CATEGORIES[selectedSample.category];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-2xl w-full rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">EcoAI Vision Waste Classifier</h2>
              <p className="text-xs text-slate-400">Intelligent computer-vision material identification & categorization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Sample Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              Select or test with real-world sample images:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_TRASH.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => {
                    setSelectedSample(sample);
                    setCustomImage(null);
                    handleRunScan();
                  }}
                  className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedSample.id === sample.id && !customImage
                      ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={sample.imageUrl}
                    alt={sample.name}
                    className="h-16 w-full object-cover rounded-lg mb-1.5"
                  />
                  <p className="text-[11px] font-bold text-white truncate">{sample.name}</p>
                  <p className="text-[10px] text-emerald-400 capitalize">{sample.category}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Vision Scanner Canvas */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden h-56 flex items-center justify-center">
            <img
              src={customImage || selectedSample.imageUrl}
              alt="Waste preview"
              className="w-full h-full object-cover opacity-80"
            />

            {/* Scanning beam animation */}
            {isScanning && (
              <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[1px] flex flex-col items-center justify-center">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg shadow-emerald-400 animate-pulse absolute top-1/2" />
                <div className="bg-slate-950/90 border border-emerald-500 px-4 py-2 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2 z-10">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Analyzing Material Matrix with Neural Vision...</span>
                </div>
              </div>
            )}

            {/* Bounding box mock */}
            {!isScanning && scanCompleted && (
              <div className="absolute inset-6 border-2 border-dashed border-emerald-400 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                <div className="self-start bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                  DETECTED: {selectedSample.name.toUpperCase()} ({selectedSample.confidence}% MATCH)
                </div>
                <div className="self-end bg-slate-950/90 text-emerald-400 border border-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded">
                  ECO-RATING: A+ RECYCLABLE
                </div>
              </div>
            )}
          </div>

          {/* AI Recognition Output Card */}
          {scanCompleted && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                    Classification Result
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {selectedSample.confidence}% Neural Confidence
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-400 capitalize">
                  Category: {activeCategoryInfo.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Estimated Weight</span>
                  <span className="font-bold text-white text-sm">{selectedSample.weight} kg</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">CO₂ Abatement Potential</span>
                  <span className="font-bold text-cyan-400 text-sm">
                    ~{(selectedSample.weight * activeCategoryInfo.co2Factor).toFixed(1)} kg CO₂
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <Info className="h-3.5 w-3.5" />
                  <span>Segregation Protocol & Handling Tip</span>
                </div>
                <p className="text-slate-300 text-[11px]">{selectedSample.segregationAdvice}</p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleRunScan}
              className="px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Rescan Sample</span>
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <span>Auto-Fill Request Form</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
