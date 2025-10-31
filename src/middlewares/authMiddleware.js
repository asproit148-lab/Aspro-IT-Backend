import jwt from "jsonwebtoken";
import  User  from "../models/userModel.js";

export const authenticate = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, please login" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded || !decoded._id) {
      return res.status(401).json({ message: "Invalid token" });
    }


    const user = await User.findById(decoded._id).select("-password -refreshToken");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid access token" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
};
