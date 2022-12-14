import dotenv from 'dotenv'

dotenv.config()

export const authToken = (req, res, next) => {
    const headers = req.headers

    if (headers.hasOwnPropety('x-ploomes-validation-key')) {
        if (headers.hasOwnPropety('x-ploomes-validation-key' !== process.env.PLOOMES_WEBHOOK_KEY)) {
            console.log('token incorreto');
        }
        next()
    }
}
