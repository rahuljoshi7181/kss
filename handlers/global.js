const Boom = require('@hapi/boom')
const messages = require('../messages/messages')

const getSignedUrl = async (req, h) => {
    try {
        const objectKey = req.query.key || ''
        const signedUrl =
            await req.server.plugins.s3Plugin.getSignedUrl(objectKey)
        return h
            .response(
                messages.successResponse(
                    { url: signedUrl },
                    'Url generated successfully!'
                )
            )
            .code(200)
    } catch (error) {
        if (Boom.isBoom(error)) {
            error.output.payload.isError = true
            throw error
        } else {
            throw messages.createBadRequestError(error.message)
        }
    }
}

module.exports = {
    getSignedUrl,
}
