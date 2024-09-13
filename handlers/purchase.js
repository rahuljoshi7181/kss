const Boom = require('@hapi/boom')
const R = require('ramda')
const messages = require('../messages/messages')
const moment = require('moment')
const {
    getRecords,
    insertRecord,
    updateRecord,
    getRecordById,
} = require('../models/db-common')

const [table_name, purchase_expense] = ['purchase_details', 'purchase_expense']

const save_purchase = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()
        const { id } = req.auth.credentials
        let expenses
        await connection.beginTransaction()
        const payload = {
            ...req.payload,
            created_by: id,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        }

        if (R.has('expenses', payload)) {
            expenses = payload.expenses
            delete payload['expenses']
        }
        const result = await insertRecord(table_name, payload, connection)
        const purchaseId = result.insertId
        let totalExpenses = 0
        if (expenses && expenses.length > 0) {
            for (const expense of expenses) {
                const expensePayload = {
                    purchase_id: purchaseId,
                    expense_id: expense.expense_id,
                    amount: expense.amount,
                    description: expense.description,
                    created_by: id,
                    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                }
                await insertRecord(purchase_expense, expensePayload, connection)
                totalExpenses += expense.amount
            }
        }
        const newTotalCosting = payload.price + totalExpenses
        const updatePayload = {
            total_costing: newTotalCosting,
        }
        let whereConditions = { id: purchaseId }
        await updateRecord(
            table_name,
            updatePayload,
            whereConditions,
            connection
        )

        // Insert into inventory table
        const inventoryPayload = {
            fruit_category_id: payload.fruit_category_id,
            primary_quantity: payload.primary_quantity || 0,
            secondary_quantity: payload.secondary_quantity || 0,
            source: purchaseId,
            type: 1, // 1 indicates a purchase
            warehouse_location: null, // Null as per your requirement
            created_by: id,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        await insertRecord('inventory', inventoryPayload, connection)

        await connection.commit()
        return h
            .response({
                statusCode: 201,
                message:
                    'Purchase details and expenses have been successfully saved!',
                data: {},
            })
            .code(201)
    } catch (error) {
        if (connection) await connection.rollback()
        if (Boom.isBoom(error)) {
            error.output.payload.isError = true
            throw error
        } else {
            throw messages.createBadRequestError(
                `Failed to save purchase details: ${error.message}`
            )
        }
    } finally {
        if (connection) await connection.release()
    }
}

const purchaseListing = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()
        const columns = [
            { name: `${table_name}.id`, alias: `id` },
            {
                name: `${table_name}.fruit_category_id`,
                alias: `fruit_category_id`,
            },
            { name: `${table_name}.price`, alias: `price` },
            { name: `${table_name}.user_id`, alias: `user_id` },
            { name: `${table_name}.order_date`, alias: `order_date` },
            { name: `${table_name}.deliver_date`, alias: `deliver_date` },
            {
                name: `${table_name}.primary_quantity`,
                alias: `primary_quantity`,
            },
            {
                name: `${table_name}.secondary_quantity`,
                alias: `secondary_quantity`,
            },
            { name: `${table_name}.transport_id`, alias: `transport_id` },
            { name: `${table_name}.city_id`, alias: `city_id` },
            { name: `${table_name}.address`, alias: `address` },
            { name: `${table_name}.notes`, alias: `notes` },
            { name: `${table_name}.bill_number`, alias: `bill_number` },
            { name: `${table_name}.total_costing`, alias: `total_costing` },
            { name: `${table_name}.bill`, alias: `bill` },
            {
                concat: [`fruits.name`, `fruit_categories.name`],
                alias: 'fruit',
            },
            { name: `users.name`, alias: `vendor_name` },
            { name: `userss.name`, alias: `created_by` },
            { name: `purchase_details.createdAt`, alias: `createdAt` },
            {
                name: `transport.transporter_company_name`,
                alias: `transporter_name`,
            },
            {
                name: `transport.office_address`,
                alias: `transporter_office_address`,
            },
            {
                name: `transport.contact_number`,
                alias: `transporter_contact_number`,
            },
        ]

        const joins = [
            {
                type: 'LEFT',
                table: 'transport',
                on: `transport.id = ${table_name}.transport_id`,
            },
            {
                type: 'INNER',
                table: 'fruit_categories',
                on: `purchase_details.fruit_category_id = fruit_categories.id`,
            },
            {
                type: 'INNER',
                table: 'fruits',
                on: `fruits.id = fruit_categories.fruit_id`,
            },
            {
                type: 'LEFT',
                table: 'units',
                on: `units.id = fruit_categories.units`,
            },
            {
                type: 'LEFT',
                table: 'users',
                on: `users.id = purchase_details.user_id`,
            },
            {
                type: 'LEFT',
                table: 'users as userss',
                on: `userss.id = purchase_details.created_by`,
            },
        ]

        // Get records using the columns and joins
        let rows = await getRecords({
            table: table_name,
            columns,
            order_by: 'desc',
            order_by_column: `${table_name}.id`,
            limit: 0,
            offset: 0,
            connection,
            joins,
            pagination: false,
        })

        return h
            .response(
                messages.successResponse(
                    {
                        listing: rows,
                    },
                    'Purchase details fetched successfully!'
                )
            )
            .code(200)
    } catch (error) {
        if (Boom.isBoom(error)) {
            error.output.payload.isError = true
            throw error
        } else {
            throw messages.createBadRequestError(error.message)
        }
    } finally {
        if (connection) await connection.release()
    }
}

const getPurchaseData = async (req, h) => {
    let connection
    try {
        const id = req.query.purchase_id || ''
        connection = await req.server.mysqlPool.getConnection()
        const columns = [
            { name: `${table_name}.id`, alias: `id` },
            {
                name: `${table_name}.fruit_category_id`,
                alias: `fruit_category_id`,
            },
            { name: `${table_name}.price`, alias: `price` },
            { name: `${table_name}.user_id`, alias: `user_id` },
            { name: `${table_name}.order_date`, alias: `order_date` },
            { name: `${table_name}.deliver_date`, alias: `deliver_date` },
            {
                name: `${table_name}.primary_quantity`,
                alias: `primary_quantity`,
            },
            {
                name: `${table_name}.secondary_quantity`,
                alias: `secondary_quantity`,
            },
            { name: `${table_name}.transport_id`, alias: `transport_id` },
            { name: `${table_name}.city_id`, alias: `city_id` },
            { name: `${table_name}.address`, alias: `address` },
            { name: `${table_name}.notes`, alias: `notes` },
            { name: `${table_name}.bill_number`, alias: `bill_number` },
            { name: `${table_name}.total_costing`, alias: `total_costing` },
            { name: `${table_name}.bill`, alias: `bill` },
            {
                concat: [`fruits.name`, `fruit_categories.name`],
                alias: 'fruit',
            },
            { name: `users.name`, alias: `vendor_name` },
            { name: `userss.name`, alias: `created_by` },
            { name: `purchase_details.createdAt`, alias: `createdAt` },
            {
                name: `transport.transporter_company_name`,
                alias: `transporter_name`,
            },
            {
                name: `transport.office_address`,
                alias: `transporter_office_address`,
            },
            {
                name: `transport.contact_number`,
                alias: `transporter_contact_number`,
            },
        ]

        const joins = [
            {
                type: 'LEFT',
                table: 'transport',
                on: `transport.id = ${table_name}.transport_id`,
            },
            {
                type: 'INNER',
                table: 'fruit_categories',
                on: `purchase_details.fruit_category_id = fruit_categories.id`,
            },
            {
                type: 'INNER',
                table: 'fruits',
                on: `fruits.id = fruit_categories.fruit_id`,
            },
            {
                type: 'LEFT',
                table: 'units',
                on: `units.id = fruit_categories.units`,
            },
            {
                type: 'LEFT',
                table: 'users',
                on: `users.id = purchase_details.user_id`,
            },
            {
                type: 'LEFT',
                table: 'users as userss',
                on: `userss.id = purchase_details.created_by`,
            },
        ]

        // Get records using the columns and joins
        let rows = await getRecords({
            table: table_name,
            columns,
            order_by: 'desc',
            order_by_column: `${table_name}.id`,
            limit: 0,
            offset: 0,
            connection,
            joins,
            pagination: false,
            where: 'purchase_details.id=' + id,
        })

        return h
            .response(
                messages.successResponse(
                    {
                        listing: rows,
                    },
                    'Purchase details fetched successfully!'
                )
            )
            .code(200)
    } catch (error) {
        if (Boom.isBoom(error)) {
            error.output.payload.isError = true
            throw error
        } else {
            throw messages.createBadRequestError(error.message)
        }
    } finally {
        if (connection) await connection.release()
    }
}

const update_purchase = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()
        const { id } = req.auth.credentials
        let payload = {
            ...req.payload,
            updated_by: id,
            updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        let expenses
        await connection.beginTransaction()
        const whereObj = {
            id: payload.id,
        }
        const [rows] = await getRecordById(table_name, whereObj, connection)
        if (rows === undefined || R.isEmpty(rows)) {
            throw messages.createBadRequestError(' Purchase record not exsist')
        }

        if (R.has('expenses', payload)) {
            expenses = payload.expenses
            delete payload['expenses']
        }
        payload = { ...rows, ...payload }
        let totalExpenses = 0
        if (expenses && expenses.length > 0) {
            for (const expense of expenses) {
                let expensePayload = {
                    purchase_id: payload.id,
                    expense_id: expense.expense_id,
                    amount: expense.amount,
                    description: expense.description,
                    updated_by: id,
                    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                }
                if (R.has('ex_id', expense)) {
                    expensePayload = {
                        ...expensePayload,
                        updated_by: id,
                        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                    }
                    let whereConditions = { id: expense.ex_id }
                    await updateRecord(
                        purchase_expense,
                        expensePayload,
                        whereConditions,
                        connection
                    )
                } else {
                    expensePayload = {
                        ...expensePayload,
                        created_by: id,
                        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                    }
                    await insertRecord(
                        purchase_expense,
                        expensePayload,
                        connection
                    )
                }

                totalExpenses += expense.amount
            }
        }

        payload.total_costing = totalExpenses
        let whereConditions = { id: payload.id }
        await updateRecord(table_name, payload, whereConditions, connection)

        const inventoryPayload = {
            fruit_category_id: payload.fruit_category_id,
            primary_quantity: payload.primary_quantity || 0,
            secondary_quantity: payload.secondary_quantity || 0,
            updated_by: id,
            updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        whereConditions = { source: payload.id, type: 1 }
        await updateRecord(
            'inventory',
            inventoryPayload,
            whereConditions,
            connection
        )
        await connection.commit()
        return h
            .response(
                messages.successResponse(
                    {},
                    'Purchase details updated successfully!'
                )
            )
            .code(200)
    } catch (error) {
        if (Boom.isBoom(error)) {
            error.output.payload.isError = true
            throw error
        } else {
            throw messages.createBadRequestError(error.message)
        }
    } finally {
        if (connection) await connection.release()
    }
}

const expenseListing = async (req, h) => {
    let connection
    try {
        const id = req.query.purchase_id || ''
        connection = await req.server.mysqlPool.getConnection()
        const columns = [
            { name: `e.name`, alias: `expense_name` },
            { name: `${purchase_expense}.expense_id`, alias: `expense_id` },
            { name: `${purchase_expense}.amount`, alias: `expense_amount` },
            { name: `${purchase_expense}.description`, alias: `expense_desc` },
            { name: `${purchase_expense}.id`, alias: `ex_id` },
        ]

        const joins = [
            {
                type: 'LEFT',
                table: 'expenses as e',
                on: `e.id = ${purchase_expense}.expense_id`,
            },
        ]

        let rows = await getRecords({
            table: purchase_expense,
            columns,
            order_by: 'desc',
            order_by_column: `${purchase_expense}.id`,
            limit: 0,
            offset: 0,
            connection,
            joins,
            pagination: false,
            where: `${purchase_expense}.purchase_id=` + id,
        })

        return h
            .response(
                messages.successResponse(
                    {
                        listing: rows,
                    },
                    'Purchase Expense details fetched successfully!'
                )
            )
            .code(200)
    } catch (error) {
        if (Boom.isBoom(error)) {
            error.output.payload.isError = true
            throw error
        } else {
            throw messages.createBadRequestError(error.message)
        }
    } finally {
        if (connection) await connection.release()
    }
}

module.exports = {
    save_purchase,
    purchaseListing,
    getPurchaseData,
    update_purchase,
    expenseListing,
}
