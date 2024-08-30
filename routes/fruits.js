const Joi = require('joi')
const {
    getFruits,
    save_fruits,
    update_fruits,
    save_fruit_category,
    update_fruits_categories,
    getMandiRates,
} = require('../handlers/fruits') // Ensure this path is correct

module.exports = [
    {
        method: 'GET',
        path: '/v1/get-fruits',
        config: {
            handler: getFruits,
            validate: {},
        },
    },
    {
        method: 'POST',
        path: '/v1/save-fruits',
        config: {
            handler: save_fruits,
            validate: {
                payload: Joi.object({
                    name: Joi.string()
                        .trim()
                        .max(30)
                        .regex(/^[a-zA-Z0-9_]+$/)
                        .required(),
                    name_hindi: Joi.string().trim().required(),
                }),
            },
        },
    },
    {
        method: 'PATCH',
        path: '/v1/update-fruits',
        config: {
            handler: update_fruits,
            validate: {
                payload: Joi.object({
                    name: Joi.string().trim().required(),
                    name_hindi: Joi.string().trim().required(),
                    row_id: Joi.number().integer().required(),
                }),
            },
        },
    },
    {
        method: 'POST',
        path: '/v1/save-fruit-categories',
        config: {
            handler: save_fruit_category,
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    name_hindi: Joi.string().required(),
                    fruit_id: Joi.number().integer().required(),
                }),
            },
        },
    },
    {
        method: 'PATCH',
        path: '/v1/update-fruits-categories',
        config: {
            handler: update_fruits_categories,
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    name_hindi: Joi.string().required(),
                    row_id: Joi.number().integer().required(),
                }),
            },
        },
    },
    {
        method: 'GET',
        path: '/v1/get-mandi-rates',
        config: {
            handler: getMandiRates,
            validate: {},
        },
    },
    // More routes...
]
