import Opportunity from "../models/opportunityModel.js";
import { indexToPinecone, deleteFromPinecone } from "../utils/indexer.js";


const opportunityToText = (opportunity) => {
  return `Title: ${opportunity.title}\nType: ${opportunity.type}\nDescription: ${opportunity.description}\nCompany: ${opportunity.company}\nLocation: ${opportunity.location}`;
};


// Add a job/internship
export const addOpportunity = async (data) => {
  const newOpportunity = await Opportunity.create(data);

  // 🔥 Index in Pinecone
  await indexToPinecone({
    id: newOpportunity._id,
    type: "opportunity",
    text: opportunityToText(newOpportunity),
    metadata: {
      title: newOpportunity.title,
      type: newOpportunity.type,
      company: newOpportunity.company,
      location: newOpportunity.location
    }
  });

  return newOpportunity;
};

// Delete an opportunity
export const deleteOpportunity = async (id) => {
  const deleted = await Opportunity.findByIdAndDelete(id);
  if (deleted) {
    await deleteFromPinecone("opportunity", id);
  }
  return deleted;
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