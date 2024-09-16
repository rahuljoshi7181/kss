const { getSignedUrl } = require('../handlers/global') // Ensure this path is correct
const Joi = require('joi')
module.exports = [
    {
        method: 'GET',
        path: '/v1/global/get-signed-url',
        config: {
            handler: getSignedUrl,
            validate: {
                query: Joi.object({
                    key: Joi.string().trim().max(100).required(),
                }),
            },
        },
    },
]
