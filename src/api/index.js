import axios from "axios";
import dotenv from 'dotenv'

dotenv.config()

export const SignerPrevisa = axios.create({
    baseURL: 'https://assinador.previsa.com.br/api',
    headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.SIGNER_PREVISA
    }
})

export const apiPloomes = axios.create({
    baseURL: 'https://api2.ploomes.com/',
    headers: {
        'Content-Type': 'application/json',
        'user-key': process.env.PLOOMES_KEY
    }
})

export const SignerLinces = axios.create({
    baseURL: 'https://assinador.previsa.com.br/api',
    headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.SIGNER_LINCES
    }
})