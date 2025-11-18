
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import courseRoutes from './routes/course.route.js';
import userRoutes from './routes/user.route.js';
import emailRoutes from './routes/email.route.js';
import bannerRoutes from './routes/banner.route.js';
import paymentRoutes from "./routes/payment.route.js";
import blogRoutes from "./routes/blog.route.js";
import chatbotRoutes from "./routes/chatbot.route.js";
import couponRoutes from "./routes/coupon.route.js";
import certificateRoutes from './routes/certificate.route.js';
import opportunityRoutes from "./routes/opportunity.route.js";
import resourceRoutes from './routes/resource.route.js';



const app=express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
}));


app.use('/api/course',courseRoutes);
app.use('/api/user',userRoutes);
app.use('/api/email',emailRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/coupon", couponRoutes);
app.use('/api/certificate', certificateRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use('/api/resources',resourceRoutes);



console.log("hi")

app.get("/", (req, res) => {
  res.send("✅ Aspro It backend is running!");
});

export default app;