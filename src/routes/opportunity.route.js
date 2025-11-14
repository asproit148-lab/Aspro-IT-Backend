import express from "express";
import {
  addOpportunity,
  deleteOpportunity,
  getAll,
  getInternships,
  getJobs,
} from "../controllers/opportunityController.js";

const router = express.Router();

router.post("/add", addOpportunity);
router.delete("/delete/:id", deleteOpportunity);
router.get("/all", getAll);
router.get("/internships", getInternships);
router.get("/jobs", getJobs);

export default router;
