import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  Course_title: {
    type: String,
    required: true,
  },

  Course_description: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
  },

  Course_type: {
    type: String,
    enum: ["Online", "Offline"],
    required: true,
  },

  Skills: [
    {
      type: String,
    },
  ],

  Modules: [
    {
      module_name: String,
      module_description: String,
    },
  ],

  Course_cost: {
    type: Number,
    required: true,
  },

  Discount: {
    type: Number,
    default: 0,
  },

  Final_cost: {
    type: Number,
  },

  FAQs: [
    {
      question: String,
      answer: String,
    },
  ],
});

courseSchema.pre("save", function (next) {
  const cost = Number(this.Course_cost) || 0;
  const discount = Number(this.Discount) || 0;
  this.Final_cost = cost - discount;
  next();
});

export default mongoose.model("Course", courseSchema);
