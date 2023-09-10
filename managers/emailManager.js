// centralising the email logic
const nodemailer = require("nodemailer");

const emailManager = async (to, text, html, subject) => {
  // transport is like configure of nodemailer
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "f4f6b4d6bff3cb",
      pass: "37062f7aeca0d8",
    },
  });

  await transport.sendMail({
    to: to,
    from: "info@expensetracker.com",
    text: text,
    html: html,
    subject: subject,
  });
};

module.exports = emailManager;
