import * as Ploomes from './ploomes.js'
import pdf2base64 from 'pdf-to-base64'
import path from 'path'

import { SignerPrevisa, SignerLinces, SignerLGPD } from './api/index.js'
import { signerLogger } from './helpers/logger.js'

export async function getQuoteHash(quote) {

    try {
        let getQuoteInfo = await Ploomes.getQuoteDoc(quote)
        let getQuote = getQuoteInfo[0]
        let pdfPageCount = getQuoteInfo[1];

        let quoteParams = []

        let hash = ''

        let __dirname = path.resolve();

        hash = await pdf2base64(path.join(__dirname, getQuote))

        quoteParams.push(hash, pdfPageCount)

        return quoteParams
    } catch (error) {
        signerLogger.error(`getQuoteHash: ${error}`)
        return false;
    }
}

export async function uploadHash(quote) {

    try {
        let hashInfo = []

        let getHash = await getQuoteHash(quote)

        let hash = getHash[0]
        let pdfPageCount = getHash[1]

        let postHash = await SignerPrevisa.post('/uploads/bytes', {
            "bytes": hash
        })

        let documentID = postHash.data.id

        hashInfo.push(documentID, pdfPageCount)

        return hashInfo
    } catch (error) {
        signerLogger.error(`uploadHash: ${error}`)
        return false;
    }
}

export async function createDocument(quote, clientName, proposeId, funil) {
    try {
        let getDocInfo = await uploadHash(quote)
        let documentID = getDocInfo[0]
        let pdfPageCount = getDocInfo[1]

        let personData = await Ploomes.getPersonData(quote);

        let personName = personData[0];
        let personCPF = personData[1]
        let personEmail = personData[2]

        if (funil == 1) {
            await SignerPrevisa.post('/documents', {
                "files": [
                    {
                        "displayName": `CONTRATO - ${clientName} - ${proposeId}`,
                        "id": documentID,
                        "name": `CONTRATO - ${clientName}.pdf`,
                        "contentType": "application/pdf"
                    }
                ],
                "notifiedEmails": ["relacionamento@previsa.com.br"],
                "flowActions": [
                    {
                        "type": "Signer",
                        "user": {
                            "name": personName,
                            "identifier": personCPF,
                            "email": personEmail
                        },
                        "allowElectronicSignature": true,
                        "prePositionedMarks": [
                            {
                                "type": "SignatureVisualRepresentation",
                                "uploadId": documentID,
                                "topLeftX": 150,
                                "topLeftY": 660,
                                "width": 200,
                                "pageNumber": pdfPageCount
                            },
                        ]
                    },
                    {
                        "type": "Signer",
                        "user": {
                            "name": "Thiago Vitor de Faria Silva",
                            "identifier": "05256067699",
                            "email": "thiagov@previsa.com.br"
                        },
                        "allowElectronicSignature": false,
                        "prePositionedMarks": [
                            {
                                "type": "SignatureVisualRepresentation",
                                "uploadId": documentID,
                                "topLeftX": 50,
                                "topLeftY": 240,
                                "width": 200,
                                "pageNumber": pdfPageCount
                            },
                        ]
                    },
                    {
                        "type": "Signer",
                        "user": {
                            "name": "Carlos Vitor de Faria Silva",
                            "identifier": "01217210601",
                            "email": "carlos@previsa.com.br"
                        },
                        "allowElectronicSignature": true,
                        "prePositionedMarks": [
                            {
                                "type": "SignatureVisualRepresentation",
                                "uploadId": documentID,
                                "topLeftX": 50,
                                "topLeftY": 375,
                                "width": 200,
                                "pageNumber": pdfPageCount
                            },
                        ]
                    },
                ],
            });
            signerLogger.info(`CONTRATO - ${clientName} - ${proposeId} criado.`)
        }

        if (funil == 2) {
            await SignerLinces.post('/documents', {
                "files": [
                    {
                        "displayName": `${proposeId} - ${clientName}`,
                        "id": documentID,
                        "name": `${proposeId} - ${clientName}.pdf`,
                        "contentType": "application/pdf"
                    }
                ],
                "notifiedEmails": ["relacionamento@golinces.com.br"],
                "flowActions": [
                    {
                        "type": "Signer",
                        "user": {
                            "name": personName,
                            "identifier": personCPF,
                            "email": personEmail
                        },
                        "allowElectronicSignature": true,
                        "prePositionedMarks": [
                            {
                                "type": "SignatureVisualRepresentation",
                                "uploadId": documentID,
                                "topLeftX": 120,
                                "topLeftY": 250,
                                "width": 200,
                                "pageNumber": pdfPageCount
                            },
                        ]
                    },
                    {
                        "type": "Signer",
                        "user": {
                            "name": "Renato Leão Costa",
                            "identifier": "03622626674",
                            "email": "renatoleao@previsa.com.br"
                        },
                        "allowElectronicSignature": true,
                        "prePositionedMarks": [
                            {
                                "type": "SignatureVisualRepresentation",
                                "uploadId": documentID,
                                "topLeftX": 120,
                                "topLeftY": 435,
                                "width": 200,
                                "pageNumber": pdfPageCount
                            },
                        ]
                    },
                ],
            });
            signerLogger.info(`${proposeId} - ${clientName} criado.`)
        }

        if (funil == 3) {
            await SignerLGPD.post('/documents', {
                "files": [
                    {
                        "displayName": `${proposeId} - ${clientName}`,
                        "id": documentID,
                        "name": `${proposeId} - ${clientName}.pdf`,
                        "contentType": "application/pdf"
                    }
                ],
                "notifiedEmails": ["lgpd@previsa.com.br"],
                "flowActions": [
                    {
                        "type": "Signer",
                        "user": {
                            "name": personName,
                            "identifier": personCPF,
                            "email": personEmail
                        },
                        "allowElectronicSignature": true,
                        "prePositionedMarks": [
                            {
                                "type": "SignatureVisualRepresentation",
                                "uploadId": documentID,
                                "topLeftX": 197,
                                "topLeftY": 343,
                                "width": 200,
                                "pageNumber": pdfPageCount
                            },
                        ]
                    },
                ],
            });
            signerLogger.info(`${proposeId} - ${clientName} criado.`)
        }
    } catch (error) {
        signerLogger.error(`createDocument: ${error}`)
        return false;
    }
}