const nodemailer = require('nodemailer');

export const  mailSender = async (options: { email: string, subject: string, message: string }) => {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        
        auth: {
            user:  process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    await transporter.sendMail(mailOptions)
}
