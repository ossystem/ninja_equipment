const config = require('./config.js');
const nodemailer = require('nodemailer');

const send = async (recipients, subject, text, attachments) => {
    try {
      const transporter = nodemailer.createTransport(config.mail);
      const mailOptions = {
          from: '"Online shop Ninja equipment" <foo@example.com>',
          to: recipients.join(','),
          subject: subject,
          text: text,
          html: text
      };

      if(attachments){
        mailOptions.attachments = attachments;
      }

      await transporter.sendMail(mailOptions);
    } catch(err){
      console.log('err mail.send:', err);
    }

    return true;
};


module.exports = {
  send
};