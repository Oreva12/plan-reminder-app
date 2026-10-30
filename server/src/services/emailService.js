const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter;

if (env.SMTP_HOST === 'localhost' || env.SMTP_HOST === 'mailpit') {
  // DEVELOPMENT MODE: Don't send real emails. Print them to the console.
  console.log('📧 Email Service: Using CONSOLE output (no real emails sent)');
  
  transporter = {
    sendMail: async (options) => {
      console.log('\n========== NEW EMAIL (Console Output) ==========');
      console.log(`To:      ${options.to}`);
      console.log(`From:    ${options.from}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`---`);
      console.log(options.text);
      console.log('================================================\n');
      return { messageId: 'console-' + Date.now() };
    }
  };
} else {
  // PRODUCTION MODE: Actually send via SMTP
  console.log('📧 Email Service: Using SMTP');
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });
}

async function sendEmail({ to, subject, text, html }) {
  return transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendEmail };