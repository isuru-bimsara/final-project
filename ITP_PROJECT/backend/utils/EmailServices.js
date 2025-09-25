const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

async function createTransporter() {
  if (process.env.EMAIL_TRANSPORT === "ethereal") {
    const testAccount = await nodemailer.createTestAccount();
    console.log("📧 Using Ethereal test account:", testAccount.user);
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
  if (process.env.EMAIL_TRANSPORT === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  throw new Error(
    '❌ EMAIL_TRANSPORT not set or unsupported. Use "ethereal" or "gmail".'
  );
}

async function sendOtpEmail(toEmail, code) {
  try {
    const transporter = await createTransporter();
    const subject = "Your verification code (OTP)";
    const html = `
      <p>Dear User,</p>
      <p>We received a request to log in to your account. Please use the following verification code to complete your login:</p>
      <h2 style='color:#2e6c80;'>${code}</h2>
      <p>This code will expire in ${
        process.env.OTP_EXPIRATION_MINUTES || 5
      } minutes.</p>
      <p>If you did not request this, you can safely ignore this email. No changes will be made to your account.</p>
      <br/>
      <p>Best regards,<br/>Your App Team</p>
    `;
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject,
      html,
    });
    if (process.env.EMAIL_TRANSPORT === "ethereal") {
      console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));
    }
    console.log(`✅ OTP email sent to ${toEmail}`);
    return info;
  } catch (err) {
    console.error("❌ Error sending OTP email:", err);
    throw err;
  }
}

async function sendWelcomeEmail(toEmail, userName) {
  try {
    const transporter = await createTransporter();
    const subject = "🎉 Welcome to Our App!";
    // Read and process the welcome.html template
    const templatePath = path.join(__dirname, "welcome.html");
    let html = fs.readFileSync(templatePath, "utf8");
    html = html
      .replace("{{username}}", userName)
      .replace("{{year}}", new Date().getFullYear());
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject,
      html,
    });
    if (process.env.EMAIL_TRANSPORT === "ethereal") {
      console.log(
        "🔗 Preview URL:",
        require("nodemailer").getTestMessageUrl(info)
      );
    }
    console.log(`✅ Welcome email sent to ${toEmail}`);
    return info;
  } catch (err) {
    console.error("❌ Error sending welcome email:", err);
    throw err;
  }
}

module.exports = { sendOtpEmail, sendWelcomeEmail };
