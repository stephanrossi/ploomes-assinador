import hbs from 'nodemailer-express-handlebars'
import nodemailer from 'nodemailer'
import path from 'path'

import dotenv from 'dotenv'
import { mailLogger } from './logger.js';
dotenv.config()

// initialize nodemailer
var transporter = nodemailer.createTransport(
    {
        host: process.env.EMAIL_SMTP,
        port: process.env.EMAIL_SMTP_PORT,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    }
);

// point to the template folder
const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))

// trigger the sending of the E-mail
export async function sendingEmail(personName, funil = null) {
    try {
        if (funil == 1) {
            var mailOptions = {
                from: '"Novos clientes" <integracao@previsa.com.br>', // sender address
                to: 'stephan@previsa.com.br;relacionamento@previsa.com.br;juniormonteiro@previsa.com.br;leonardopereira@previsa.com.br', // list of receivers
                subject: 'Alerta - Assinador Previsa',
                template: 'email', // the name of the template file i.e email.handlebars
                context: {
                    personName
                }
            };
        }

        if (funil == 2) {
            var mailOptions = {
                from: '"Novos clientes" <integracao@previsa.com.br>', // sender address
                to: 'stephan@previsa.com.br;relacionamento@golinces.com.br;renatoleao@previsa.com.br;leonardopereira@previsa.com.br', // list of receivers
                subject: 'Alerta - Assinador Previsa',
                template: 'email', // the name of the template file i.e email.handlebars
                context: {
                    personName
                }
            };
        }

        if (funil == 3) {
            var mailOptions = {
                from: '"Novos clientes" <integracao@previsa.com.br>', // sender address
                to: 'lgpd@previsa.com.br;stephan@previsa.com.br', // list of receivers
                subject: 'Alerta - Assinador Previsa LGPD',
                template: 'email', // the name of the template file i.e email.handlebars
                context: {
                    personName
                }
            };
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                mailLogger.error(`sendMail: ${error}`)
                return console.log(error);
            }
            mailLogger.info('Message sent: ' + info.response)
            console.log('Message sent: ' + info.response);
        });
    } catch (error) {
        console.log(error);
    }
}