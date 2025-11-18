import {  sendEmail } from "../services/emailService.js";
import {createTransporter} from '../utils/sendEmail.js'

const EnquiryForm=async(req,res)=>{
  const{name,email,phone_no,course_name,Mode_of_training}=req.body;

  if(!name || !email || !phone_no || !course_name || !Mode_of_training){
    return res.status(400).json({error:"please provide all fields"})
  }

   const transporter = createTransporter();

  const info = await sendEmail(transporter,{
    to: email,
      subject: "You have received a new enquiry form submission",
      text: `Full Name: ${name}
Email: ${email}
Phone: ${phone_no}
courseName: ${course_name}
training:${Mode_of_training}
Date & Time: ${new Date().toLocaleString()}`
    });
  return res.json({ ok: true, info });
  }

const ContactForm=async(req,res)=>{
  const{name,phone_no,message}=req.body;
  if(!name || !phone_no || !message){
    return res.status(400).json({error:"please provide all fields"})
  }
    const transporter = createTransporter();
  const info = await sendEmail(transporter,{
    to:process.env.EMAIL_USER,
      subject: "You have received a new contact form submission",
      text: `Full Name: ${name}
Phone: ${phone_no}
Message: ${message}
Date & Time: ${new Date().toLocaleString()}`
    });
  return res.json({ ok: true, info });
  }



export  {EnquiryForm,ContactForm};