import nodemailer from "nodemailer";

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: '"EVENT MANAGEMENT" <sobitshakya5@gmail.com>',
      to: email,
      subject: subject,
      html: html,
    });

    console.log(`Email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    return false;
  }
};

export default sendEmail;
