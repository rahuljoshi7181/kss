const R = require('ramda')
const messages = require('../messages/messages')
const Boom = require('@hapi/boom')
const {
    insertRecord,
    getRecordById,
    getAllRecords,
    updateRecord,
    getRecords,
} = require('../models/db-common')
const [
    table_name,
    fruit_category,
    mandi_rates,
    city_table,
    fruit_categories,
    units,
] = [
    'fruits',
    'fruit_categories',
    'daily_fruit_rates',
    'city',
    'fruit_categories',
    'units',
]

const getFruits = async (req, h) => {
    const connection = await req.server.mysqlPool.getConnection()
    const rows = await getAllRecords(table_name, connection)
    await connection.release()
    if (rows !== undefined && R.isEmpty(rows)) {
        throw messages.createNotFoundError('Fruits not found')
    } else {
        return h
            .response(
                messages.successResponse(rows, `Fruits fetched successfully !`)
            )
            .code(200)
    }
}

const save_fruits = async (req, h) => {
    let { name } = req.payload
    const { id } = req.auth.credentials
    let payload = { ...req.payload, created_by: id }
    const whereObj = {
        name: name,
    }
    const connection = await req.server.mysqlPool.getConnection()
    const [rows] = await getRecordById(table_name, whereObj, connection)
    if (rows !== undefined && R.isEmpty(rows)) {
        throw messages.createBadRequestError('Fruits already exists') // Use Boom for consistent error handling
    }

    try {
        await connection.beginTransaction()
        await insertRecord(table_name, payload, connection)
        await connection.commit()

        return h
            .response(
                messages.successResponse(
                    { fruits: name },
                    `${name} is inserted successfully !`
                )
            )
            .code(201)
    } catch (error) {
        await connection.rollback()
        throw messages.createBadRequestError(error)
    } finally {
        if (connection) await connection.release()
    }
}

const update_fruits = async (req, h) => {
    let { row_id, name } = req.payload
    const { id } = req.auth.credentials
    let payload = { ...req.payload, updated_by: id }
    delete payload.row_id

    const connection = await req.server.mysqlPool.getConnection()
    const whereObj = {
        id: row_id,
    }
    const [rows] = await getRecordById(table_name, whereObj, connection)
    if (rows === undefined || R.isEmpty(rows)) {
        throw messages.createBadRequestError(name + ' fruit is not exists')
    }

    try {
        await connection.beginTransaction()
        await updateRecord(table_name, payload, 'id', rows.id, connection)
        await connection.commit()
        return h
            .response(
                messages.successResponse(
                    { fruits: name },
                    `${name} is updated successfully !`
                )
            )
            .code(201)
    } catch (error) {
        await connection.rollback()
        throw messages.createBadRequestError(error)
    } finally {
        if (connection) await connection.release()
    }
}

const save_fruit_category = async (req, h) => {
    let { name, fruit_id } = req.payload
    const { id } = req.auth.credentials
    let payload = { ...req.payload, created_by: id }

    const connection = await req.server.mysqlPool.getConnection()
    const whereObj = {
        id: fruit_id,
    }
    const [rows] = await getRecordById(table_name, whereObj, connection)
    if (rows === undefined || R.isEmpty(rows)) {
        throw messages.createBadRequestError('Fruits is not exists') // Use Boom for consistent error handling
    }

    try {
        await connection.beginTransaction()
        await insertRecord(fruit_category, payload, connection)
        await connection.commit()
        return h
            .response(
                messages.successResponse(
                    { fruits: name },
                    `${name} is inserted successfully !`
                )
            )
            .code(201)
    } catch (error) {
        await connection.rollback()
        throw messages.createBadRequestError(error)
    } finally {
        if (connection) await connection.release()
    }
}

const update_fruits_categories = async (req, h) => {
    let { row_id, name } = req.payload
    const { id } = req.auth.credentials
    let payload = { ...req.payload, updated_by: id }
    delete payload.row_id

    const connection = await req.server.mysqlPool.getConnection()
    const whereObj = {
        id: row_id,
    }
    const [rows] = await getRecordById(fruit_category, whereObj, connection)
    if (rows === undefined || R.isEmpty(rows)) {
        throw messages.createBadRequestError(
            name + ' fruit category is not exists'
        )
    }

    try {
        await connection.beginTransaction()
        await updateRecord(fruit_category, payload, 'id', rows.id, connection)
        await connection.commit()
        return h
            .response(
                messages.successResponse(
                    { fruits: name },
                    `${name} is updated successfully !`
                )
            )
            .code(201)
    } catch (error) {
        await connection.rollback()
        throw messages.createBadRequestError(error)
    } finally {
        if (connection) await connection.release()
    }
}
/* eslint-disable */
const getMandiRates = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()
        const columns = [
            { name: mandi_rates + '.id', alias: 'id' },
            {
                concat: [`fruits.name`, `${fruit_categories}.name`],
                alias: 'fruit',
            },
            { name: `${city_table}.name`, alias: 'city_name' },
            { name: `${city_table}.name_hindi`, alias: 'city_name_hindi' },
            { name: `${mandi_rates}.rate`, alias: 'rate' },
            { name: `${units}.unit`, alias: 'unit' },
            { name: `${city_table}.rate`, alias: 'rate' },
            { name: `${city_table}.rate`, alias: 'rate' },
        ]
        const joins = [
            {
                type: 'INNER',
                table: city_table,
                on: city_table + `.id = ${table_name}.city_id`,
            },
            {
                type: 'INNER',
                table: fruit_categories,
                on: fruit_categories + `.id = ${table_name}.fruit_id`,
            },
            {
                type: 'INNER',
                table: table_name,
                on: `${table_name}.id = ${fruit_categories}.fruit_id`,
            },
        ]
        /* eslint-disable */
        const rows = await getRecords({
            mandi_rates,
            columns,
            order_by: 'desc',
            order_by_column: `${mandi_rates}.id`,
            limit: 0,
            offset: 0,
            connection,
            joins,
            pagination: false,
            where: '',
        })
    } catch (error) {
        await connection.rollback()
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
    getFruits,
    save_fruits,
    update_fruits,
    save_fruit_category,
    update_fruits_categories,
    getMandiRates,
}
