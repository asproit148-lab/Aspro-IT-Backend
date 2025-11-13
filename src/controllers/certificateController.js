import certificateService from '../services/certificateService.js';
import path from 'path';

const generateCertificate = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { courseId, startDate, completionDate, grade } = req.body;

    if (!userId || !courseId || !startDate || !completionDate || !grade) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: courseId, startDate, completionDate, and grade"
      });
    }

    const certificate = await certificateService.generateCertificate(
      userId,
      courseId,
      startDate,
      completionDate,
      grade
    );

    return res.status(201).json({
      success: true,
      message: "Certificate generated successfully",
      certificate
    });
  } catch (err) {
    console.error("Error generating certificate:", err);
    res.status(400).json({
      success: false,
      message: err.message || "Failed to generate certificate"
    });
  }
};

const downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const userId = req.user?._id;

    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: "Please provide certificateId"
      });
    }

    const certificate = await certificateService.getCertificateById(certificateId);

    // Verify user owns this certificate
    if (certificate.userId._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to certificate"
      });
    }

    // Send file for download
    const filePath = path.join(process.cwd(), certificate.certificateUrl);
    return res.download(filePath, `Certificate-${certificate.certificateNumber}.png`);
  } catch (err) {
    console.error("Error downloading certificate:", err);
    res.status(404).json({
      success: false,
      message: err.message || "Certificate not found"
    });
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
  generateCertificate,
  downloadCertificate,
  getUserCertificates,
  getCertificateById,
  verifyCertificate,
  getAllCertificates
};