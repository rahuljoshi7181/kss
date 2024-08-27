const {
    profile,
    userListing,
    isUserExists,
} = require('../handlers/user_profile') // Ensure this path is correct
const Joi = require('joi')
module.exports = [
    {
        method: 'GET',
        path: '/v1/user_profile',
        config: {
            handler: profile,
            validate: {},
        },
    },
    {
        method: 'POST',
        path: '/v1/save-users',
        config: {
            handler: profile,
            validate: {
                payload: Joi.object({
                    name: Joi.string()
                        .trim()
                        .max(150)
                        .regex(/^[a-zA-Z0-9_]+$/)
                        .required(),
                    name_hindi: Joi.string().required(),
                    username: Joi.string()
                        .trim()
                        .pattern(/^[0-9]{10}$/)
                        .required()
                        .messages({
                            'string.pattern.base':
                                'username must be a valid 10-digit number.',
                            'string.empty': 'username is required.',
                        }),
                    user_type: Joi.string().trim().required(),
                    address: Joi.string().trim().max(300).required(),
                    city: Joi.string().trim().required(),
                    area: Joi.string().trim().required(),
                }),
            },
        },
    },
    {
        method: 'GET',
        path: '/v1/users',
        config: {
            handler: userListing,
            validate: {
                query: Joi.object({
                    page: Joi.number().integer().min(1).default(1),
                    items_per_page: Joi.number().integer().min(1).default(10),
                }),
            },
        },
    },
    {
        method: 'GET',
        path: '/v1/users/validate',
        config: {
            handler: isUserExists,
            validate: {
                query: Joi.object({
                    username: Joi.string()
                        .trim()
                        .pattern(/^[0-9]{10}$/)
                        .required(),
                }),
            },
        },
    },
]
