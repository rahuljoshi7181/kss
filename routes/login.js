const Joi = require('joi')
const { login, jwtGenerate, user_register } = require('../handlers/login') // Ensure this path is correct

module.exports = [
    {
        method: 'GET',
        path: '/v1/test_login',
        config: {
            handler: login,
        },
    },
    {
        method: 'POST',
        path: '/v1/generate-token',
        config: {
            handler: jwtGenerate,
            validate: {
                payload: Joi.object({
                    mobile: Joi.string().trim().required(),
                    password: Joi.string().trim().required(),
                }),
            },
        },
    },
    {
        method: 'POST',
        path: '/v1/register',
        config: {
            handler: user_register,
            validate: {
                payload: Joi.object({
                    mobile: Joi.string().required(),
                    password: Joi.string().required(),
                    user_type: Joi.number().integer(),
                    address: Joi.string(),
                    city: Joi.number().integer().required(),
                    postal_code: Joi.number().integer(),
                    last_login: Joi.date().required(),
                    created_by: Joi.number().integer().required(),
                }),
            },
        },
    },
    // More routes...
]
// module.exports = [
//     {
//         method: 'GET',
//         path: '/v1/test_login',
//         config: {
//             tags: ['internal'],
//             handler: login,
//             validate: {
//                 // Uncomment and use Joi for validation if needed
//                 // payload: Joi.object({
//                 //     email: Joi.string().email().required(),
//                 //     tokens: Joi.string().required(),
//                 // }),
//             },
//         },
//     },
// ]
