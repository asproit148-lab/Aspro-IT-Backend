import * as OpportunityService from "../services/opportunityService.js";

// Add new opportunity
export const addOpportunity = async (req, res) => {
  try {
    const opportunity = await OpportunityService.addOpportunity(req.body);
    res.status(201).json({ success: true, data: opportunity });
  } catch (error) {
    console.error("Opportunity Add Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete opportunity
export const deleteOpportunity = async (req, res) => {
  try {
    await OpportunityService.deleteOpportunity(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all opportunities
export const getAll = async (req, res) => {
  try {
    const opportunities = await OpportunityService.getAllOpportunities();
    res.json({ success: true, data: opportunities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Student: Get only internships
export const getInternships = async (req, res) => {
  try {
    const internships = await OpportunityService.getInternships();
    res.json({ success: true, data: internships });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Student: Get only jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await OpportunityService.getJobs();
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};