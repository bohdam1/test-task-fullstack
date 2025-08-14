import { Schema, model, Document, Types } from "mongoose";

export interface IAd extends Document {
  title: string;
  description: string;
  category: string;
  price: number;
  city: string;
  images: string[];
  userId: Types.ObjectId; 
  createdAt: Date;
}

const adSchema = new Schema<IAd>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  city: { type: String, required: true },
  images: { type: [String], default: [] },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
  createdAt: { type: Date, default: Date.now }
});

export const Ad = model<IAd>("Ad", adSchema);
