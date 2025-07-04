const SibApiV3Sdk = require('sib-api-v3-sdk');

SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const sendContactEmail = async ({ to, senderName, senderEmail, message }) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const emailContent = {
    sender: { name: 'Roommate Finder', email: process.env.EMAIL_SENDER }, 
    to: [{ email: to }],
    subject: `New message from ${senderName}`,
    htmlContent: `
      <p><strong>${senderName}</strong> is interested in your room listing.</p>
      <p>Message: ${message}</p>
      <p>Email: <a href="mailto:${senderEmail}">${senderEmail}</a></p>
    `
  };

  await apiInstance.sendTransacEmail(emailContent);
};

module.exports =  sendContactEmail ;
