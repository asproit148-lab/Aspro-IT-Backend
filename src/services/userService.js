import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const googleAuthService = async (googleToken) => {
  const ticket = await client.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { email, name, picture } = ticket.getPayload();

  // Check if user exists
  let user = await User.findOne({ email });

  // Create new user if not found
  if (!user) {
    user = await User.create({
      name,
      email,
      profilePic: picture,
      isGoogleUser: true,
    });
  }

  // Generate JWT tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token in DB
  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

const register = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) return "user already exists";

  const hashedPassword = await bcrypt.hash(password, 8);
  const user = await User.create({ name, email, password: hashedPassword });
  return user;
};


const login = async (email, password) => {
  console.time("TOTAL_LOGIN_TIME");

  console.time("db_time")
  const user = await User.findOne({ email });
  if (!user) throw new Error("user does not exist");
    console.timeEnd("db_time")

  console.time("password_matching");
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) throw new Error("incorrect password");
    console.timeEnd("password_matching");

  console.time("GENERATE_TOKEN");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  console.timeEnd("GENERATE_TOKEN");

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };
console.timeEnd("TOTAL_LOGIN_TIME");

  return {
    message: "User logged in successfully",
    accessToken,
    refreshToken,
    options,
    user
  };
};


const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new Error("Refresh token required");

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded?._id);
  if (!user) throw new Error("User not found");
  if (user.refreshToken !== refreshToken)
    throw new Error("Refresh token invalid or expired");

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return { newAccessToken, newRefreshToken, options };
};

const generateAccessToken = (user) =>
  jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "30m" }
  );

const generateRefreshToken = (user) =>
  jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  });

const getUserInfo=async(userId)=>{

  const user=await User.findById(userId)

  if (user && user.coursesEnrolled && user.coursesEnrolled.length > 0) {
  await user.populate("coursesEnrolled");
}
  if(!user){
    throw new Error("user not found");
  }

  return user;
}

export default { register, login, refreshAccessToken, googleAuthService,getUserInfo };
