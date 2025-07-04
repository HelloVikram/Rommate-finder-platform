const  sendContactEmail  = require('../services/emailService');

const contactOwner = async (req, res) => {
  const { to, senderName, senderEmail, message } = req.body;

  if (!to || !senderEmail || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    await sendContactEmail({ to, senderName, senderEmail, message });
    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Error sending email:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
};

module.exports = { contactOwner };
