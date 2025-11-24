import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  profilePic: String,
  isGoogleUser: { type: Boolean, default: false },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  coursesEnrolled: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      enrollmentId: { type: String, required: true },
      enrolledAt: { type: Date, default: Date.now }
    }
  ],

  phone_no: String,
  Mode_of_training: String,
  refreshToken: String,
});

const User = mongoose.model("User", userSchema);
export default User;
