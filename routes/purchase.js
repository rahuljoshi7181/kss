const {
    save_purchase,
    purchaseListing,
    getPurchaseData,
} = require('../handlers/purchase') // Ensure this path is correct
const Joi = require('joi')
module.exports = [
    {
        method: 'POST',
        path: '/v1/purchase/save',
        config: {
            handler: save_purchase,
            validate: {
                payload: Joi.object({
                    fruit_category_id: Joi.number().integer().required(),
                    price: Joi.number().integer().required(),
                    user_id: Joi.number().integer().required(),
                    order_date: Joi.string()
                        .trim()
                        .pattern(/^\d{4}-\d{2}-\d{2}$/)
                        .required(),
                    deliver_date: Joi.string()
                        .trim()
                        .pattern(/^\d{4}-\d{2}-\d{2}$/)
                        .required(),
                    primary_quantity: Joi.number()
                        .integer()
                        .optional()
                        .default(0),
                    secondary_quantity: Joi.number()
                        .integer()
                        .optional()
                        .default(0),
                    transport_id: Joi.number().integer().required(),
                    city_id: Joi.number().integer().required(),
                    address: Joi.string().trim().max(300).optional(),
                    notes: Joi.string().trim().max(300).optional(),
                    bill_number: Joi.string().trim().max(100).optional(),
                    bill: Joi.string().trim().max(200).optional(),
                    total_costing: Joi.number().integer().optional().default(0),
                    expenses: Joi.array()
                        .items(
                            Joi.object({
                                expense_id: Joi.number().integer().required(),
                                amount: Joi.number().required(),
                                description: Joi.string()
                                    .trim()
                                    .max(300)
                                    .optional(),
                            })
                        )
                        .optional(), // The entire expenses object is optional
                }),
            },
        },
    },
    {
        method: 'GET',
        path: '/v1/purchase/listing',
        config: {
            handler: purchaseListing,
            validate: {},
        },
    },
    {
        method: 'GET',
        path: '/v1/purchase/purchaseData',
        config: {
            handler: getPurchaseData,
            validate: {
                query: Joi.object({
                    purchase_id: Joi.number().integer().required(),
                }),
            },
        },
    },
]
