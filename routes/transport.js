const {
    getTransposrtListing,
    transport_save,
    transport_update,
} = require('../handlers/transport') // Ensure this path is correct
const Joi = require('joi')

module.exports = [
    {
        method: 'GET',
        path: '/v1/transport/listing',
        config: {
            handler: getTransposrtListing,
            validate: {
                query: Joi.object({
                    page: Joi.number().integer().min(1).default(1),
                    limit: Joi.number().integer().min(1).default(10),
                }).unknown(true),
            },
        },
    },
    {
        method: 'POST',
        path: '/v1/transport/save',
        config: {
            handler: transport_save,
            validate: {
                payload: Joi.object({
                    transporter_company_name: Joi.string()
                        .trim()
                        .max(100)
                        .required(),
                    route: Joi.string().trim().max(300).required(),
                    route_start: Joi.string().trim().max(150).required(),
                    route_end: Joi.string().trim().max(150).required(),
                    office_address: Joi.string().trim().max(300).required(),
                    contact_number: Joi.string()
                        .pattern(/^[0-9]{10}$/)
                        .required(),
                    notes: Joi.string().trim().max(300).required(),
                }),
            },
        },
    },
    {
        method: 'POST',
        path: '/v1/transport/update',
        config: {
            handler: transport_update,
            validate: {
                payload: Joi.object({
                    id: Joi.number().integer().required(),
                    transporter_company_name: Joi.string()
                        .trim()
                        .max(100)
                        .optional(),
                    route: Joi.string().trim().max(300).optional(),
                    route_start: Joi.string().trim().max(150).optional(),
                    route_end: Joi.string().trim().max(150).optional(),
                    office_address: Joi.string().trim().max(300).optional(),
                    contact_number: Joi.string()
                        .pattern(/^[0-9]{10}$/)
                        .optional(),
                    notes: Joi.string().trim().max(300).optional(),
                }),
            },
        },
    },
]
