import mongoose, { Schema, model, models } from "mongoose";

export interface ILead {
  markets: string[];
  agentType: string;
  agencySize?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consent: boolean;
  howSoon?: string;
  monthlyBudget?: string;
  contactMethod?: string;
  bestTime?: string;
  status: "new" | "contacted" | "qualified" | "closed" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    markets: {
      type: [String],
      required: true,
    },
    agentType: {
      type: String,
      required: true,
    },
    agencySize: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    consent: {
      type: Boolean,
      required: true,
      default: false,
    },
    howSoon: {
      type: String,
      required: false,
    },
    monthlyBudget: {
      type: String,
      required: false,
    },
    contactMethod: {
      type: String,
      required: false,
    },
    bestTime: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "closed", "rejected"],
      default: "new",
    },
  },
  {
    timestamps: true,
  },
);

const Lead = models.Lead || model<ILead>("Lead", LeadSchema);

export default Lead;
