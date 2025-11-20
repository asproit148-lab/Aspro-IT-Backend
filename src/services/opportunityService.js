import Opportunity from "../models/opportunityModel.js";

// Add a job/internship
export const addOpportunity = async (data) => {
  return await Opportunity.create(data);
};

// Delete an opportunity
export const deleteOpportunity = async (id) => {
  return await Opportunity.findByIdAndDelete(id);
};

// Get all opportunities (admin view)
export const getAllOpportunities = async () => {
  // Admin should see everything, sorted by creation date
  return await Opportunity.find().sort({ createdAt: -1 });
};

// Get only jobs (student view)
export const getJobs = async () => {
  return await Opportunity.find({ type: "Job" }).sort({ createdAt: -1 });
};

// Get only internships (student view)
export const getInternships = async () => {
  return await Opportunity.find({ type: "Internship" }).sort({ createdAt: -1 });
};