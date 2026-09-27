import mongoose, { Schema, Document, Model } from 'mongoose';
import { WasteCategory, RequestStatus } from '@/types/waste';

export interface IWasteRequest extends Document {
  id: string;
  trackingCode: string;
  category: WasteCategory;
  itemDescription: string;
  estimatedWeightKg: number;
  quantityUnits: string;
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

const WasteRequestSchema = new Schema<IWasteRequest>(
  {
    id: { type: String, required: true, unique: true },
    trackingCode: { type: String, required: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ['organic', 'plastic', 'ewaste', 'hazardous', 'paper', 'metal'],
      index: true,
    },
    itemDescription: { type: String, required: true },
    estimatedWeightKg: { type: Number, required: true },
    quantityUnits: { type: String, required: true },
    pickupAddress: { type: String, required: true },
    cityZone: { type: String, required: true },
    landmark: { type: String },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    scheduledDate: { type: String, required: true },
    scheduledSlot: { type: String, required: true },
    contactName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    specialInstructions: { type: String },
    imageUrl: { type: String },
    status: {
      type: String,
      required: true,
      enum: ['submitted', 'assigned', 'on_the_way', 'completed', 'cancelled'],
      default: 'submitted',
      index: true,
    },
    driver: {
      id: String,
      name: String,
      phone: String,
      vehicleNumber: String,
      avatar: String,
      etaMinutes: Number,
    },
    createdAt: { type: String, required: true },
    completedAt: { type: String },
    ecoPointsEarned: { type: Number, required: true },
    co2OffsetKg: { type: Number, required: true },
    certificateId: { type: String },
  },
  { timestamps: true, collection: 'waste_requests' }
);

export const WasteRequestModel: Model<IWasteRequest> =
  mongoose.models.WasteRequest || mongoose.model<IWasteRequest>('WasteRequest', WasteRequestSchema);
