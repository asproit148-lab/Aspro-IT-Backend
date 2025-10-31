const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone_no: String,
  course_name: String,
  registration_no: {
    type: String,
    unique: true,
    required: true
  },
  certificate_url: String,  
  isCompleted: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("Enrollment", enrollmentSchema);
