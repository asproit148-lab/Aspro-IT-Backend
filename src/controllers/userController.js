import userService from "../services/userService.js";
import User from "../models/userModel.js";

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Google token required" });

    const { user, accessToken, refreshToken } =
      await userService.googleAuthService(token);

    const options = { httpOnly: true, secure: true, sameSite: "none" };

    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json({
        message: "Google login successful",
        accessToken,
        refreshToken,
        user,
      });
  } catch (error) {
    console.error("Google login error:", error);
    res
      .status(500)
      .json({ message: "Google login failed", error: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json("please provide all details");

    const user = await userService.register(name, email, password);
    if (user === "user already exists")
      return res.status(400).json({ message: "user already exists" });

    return res
      .status(201)
      .json({ message: "user registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await userService.login(email, password);

    const { accessToken, refreshToken, options } = data;

    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json(data);
  } catch (error) {
    res
      .status(400)
      .json({ message: "user login failed", error: error.message });
  }
};


export const refreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;
    const data = await userService.refreshAccessToken(oldRefreshToken);

    const { newAccessToken, newRefreshToken, options } = data;

    res
      .cookie("accessToken", newAccessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .status(200)
      .json({
        message: "Tokens refreshed successfully",
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
  } catch (error) {
    res
      .status(403)
      .json({ message: "Token refresh failed", error: error.message });
  }
};


export const logoutUser = async (req, res) => {
  try {
    if (req.user?._id) {
      await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    }

    const options = { httpOnly: true, sameSite: "none", secure: true };

    res
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error during logout" });
  }
};

export const getUser=async(req,res)=>{
  const userId=req.user?._id;

  const user=await userService.getUserInfo(userId);

  if(!user){
    return res.status(404).json("user not found");
  }

  return res.status(200).json({message:"user fetched successfully",user});
}

export const totalEnrollment=async(req,res)=>{
  const enrollments=await userService.getTotalEnrollments();

  return res.status(200).json({message:"total enrollments fetched successfully",enrollments});
}
