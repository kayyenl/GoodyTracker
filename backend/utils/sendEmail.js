const nodemailer = require('nodemailer')

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
    //we will define a transporter that carries ur email from one pt to another
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587, //according to documentation
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: { //this is just to mitigate some security issues
            rejectUnauthorized: false,
        }
    })


    //options are things like: who are u sending emails to?
    //where are you sending the emails from? whats the subject? message?
    const options = {
        from: sent_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        html: message, //we want to send an html email
    }

    //send email
    //err param contains error details, info contains success details..
    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info)
        }
    })
}

module.exports = sendEmail