"use strict";
//external library for sending emails
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: 'transferconnect2@gmail.com', //gmail account where email notifications are sent out from 
    pass: 'nntvoilmlnwbktif' //app password
  }
});


// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(user_email, bank_name, loyalty_program_name, outcomeCode, transferAmount) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"TransferConnect" <transferconnect2@gmail.com>', // sender address
    to: user_email, // reciever, taken from TransferConnect database
    subject: "Loyalty Points Transaction Status", // Subject line
    //will be refined to include message of outcome code
    text: `Status of transaction of ${transferAmount} from ${bank_name} to ${loyalty_program_name}: ${outcomeCode} `, // plain text body
  });

  console.log("Message sent: %s", info.messageId);}
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>




module.exports = {sendEmail};
