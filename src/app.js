import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import courseRoutes from "./routes/course.route.js";
import userRoutes from "./routes/user.route.js";
import emailRoutes from "./routes/email.route.js";
import bannerRoutes from "./routes/banner.route.js";
import paymentRoutes from "./routes/payment.route.js";
import blogRoutes from "./routes/blog.route.js";
import chatbotRoutes from "./routes/chatbot.route.js";
import couponRoutes from "./routes/coupon.route.js";
import certificateRoutes from "./routes/certificate.route.js";
import opportunityRoutes from "./routes/opportunity.route.js";
import resourceRoutes from "./routes/resource.route.js";
import questionRoutes from "./routes/question.route.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://aspro-it-frontend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());

app.use("/api/course", courseRoutes);
app.use("/api/user", userRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/questions", questionRoutes);

app.get("/", (req, res) => {
  res.send("✅ Aspro IT backend is running!");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
