import certificateService from '../services/certificateService.js';
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloadCertificate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: "User or course not found" });
    }

    if (!user.coursesEnrolled.includes(courseId)) {
      return res.status(403).json({ message: "User not enrolled in this course" });
    }

    const certificatesDir = path.resolve("certificates");
    if (!fs.existsSync(certificatesDir)) fs.mkdirSync(certificatesDir);

    const certificatePath = path.join(
      certificatesDir,
      `${user.name}_${course.Course_title}.pdf`
    );

    // ✅ Use absolute path and PNG format
const templatePath = path.join(__dirname, "..", "assets", "aspro_certificate.jpg");

    console.log("Template Path:", templatePath);
    if (!fs.existsSync(templatePath)) {
      console.error("Template file not found!");
      return res.status(500).json({ message: "Template not found" });
    }

    const doc = new PDFDocument({ size: "A4", layout: "landscape" });
    const stream = fs.createWriteStream(certificatePath);
    doc.pipe(stream);

    // ✅ Draw background first
    doc.image(templatePath, 0, 0, { width: 842});

    // ✅ Then draw text over it
    doc.fontSize(22).fillColor("black");
    doc.text(user.name, 350, 237);
doc.fontSize(20).text(course.Course_title, 300, 273);
    doc.text("A+", 500, 310);

    doc.fontSize(12);
    doc.text(`${new Date().toLocaleDateString()}`, 613, 427);
    doc.text(`${user._id}`, 635, 400);

    doc.end();

    stream.on("finish", () => {
      res.download(certificatePath);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating certificate" });
  }
};


const getUserCertificates = async (req, res) => {
  try {
    const userId = req.user?._id;

    const certificates = await certificateService.getUserCertificates(userId);

    return res.status(200).json({
      success: true,
      message: "Certificates fetched successfully",
      count: certificates.length,
      certificates
    });
  } catch (err) {
    console.error("Error fetching certificates:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getCertificateById = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: "Please provide certificateId"
      });
    }

    const certificate = await certificateService.getCertificateById(certificateId);

    return res.status(200).json({
      success: true,
      message: "Certificate details fetched successfully",
      certificate
    });
  } catch (err) {
    console.error("Error fetching certificate:", err);
    res.status(404).json({
      success: false,
      message: err.message || "Certificate not found"
    });
  }
};

const verifyCertificate = async (req, res) => {
  try {
    const { certificateNumber } = req.params;

    if (!certificateNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide certificate number"
      });
    }

    const certificate = await certificateService.verifyCertificate(certificateNumber);

    return res.status(200).json({
      success: true,
      message: "Certificate verified successfully",
      valid: true,
      certificate
    });
  } catch (err) {
    console.error("Error verifying certificate:", err);
    res.status(404).json({
      success: false,
      valid: false,
      message: err.message || "Invalid certificate number"
    });
  }
};

const getAllCertificates = async (req, res) => {
  try {
    const certificates = await certificateService.getAllCertificates();

    return res.status(200).json({
      success: true,
      message: "All certificates fetched successfully",
      count: certificates.length,
      certificates
    });
  } catch (err) {
    console.error("Error fetching all certificates:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export {
  downloadCertificate,
  getUserCertificates,
  getCertificateById,
  verifyCertificate,
  getAllCertificates
};