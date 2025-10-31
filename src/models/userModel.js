import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  coursesEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Reference to Course model
    },
  ],
  phone_no: {
    type: String,
  },
  Mode_of_training: {
    type: String,
  },
  refreshToken: {
    type: String,
  }
});

const User = mongoose.model("User", userSchema);

export default User;
