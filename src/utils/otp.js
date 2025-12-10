import crypto from "crypto";

export function generateOTP(length = 6) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

export function hashOTP(otp, salt = "") {
  return crypto.createHash("sha256").update(otp + salt).digest("hex");
}

export function expiryMinutesFromNow(minutes = 5) {
  return new Date(Date.now() + minutes * 60 * 1000);
}
