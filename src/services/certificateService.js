import Certificate from "../models/certificateModel.js";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import PDFDocument from 'pdfkit';

import path from 'path';
import fs from 'fs';



const generateCertificate = async (userId, courseId) => {
  // Verify user is enrolled
  const user = await User.findById(userId);
  const course = await Course.findById(courseId);

  if (!user || !course) {
    throw new Error("User or course not found");
  }

  if (!user.coursesEnrolled.includes(courseId)) {
    throw new Error("User is not enrolled in this course");
  }

  // Check if certificate already exists
   const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape'
    });

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename=${course.Course_title}_Certificate.pdf`);
    res.setHeader('Content-Type', 'application/pdf');

    // Pipe directly to response
    doc.pipe(res);

    // Background template (optional)
    const templatePath = path.join(process.cwd(), 'templates', 'certificate-template.png');
    if (fs.existsSync(templatePath)) {
      doc.image(templatePath, 0, 0, { width: 842 });
    }

    // Add dynamic data
    doc.fontSize(30).fillColor('#333').text('Certificate of Completion', 200, 150);
    doc.fontSize(20).fillColor('#000').text(`This certifies that`, 250, 220);
    doc.fontSize(26).fillColor('#0056b3').text(user.name, 250, 260);
    doc.fontSize(20).fillColor('#000').text(`has successfully completed the course`, 200, 310);
    doc.fontSize(24).fillColor('#444').text(course.Course_title, 200, 350);
    doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`, 200, 400);
    doc.fontSize(14).text(`Certificate ID: ${enrollment.registration_no}`, 200, 420);

    doc.end();
  certificate.certificateUrl = certificatePath;
  await certificate.save();

  return certificate;
};

const createCertificateImage = async (certificate) => {
  // Load the template image
  const templatePath = path.join(process.cwd(), 'templates', 'certificate-template.png');
  const image = await loadImage(templatePath);

  // Create canvas with same dimensions as template
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');

  // Draw template
  ctx.drawImage(image, 0, 0);

  // Set text properties
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';

  // Student Name (after "This is Certify that")
  ctx.font = 'bold 40px Arial';
  ctx.fillText(certificate.studentName, canvas.width / 2, 420);

  // Course Name (after "Has successfully completed")
  ctx.font = 'bold 35px Arial';
  ctx.fillText(certificate.courseName, canvas.width / 2, 480);

  // From Date
  ctx.font = '28px Arial';
  ctx.textAlign = 'left';
  const fromDate = new Date(certificate.startDate).toLocaleDateString('en-GB');
  ctx.fillText(fromDate, 420, 565);

  // To Date
  ctx.textAlign = 'left';
  const toDate = new Date(certificate.completionDate).toLocaleDateString('en-GB');
  ctx.fillText(toDate, 730, 565);

  // Grade
  ctx.textAlign = 'left';
  ctx.fillText(certificate.grade, 720, 615);

  // Certificate Number (bottom right)
  ctx.font = '24px Arial';
  ctx.textAlign = 'right';
  ctx.fillText(certificate.certificateNumber, canvas.width - 150, 720);

  // Issue Date (bottom right)
  const issueDate = new Date(certificate.issuedDate).toLocaleDateString('en-GB');
  ctx.fillText(issueDate, canvas.width - 150, 765);

  // Save certificate
  const outputDir = path.join(process.cwd(), 'uploads', 'certificates');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `certificate-${certificate.certificateNumber}.png`;
  const outputPath = path.join(outputDir, filename);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);

  return `/uploads/certificates/${filename}`;
};

const getUserCertificates = async (userId) => {
  const certificates = await Certificate.find({ userId })
    .populate('courseId', 'Course_title Course_category')
    .sort({ issuedDate: -1 });

  return certificates;
};

const getCertificateById = async (certificateId) => {
  const certificate = await Certificate.findById(certificateId)
    .populate('userId', 'name email')
    .populate('courseId', 'Course_title Course_category');

  if (!certificate) {
    throw new Error("Certificate not found");
  }

  return certificate;
};

const verifyCertificate = async (certificateNumber) => {
  const certificate = await Certificate.findOne({ certificateNumber })
    .populate('userId', 'name email')
    .populate('courseId', 'Course_title Course_category');

  if (!certificate) {
    throw new Error("Certificate not found or invalid");
  }

  return certificate;
};

const getAllCertificates = async () => {
  const certificates = await Certificate.find()
    .populate('userId', 'name email')
    .populate('courseId', 'Course_title Course_category')
    .sort({ issuedDate: -1 });

  return certificates;
};

export default {
  generateCertificate,
  getUserCertificates,
  getCertificateById,
  verifyCertificate,
  getAllCertificates
};