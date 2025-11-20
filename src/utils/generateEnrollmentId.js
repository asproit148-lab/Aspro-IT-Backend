export const generateEnrollmentId = (userId, courseId) => {
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random
  return `ENR-${userId.toString().slice(-4)}-${courseId.toString().slice(-4)}-${random}`;
};
