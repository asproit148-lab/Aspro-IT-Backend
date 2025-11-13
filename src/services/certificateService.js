import Certificate from "../models/certificateModel.js";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';
import fs from 'fs';

// Register fonts (make sure you have these font files)
// registerFont('path/to/your/font.ttf', { family: 'YourFont' });

const generateCertificate = async (userId, courseId, startDate, completionDate, grade) => {
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
  let certificate = await Certificate.findOne({ userId, courseId });

  if (certificate) {
    return certificate;
  }

  // Create new certificate record
  certificate = new Certificate({
    userId,
    courseId,
    studentName: user.name,
    courseName: course.Course_title,
    startDate,
    completionDate,
    grade
  });

  await certificate.save();

  // Generate certificate image
  const certificatePath = await createCertificateImage(certificate);
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