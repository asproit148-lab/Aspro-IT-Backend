export const courseToText = (course) => {
  return `
  Course Title: ${course.Course_title}
  Description: ${course.Course_description}
  Type: ${course.Course_type}
  Cost: ${course.Course_cost}
  Discount: ${course.Discount}

  Skills: ${(course.Skills || []).join(", ")}

  What you will learn:
  ${(course.What_you_will_learn || []).join(", ")}

  Modules:
  ${(course.Modules || []).map(m => m.title || "").join(", ")}

  FAQs:
  ${(course.FAQs || []).map(f => `${f.question} - ${f.answer}`).join("\n")}
  `;
};
