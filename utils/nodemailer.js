const nodemailer = require('nodemailer');
require ('dotenv').config()

async function sendVerifyEmail(userEmail,otp){

const mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    requireTLS: true,
    auth:{
        user:process.env.SMTP_USER ,
        pass: process.env.SMTP_PASS
    }
})

const message = {
    from: "district11",
    to: userEmail,
    subject: "Email Verification OTP",
    text: `Your OTP code is ${otp}. Please enter this code to verify your email address.`,
    html: `<p>Your OTP code is <strong>${otp}</strong>. Please enter this code to verify your email address.</p>`
}

const info = await mailTransporter.sendMail(message, (err)=>{
    if(err){
        console.log("Sending email failed",err);
    }else{
        console.log("Email sent successfully",info.messageId);
    }
})

}

module.exports = {sendVerifyEmail};