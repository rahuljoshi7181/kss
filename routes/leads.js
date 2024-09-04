const {
    getLeads,
    saveLeads,
    updateLeads,
    saveFollowups,
} = require('../handlers/leads') // Ensure this path is correct
const Joi = require('joi')
module.exports = [
    {
        method: 'GET',
        path: '/v1/leads',
        config: {
            handler: getLeads,
            validate: {},
        },
    },
    {
        method: 'POST',
        path: '/v1/save-leads',
        config: {
            handler: saveLeads,
            validate: {
                payload: Joi.object({
                    user_id: Joi.string()
                        .trim()
                        .pattern(/^[0-9]$/)
                        .required(),
                    fruit_id: Joi.string()
                        .trim()
                        .pattern(/^[0-9]$/)
                        .required(),
                    business_type: Joi.string()
                        .trim()
                        .pattern(/^[0-9]$/)
                        .required(),
                    potential_volume: Joi.string().trim().required(),
                    lead_status: Joi.string()
                        .pattern(/^[0-9]$/)
                        .trim()
                        .required(),
                    notes: Joi.string().trim().required().max(300),
                    source: Joi.string().trim().required().max(100),
                }),
            },
        },
    },
    {
        method: 'POST',
        path: '/v1/lead-followup',
        config: {
            handler: saveFollowups,
            validate: {
                payload: Joi.object({
                    lead_id: Joi.string()
                        .trim()
                        .pattern(/^[0-9]$/)
                        .required(),
                    follow_up_date: Joi.string()
                        .pattern(/^\d{4}-\d{2}-\d{2}$/)
                        .required(),
                    follow_up_type: Joi.string().trim().required(),
                    follow_up_notes: Joi.string().trim().required(),
                    next_follow_up_date: Joi.string()
                        .pattern(/^\d{4}-\d{2}-\d{2}$/)
                        .required(),
                }),
            },
        },
    },
    {
        method: 'POST',
        path: '/v1/update-leads',
        config: {
            handler: updateLeads,
            validate: {
                payload: Joi.object({
                    id: Joi.number().integer().required(),
                    user_id: Joi.string()
                        .trim()
                        .pattern(/^[0-9]$/)
                        .optional(),
                    fruit_id: Joi.string()
                        .trim()
                        .pattern(/^[0-9]$/)
                        .optional(),
                    business_type: Joi.string()
                        .trim()
                        .pattern(/^[0-9]$/)
                        .optional(),
                    potential_volume: Joi.string().trim().optional(),
                    lead_status: Joi.string()
                        .pattern(/^[0-9]$/)
                        .trim()
                        .optional(),
                    notes: Joi.string().trim().optional().max(300),
                    source: Joi.string().trim().optional().max(100),
                }).min(2),
            },
        },
    },
]
