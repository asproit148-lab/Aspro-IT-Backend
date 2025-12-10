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
  What_you_will_learn: [
    {
      type: String,
    }
  ],

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
  const discountPercent = Number(this.Discount) || 0;

  const discountedAmount = (cost * discountPercent) / 100;
  const finalCost = cost - discountedAmount;

  this.Final_cost = finalCost >= 0 ? finalCost : 0;

  next();
});

export default mongoose.model("Course", courseSchema);
