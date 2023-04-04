import { createTransport } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import pug from 'pug';
import { htmlToText } from 'html-to-text';

class Email {
  to: string;
  token: string;
  from: string = `Ward Khaddour <${process.env.EMAIL_FROM}>`;
  constructor(email: string, token: string) {
    this.to = email;
    this.token = token;
  }

  newTransport() {
    // if (process.env.NODE_ENV === 'production') {
    //   return createTransport({
    //     host: process.env.SMTP_HOST!,
    //     port: +process.env.SMTP_PORT!,
    //     secure: true,
    //     auth: {
    //       user: process.env.SMTP_USERNAME!,
    //       pass: process.env.SMTP_PASSWORD!,
    //     },
    //   });
    // }

    return createTransport(
      new SMTPTransport({
        host: process.env.EMAIL_HOST!,
        port: +process.env.EMAIL_PORT!,

        auth: {
          user: process.env.EMAIL_USERNAME!,
          pass: process.env.EMAIL_PASSWORD!,
        },
      })
    );
  }

  async send(template: string, subject: string) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      token: this.token,
      subject,
    });

    const mailOptions: MailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10 minutes only)'
    );
  }
  async sendEmailConfirm() {
    await this.send(
      'confirmEmail',
      'Your email confirm token (valid for 10 minutes only)'
    );
  }
}

export default Email;
