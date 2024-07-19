const Joi = require('joi')
const { profile } = require('../handlers/user_profile') // Ensure this path is correct

module.exports = [
    {
        method: 'GET',
        path: '/v1/user_profile',
        config: {
            handler: profile,
            validate: {},
        },
    },
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
