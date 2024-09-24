const {
    profile,
    userListing,
    isUserExists,
    save,
    updateUser,
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
            handler: save,
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
                    address: Joi.string().trim().max(300),
                    city: Joi.string()
                        .trim()
                        .pattern(/^[0-9]$/)
                        .required(),
                    area: Joi.string()
                        .trim()
                        .pattern(/^[0-9]$/)
                        .required(),
                    is_active: Joi.boolean(),
                }),
            },
        },
    },
    {
        method: 'POST',
        path: '/v1/update-users',
        config: {
            handler: updateUser,
            validate: {
                payload: Joi.object({
                    id: Joi.number().integer().required(),
                    name: Joi.string()
                        .trim()
                        .max(150)
                        .regex(/^[a-zA-Z0-9_]+$/)
                        .optional(),
                    name_hindi: Joi.string().optional(),
                    username: Joi.string()
                        .trim()
                        .pattern(/^[0-9]{10}$/)
                        .optional()
                        .messages({
                            'string.pattern.base':
                                'username must be a valid 10-digit number.',
                            'string.empty': 'username is required.',
                        }),
                    user_type: Joi.string().trim().optional(),
                    address: Joi.string().trim().max(300).optional(),
                    city: Joi.string()
                        .trim()
                        .pattern(/^[0-9]$/)
                        .optional(),
                    area: Joi.string()
                        .trim()
                        .pattern(/^[0-9]$/)
                        .optional(),
                    is_active: Joi.boolean().optional(),
                }).min(2),
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
                    limit: Joi.number().integer().min(1).default(10),
                }).unknown(true),
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
