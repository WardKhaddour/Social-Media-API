import { createTransport } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions) => {
  //1) Create a transporter
  const transporter = createTransport(
    new SMTPTransport({
      host: process.env.EMAIL_HOST!,
      port: +process.env.EMAIL_PORT!,

      auth: {
        user: process.env.EMAIL_USERNAME!,
        pass: process.env.EMAIL_PASSWORD!,
      },
    })
  );
  //2) Define the email options
  const mailOptions: MailOptions = {
    from: 'Ward Khaddour <wardkhaddot@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3) Actually send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
