const R = require('ramda')
const messages = require('../messages/messages')
//const logger = require('../logger')
const {
    insertRecord,
    getRecordById,
    getAllRecords,
    updateRecord,
} = require('../models/db-common')
const [table_name, fruit_category] = ['fruits', 'fruit_categories']

const getFruits = async (req, h) => {
    const connection = await req.server.mysqlPool.getConnection()
    const [rows] = await getAllRecords(table_name, connection)
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

    const connection = await req.server.mysqlPool.getConnection()
    const [rows] = await getRecordById(table_name, 'name', name, connection)
    if (rows !== undefined && R.isEmpty(rows)) {
        throw messages.createBadRequestError('Fruits already exists') // Use Boom for consistent error handling
    }

    try {
        await connection.beginTransaction()
        await insertRecord(table_name, payload, connection)
        await connection.commit()
        await connection.release()
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
    }
}

const update_fruits = async (req, h) => {
    let { row_id, name } = req.payload
    const { id } = req.auth.credentials
    let payload = { ...req.payload, updated_by: id }
    delete payload.row_id

    const connection = await req.server.mysqlPool.getConnection()
    const [rows] = await getRecordById(table_name, 'id', row_id, connection)
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
        // Ensure the connection is released even if an error occurs
        if (connection) await connection.release()
    }
}

const save_fruit_category = async (req, h) => {
    let { name, fruit_id } = req.payload
    const { id } = req.auth.credentials
    let payload = { ...req.payload, created_by: id }

    const connection = await req.server.mysqlPool.getConnection()
    const [rows] = await getRecordById(table_name, 'id', fruit_id, connection)
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
        // Ensure the connection is released even if an error occurs
        if (connection) await connection.release()
    }
}

const update_fruits_categories = async (req, h) => {
    let { row_id, name } = req.payload
    const { id } = req.auth.credentials
    let payload = { ...req.payload, updated_by: id }
    delete payload.row_id

    const connection = await req.server.mysqlPool.getConnection()
    const [rows] = await getRecordById(fruit_category, 'id', row_id, connection)
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

module.exports = {
    getFruits,
    save_fruits,
    update_fruits,
    save_fruit_category,
    update_fruits_categories,
}
