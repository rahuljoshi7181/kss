const Boom = require('@hapi/boom')
const messages = require('../messages/messages')
const {
    getRecords,
    insertRecord,
    updateRecord,
} = require('../models/db-common')

const [table_name, purchase_expense] = ['purchase_details', 'purchase_expense']
const save_purchase = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()
        const { id } = req.auth.credentials
        let expenses
        await connection.beginTransaction()
        const payload = { ...req.payload, created_by: id }
        /* eslint-disable */
        if (payload.hasOwnProperty('expenses')) {
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
                }
                console.log(expensePayload, 'expensePayload')
                await insertRecord(purchase_expense, expensePayload, connection)
                totalExpenses += expense.amount
            }
        }
        const newTotalCosting = payload.price + totalExpenses
        const updatePayload = {
            total_costing: newTotalCosting,
        }
        await updateRecord(
            table_name,
            updatePayload,
            'id',
            purchaseId,
            connection
        )
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
            { name: `e.name`, alias: `expense` },
            { name: `pe.amount`, alias: `expense_amount` },
            { name: `pe.description`, alias: `expense_desc` },
            { name: `pe.id`, alias: `purchase_expense_id` },
            { name: `pe.purchase_id`, alias: `purchase_id` },
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
                table: purchase_expense,
                on: `${purchase_expense}.purchase_id = ${table_name}.id`,
            },
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
            {
                type: 'LEFT',
                table: 'purchase_expense as pe',
                on: `pe.purchase_id = purchase_details.id`,
            },
            {
                type: 'LEFT',
                table: 'expenses as e',
                on: `e.id = pe.expense_id`,
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

        rows = getExpenseData(rows)

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
            { name: `e.name`, alias: `expense` },
            { name: `pe.amount`, alias: `expense_amount` },
            { name: `pe.description`, alias: `expense_desc` },
            { name: `pe.id`, alias: `purchase_expense_id` },
            { name: `pe.purchase_id`, alias: `purchase_id` },
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
                table: purchase_expense,
                on: `${purchase_expense}.purchase_id = ${table_name}.id`,
            },
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
            {
                type: 'LEFT',
                table: 'purchase_expense as pe',
                on: `pe.purchase_id = purchase_details.id`,
            },
            {
                type: 'LEFT',
                table: 'expenses as e',
                on: `e.id = pe.expense_id`,
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

        rows = getExpenseData(rows)

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

function getExpenseData(data) {
    const result = data.reduce((acc, current) => {
        // Find if the purchase_id already exists in the accumulator
        const existing = acc.find((item) => item.id === current.purchase_id)

        // If purchase_id matches the id, add expense details to expense_Data
        if (current.purchase_id === current.id) {
            const expenseDetails = {
                expense: current.expense,
                expense_amount: current.expense_amount,
                expense_desc: current.expense_desc,
                id: current.purchase_expense_id,
            }

            // If this is the first time, initialize expense_Data array
            if (!existing) {
                const newItem = { ...current, expense_Data: [expenseDetails] }
                acc.push(newItem)
            } else {
                let exists = false
                existing.expense_Data.forEach((value) => {
                    if (value.id === current.purchase_expense_id) {
                        exists = true
                    }
                })
                if (!exists) existing.expense_Data.push(expenseDetails)
            }
        } else {
            // If no match, push the item as-is without adding expense_Data
            acc.push(current)
        }

        return acc
    }, [])

    return result
}
module.exports = {
    save_purchase,
    purchaseListing,
    getPurchaseData,
}
