import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Job", "Internship"],
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  roleTitle: {
    type: String,
    required: true,
  },
  ctcOrStipend: {
    type: String,
    required: true,
  },
  companyWebsite: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.model("Opportunity", opportunitySchema);