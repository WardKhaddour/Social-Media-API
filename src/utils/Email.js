"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const smtp_transport_1 = __importDefault(require("nodemailer/lib/smtp-transport"));
const pug_1 = __importDefault(require("pug"));
const html_to_text_1 = require("html-to-text");
class Email {
    constructor(email, token) {
        this.from = `Ward Khaddour <${process.env.EMAIL_FROM}>`;
        this.to = email;
        this.token = token;
    }
    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            console.log('hello');
            return (0, nodemailer_1.createTransport)(new smtp_transport_1.default({
                host: process.env.SMTP_HOST,
                port: +process.env.SMTP_PORT,
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD,
                },
            }));
        }
        return (0, nodemailer_1.createTransport)(new smtp_transport_1.default({
            host: process.env.EMAIL_HOST,
            port: +process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        }));
    }
    send(template, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = pug_1.default.renderFile(`${__dirname}/../views/email/${template}.pug`, {
                token: this.token,
                subject,
            });
            const mailOptions = {
                from: this.from,
                to: this.to,
                subject,
                html,
                text: (0, html_to_text_1.htmlToText)(html),
            };
            try {
                yield this.newTransport().sendMail(mailOptions);
            }
            catch (err) {
                throw err;
            }
        });
    }
    sendPasswordReset() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send('passwordReset', 'Your password reset token (valid for 10 minutes only)');
        });
    }
    sendEmailConfirm() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send('confirmEmail', 'Your email confirm token (valid for 10 minutes only)');
        });
    }
}
exports.default = Email;
