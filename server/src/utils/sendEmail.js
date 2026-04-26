import { Resend } from "resend";

/**
 * Sends an email using the Resend SDK.
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Plain text message
 * @param {string} options.html - HTML content
 */
const sendEmail = async (options) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "U-Share <onboarding@resend.dev>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  });

  if (error) {
    console.error("RESEND_ERROR:", error);
    throw new Error(error.message || "Failed to send email via Resend");
  }

  return data;
};

export default sendEmail;
