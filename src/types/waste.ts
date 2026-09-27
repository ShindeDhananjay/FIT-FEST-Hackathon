export type WasteCategory =
  | 'organic'
  | 'plastic'
  | 'ewaste'
  | 'hazardous'
  | 'paper'
  | 'metal';

export type RequestStatus =
  | 'submitted'
  | 'assigned'
  | 'on_the_way'
  | 'completed'
  | 'cancelled';

export interface WasteCategoryInfo {
  id: WasteCategory;
  name: string;
  tagline: string;
  color: string;
  accentBg: string;
  borderColor: string;
  iconName: string;
  examples: string[];
  co2Factor: number; // kg of CO2 saved per kg recycled
  ecoPointsPerKg: number;
  recyclingInstructions: string;
}

export interface WastePickupRequest {
  id: string;
  trackingCode: string; // e.g. "FIT-7294"
  category: WasteCategory;
  itemDescription: string;
  estimatedWeightKg: number;
  quantityUnits: string; // e.g. "2 boxes", "3 bags"
  pickupAddress: string;
  cityZone: string;
  landmark?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  scheduledDate: string;
  scheduledSlot: string;
  contactName: string;
  contactPhone: string;
  specialInstructions?: string;
  imageUrl?: string;
  status: RequestStatus;
  driver?: {
    id: string;
    name: string;
    phone: string;
    vehicleNumber: string;
    avatar: string;
    etaMinutes: number;
  };
  createdAt: string;
  completedAt?: string;
  ecoPointsEarned: number;
  co2OffsetKg: number;
  certificateId?: string;
}

export interface CollectorDriver {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  vehicleType: string;
  currentZone: string;
  status: 'available' | 'on_route' | 'off_duty';
  assignedRequestsCount: number;
  rating: number;
  avatar: string;
}

export interface CitizenImpactProfile {
  name: string;
  email: string;
  phone: string;
  ecoPoints: number;
  totalPickups: number;
  totalKgRecycled: number;
  co2SavedKg: number;
  tier: 'Eco Novice' | 'Green Warrior' | 'Zero-Waste Champion';
  rank: number;
}

export interface CitizenUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  area?: string;
  ecoPoints: number;
}
