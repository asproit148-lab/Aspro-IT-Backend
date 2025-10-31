export async function sendEmail(transporter, { to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: ` <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html
  });

  return info;
}
