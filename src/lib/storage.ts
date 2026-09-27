import { WastePickupRequest, CollectorDriver, CitizenImpactProfile } from '@/types/waste';

export const INITIAL_DRIVERS: CollectorDriver[] = [
  {
    id: 'DRV-101',
    name: 'Ramesh Patil',
    phone: '+91 98231 44521',
    vehicleNumber: 'MH-12-GN-4029 (Electric Van)',
    vehicleType: 'EV Green Collector',
    currentZone: 'Flora Institute of Technology Campus',
    status: 'on_route',
    assignedRequestsCount: 2,
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'DRV-102',
    name: 'Sunil Shinde',
    phone: '+91 97652 11984',
    vehicleNumber: 'MH-12-TR-8812 (Hydraulic Compactor)',
    vehicleType: 'Heavy Recyclables Truck',
    currentZone: 'Hadapsar & Magarpatta',
    status: 'available',
    assignedRequestsCount: 0,
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'DRV-103',
    name: 'Pooja Kulkarni',
    phone: '+91 99220 83419',
    vehicleNumber: 'MH-14-EW-5501 (E-Waste Secure Transporter)',
    vehicleType: 'Hazmat & E-Waste Mobile Unit',
    currentZone: 'Kharadi IT Park',
    status: 'on_route',
    assignedRequestsCount: 1,
    rating: 5.0,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
  },
];

export const INITIAL_REQUESTS: WastePickupRequest[] = [
  {
    id: 'REQ-101',
    trackingCode: 'FIT-8021',
    category: 'plastic',
    itemDescription: '50 clean PET mineral water bottles and sorted packaging wraps from campus cafeteria',
    estimatedWeightKg: 8.5,
    quantityUnits: '3 large recycling bags',
    pickupAddress: 'Flora Institute of Technology, C-Block Cafeteria, Khed-Shivapur Tollway, Pune',
    cityZone: 'Flora Institute of Technology Campus',
    landmark: 'Behind Student Innovation Hub',
    coordinates: { lat: 18.3512, lng: 73.8567 },
    scheduledDate: '2026-09-27',
    scheduledSlot: '12:00 PM - 03:00 PM (Midday Slot)',
    contactName: 'Dhananjay Shinde',
    contactPhone: '+91 98223 91023',
    specialInstructions: 'Placed outside door under the green umbrella',
    status: 'on_the_way',
    driver: {
      id: 'DRV-101',
      name: 'Ramesh Patil',
      phone: '+91 98231 44521',
      vehicleNumber: 'MH-12-GN-4029 (Electric Van)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      etaMinutes: 14,
    },
    createdAt: '2026-09-27T08:15:00Z',
    ecoPointsEarned: 125,
    co2OffsetKg: 15.3,
  },
  {
    id: 'REQ-102',
    trackingCode: 'FIT-7910',
    category: 'ewaste',
    itemDescription: '2 Old laptops, 6 lithium smartphone batteries, and 12 assorted charging adapters',
    estimatedWeightKg: 14.0,
    quantityUnits: '2 reinforced crates',
    pickupAddress: 'Hostel Block B, Room 304, Flora Institute Campus',
    cityZone: 'Flora Institute of Technology Campus',
    landmark: 'Near Central Library Lawn',
    coordinates: { lat: 18.3525, lng: 73.8581 },
    scheduledDate: '2026-09-27',
    scheduledSlot: '03:30 PM - 06:30 PM (Evening Slot)',
    contactName: 'Aarav Mehta',
    contactPhone: '+91 98451 00293',
    specialInstructions: 'Sensitive electronics; battery pins taped for fire safety',
    status: 'assigned',
    driver: {
      id: 'DRV-103',
      name: 'Pooja Kulkarni',
      phone: '+91 99220 83419',
      vehicleNumber: 'MH-14-EW-5501 (E-Waste Secure Transporter)',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
      etaMinutes: 45,
    },
    createdAt: '2026-09-27T09:40:00Z',
    ecoPointsEarned: 560,
    co2OffsetKg: 49.0,
  },
  {
    id: 'REQ-103',
    trackingCode: 'FIT-7654',
    category: 'organic',
    itemDescription: 'Organic vegetable peels and coffee grounds from college pantry',
    estimatedWeightKg: 22.0,
    quantityUnits: '4 compost drums',
    pickupAddress: 'Flora Institutes Main Mess Hall, Pune',
    cityZone: 'Flora Institute of Technology Campus',
    landmark: 'Service Entry Gate 2',
    coordinates: { lat: 18.3498, lng: 73.8542 },
    scheduledDate: '2026-09-27',
    scheduledSlot: '08:30 AM - 11:30 AM (Morning Slot)',
    contactName: 'Sanjay Deshmukh',
    contactPhone: '+91 94220 18274',
    status: 'completed',
    completedAt: '2026-09-27T10:15:00Z',
    certificateId: 'REC-CERT-2026-8812',
    createdAt: '2026-09-26T17:30:00Z',
    ecoPointsEarned: 220,
    co2OffsetKg: 27.5,
  },
  {
    id: 'REQ-104',
    trackingCode: 'FIT-8199',
    category: 'paper',
    itemDescription: 'Bulk shredded exam question papers and corrugated delivery packing boxes',
    estimatedWeightKg: 35.0,
    quantityUnits: '8 packed cartons',
    pickupAddress: 'Admin Block, Ground Floor Records Room, Flora Institute of Technology',
    cityZone: 'Flora Institute of Technology Campus',
    landmark: 'Opposite Registrar Office',
    coordinates: { lat: 18.353, lng: 73.855 },
    scheduledDate: '2026-09-28',
    scheduledSlot: '08:30 AM - 11:30 AM (Morning Slot)',
    contactName: 'Neha Joshi',
    contactPhone: '+91 98811 74390',
    status: 'submitted',
    createdAt: '2026-09-27T11:05:00Z',
    ecoPointsEarned: 420,
    co2OffsetKg: 52.5,
  },
  {
    id: 'REQ-105',
    trackingCode: 'FIT-7422',
    category: 'metal',
    itemDescription: 'Decommissioned lab steel racks, aluminium window frames & copper wires',
    estimatedWeightKg: 65.0,
    quantityUnits: '1 heavy bundle',
    pickupAddress: 'Mechanical Workshop Building 4, Flora Institute',
    cityZone: 'Flora Institute of Technology Campus',
    landmark: 'Workshop Bay 2',
    coordinates: { lat: 18.3541, lng: 73.8538 },
    scheduledDate: '2026-09-26',
    scheduledSlot: '03:30 PM - 06:30 PM (Evening Slot)',
    contactName: 'Prof. K. Verma',
    contactPhone: '+91 97633 48190',
    status: 'completed',
    completedAt: '2026-09-26T16:45:00Z',
    certificateId: 'REC-CERT-2026-7422',
    createdAt: '2026-09-26T11:20:00Z',
    ecoPointsEarned: 2275,
    co2OffsetKg: 273.0,
  },
];

export const INITIAL_USER_PROFILE: CitizenImpactProfile = {
  name: 'Dhananjay Shinde',
  email: 'dhananjay.shinde@flora.ac.in',
  phone: '+91 98223 91023',
  ecoPoints: 1450,
  totalPickups: 6,
  totalKgRecycled: 114.5,
  co2SavedKg: 184.2,
  tier: 'Green Warrior',
  rank: 3,
};

const STORAGE_KEYS = {
  REQUESTS: 'fitfest_waste_requests_v1',
  DRIVERS: 'fitfest_drivers_v1',
  PROFILE: 'fitfest_user_profile_v1',
};

export function getStoredRequests(): WastePickupRequest[] {
  if (typeof window === 'undefined') return INITIAL_REQUESTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading requests from storage', err);
    return INITIAL_REQUESTS;
  }
}

export function saveStoredRequests(requests: WastePickupRequest[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  } catch (err) {
    console.error('Failed saving requests to storage', err);
  }
}

export function getStoredDrivers(): CollectorDriver[] {
  if (typeof window === 'undefined') return INITIAL_DRIVERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRIVERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(INITIAL_DRIVERS));
      return INITIAL_DRIVERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_DRIVERS;
  }
}

export function saveStoredDrivers(drivers: CollectorDriver[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
  } catch (err) {
    console.error('Failed saving drivers to storage', err);
  }
}

export function getStoredProfile(): CitizenImpactProfile {
  if (typeof window === 'undefined') return INITIAL_USER_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
      return INITIAL_USER_PROFILE;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_USER_PROFILE;
  }
}

export function saveStoredProfile(profile: CitizenImpactProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed saving profile', err);
  }
}
