const { getForms } = require('../handlers/forms') // Ensure this path is correct
const Joi = require('joi')
module.exports = [
    {
        method: 'GET',
        path: '/v1/forms',
        config: {
            handler: getForms,
            validate: {
                query: Joi.object({
                    form_name: Joi.string()
                        .trim()
                        .max(30)
                        .regex(/^[a-zA-Z0-9_]+$/)
                        .required(),
                }),
            },
        },
    },
]
