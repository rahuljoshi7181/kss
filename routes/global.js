const { getSignedUrl, getRoleBasedUrl } = require('../handlers/global') // Ensure this path is correct
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
    {
        method: 'GET',
        path: '/v1/global/role-based-urls',
        config: {
            handler: getRoleBasedUrl,
            validate: {
                query: Joi.object({
                    type: Joi.string().trim().max(20).required(),
                }),
            },
        },
    },
]
