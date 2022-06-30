import * as Assinador from './assinador.js'
import imaps from 'imap-simple'

import { mailLogger } from './helpers/logger.js';
import { sendingEmail } from './helpers/sendMail.js';
import removeAcento from './helpers/removeAcento.js';

import { convert } from 'html-to-text';
import { READ_MAIL_CONFIG } from './config.js';

const readMail = async () => {
    try {
        const connection = await imaps.connect(READ_MAIL_CONFIG)

        mailLogger.info('CONNECTION SUCCESSFUL.')

        const box = await connection.openBox('INBOX');
        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false,
        };
        const results = await connection.search(searchCriteria, fetchOptions);

        if (results.length === 0) {
            mailLogger.info('No unread messages were found.')
            connection.end();
            return false;
        }

        results.forEach(async (res) => {

            const text = res.parts.filter((part) => {
                return part.which === 'TEXT';
            });

            let emailHTML = text[0].body
            let emailText = convert(emailHTML);

            let obj = {};

            emailText.split('\n').forEach(v => v.replace(/\s*(.*)\s*:\s*(.*)\s*/, (s, key, val) => {
                obj[key] = isNaN(val) || val.length < 1 ? val || undefined : Number(val);
            }));

            let clientName = obj.Cliente.toUpperCase()
            let clientCPF = obj.CPF_do_Contato
            let contractId = parseInt(obj.Id_contrato)

            if (clientCPF == null || clientCPF == '' || clientCPF == undefined) {
                await sendingEmail(clientName)
                mailLogger.error(`readMail: CPF on contract ${contractId} is missing.`)
                return false;
            }

            let proposeId = obj.Id_Proposta
            let funil = obj.Funil

            if (funil == "Oportunidades - Previsa Contabilidade") {
                funil = 1
            } else {
                funil = 2
            }
            await Assinador.createDocument(contractId, clientName, proposeId, funil)

        });
        connection.end();
    } catch (error) {
        mailLogger.error(`readMail: ${error}`)
        connection.end();
        return false;
    }
};

readMail()