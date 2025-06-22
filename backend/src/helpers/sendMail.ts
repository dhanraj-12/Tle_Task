import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config();


const sendMail = async (to: string, name: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
    });

    await transporter.sendMail({
        from: `"Codeforces Tracker" <${process.env.MAIL_USER}>`,
        to,
        subject: "Reminder: No Codeforces activity in the last 7 days!",
        html: `<p>Hi ${name},</p>
               <p>We noticed you haven’t submitted any problems on Codeforces in the past 7 days.</p>
               <p>Keep up your streak! 🚀</p>
               <p>— Your CF Tracker Bot 🤖</p>`,
    });
}

export default sendMail;
