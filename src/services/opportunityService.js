import Opportunity from "../models/opportunityModel.js";

export const addOpportunity = async (data) => {
  return await Opportunity.create(data);
};

export const deleteOpportunity = async (id) => {
  return await Opportunity.findByIdAndDelete(id);
};

export const getAllOpportunities = async () => {
  return await Opportunity.find().sort({ createdAt: -1 });
};

export const getInternships = async () => {
  return await Opportunity.find({ type: "Internship" }).sort({ createdAt: -1 });
};

export const getJobs = async () => {
  return await Opportunity.find({ type: "Job" }).sort({ createdAt: -1 });
};
