import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  certificateNumber: {
    type: String,
    required: true,
    unique: true
  },
  studentName: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  completionDate: {
    type: Date,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  certificateUrl: {
    type: String
  },
  issuedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate unique certificate number
certificateSchema.pre('save', async function(next) {
  if (!this.certificateNumber) {
    const count = await mongoose.model('Certificate').countDocuments();
    this.certificateNumber = `ASPRO-${Date.now()}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;