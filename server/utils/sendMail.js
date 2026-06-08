import nodemailer from "nodemailer";
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const sendMail=async(options)=>{
    const transporter= nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT || 587,
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD
        }

    });
    const {email,subject,template,data}=options;
    // get the path to the email template
    const templatePath=path.join(__dirname, '../mails',template)

// render the email template
const html= await ejs.renderFile(templatePath,data);

// send the email
const mailOptions={
    from: process.env.SMTP_MAIL,
    to:email,
    subject,
    html
}
await transporter.sendMail(mailOptions);
}

export default sendMail;

