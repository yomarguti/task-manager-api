const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "yomar.guti@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the TaskApp ${name}. Let me know how you get along with the app`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "yomar.guti@gmail.com",
    subject: "Cancel TaskApp account",
    text: `Goobye ${name}. I hope see you back sometime soon`,
  });
};

module.exports = { sendWelcomeEmail, sendCancelationEmail };
