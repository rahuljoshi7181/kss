const R = require('ramda')
const messages = require('../messages/messages')
const Boom = require('@hapi/boom')
const { isObjectNotEmptyOrUndefined } = require('../constants')
const {
    insertRecord,
    getRecordById,
    getAllRecords,
    updateRecord,
    getRecords,
    getRecordsCount,
} = require('../models/db-common')
const [
    table_name,
    fruit_category,
    mandi_rates,
    city_table,
    fruit_categories,
    units,
    users,
] = [
    'fruits',
    'fruit_categories',
    'daily_fruit_rates',
    'city',
    'fruit_categories',
    'units',
    'users',
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
        const whereConditions = { id: rows.id }
        await updateRecord(table_name, payload, whereConditions, connection)
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
        const whereConditions = { id: rows.id }
        await updateRecord(fruit_category, payload, whereConditions, connection)
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
        const page = parseInt(req.query.page, 10) || 1
        const items_per_page = parseInt(req.query.limit, 10) || 10
        const sortingDesc = req.query['sorting[0][desc]'] === 'true'
        const sortDirection = sortingDesc ? 'DESC' : 'ASC'
        const sortField = req.query['sorting[0][id]'] || 'id'
        const filter = req?.query?.filters
            ? JSON.parse(req?.query?.filters)
            : ''

        const globalFilter = req?.query?.globalFilter
            ? JSON.parse(req?.query?.globalFilter)
            : ''

        const offset = (page - 1) * items_per_page
        const columns = [
            { name: mandi_rates + '.id', alias: 'id' },
            {
                concat: [`fruits.name`, `${fruit_categories}.name`],
                alias: 'fruit',
                global: true,
            },
            { name: `${city_table}.name`, alias: 'city_name', global: true },
            { name: `${city_table}.name_hindi`, alias: 'city_name_hindi' },
            { name: `${mandi_rates}.primary_rate`, alias: 'primary_rate' },
            { name: `${mandi_rates}.secondary_rate`, alias: 'secondary_rate' },
            { name: `${units}.primary_unit`, alias: 'pri_unit' },
            { name: `${units}.secondary_unit`, alias: 'sec_unit' },
            {
                name: `${mandi_rates}.rate_date`,
                alias: 'rate_date',
                global: true,
            },
            { name: `vendor.name`, alias: 'vendor_name', global: true },
            { name: `${users}.name`, alias: 'user_name', global: true },
            { name: `${mandi_rates}.createdAt`, alias: 'createdAt' },
        ]
        const joins = [
            {
                type: 'INNER',
                table: fruit_categories,
                on: `${mandi_rates}.fruit_id = ${fruit_categories}.id`,
            },
            {
                type: 'INNER',
                table: city_table,
                on: city_table + `.id = ${mandi_rates}.city_id`,
            },
            {
                type: 'INNER',
                table: table_name,
                on: `${table_name}.id = ${fruit_categories}.fruit_id`,
            },
            {
                type: 'LEFT',
                table: units,
                on: `${units}.id = ${fruit_categories}.units`,
            },
            {
                type: 'LEFT',
                table: users,
                on: `${users}.id = ${mandi_rates}.created_by`,
            },
            {
                type: 'LEFT',
                table: 'users as vendor',
                on: `vendor.id = ${mandi_rates}.user_id`,
            },
        ]

        let totalRecords = await getRecordsCount({
            table: mandi_rates,
            columns,
            connection,
            joins,
            whereConditionsFilter: filter,
            globalFilter,
        })

        const totalRecordCount =
            totalRecords.length === 0 ? 0 : totalRecords[0].total_records

        const totalPages = Math.ceil(totalRecordCount / items_per_page)

        const rows = await getRecords({
            table: mandi_rates,
            columns,
            order_by: sortDirection,
            order_by_column: sortField,
            limit: items_per_page,
            offset,
            connection,
            joins,
            pagination: true,
            whereConditionsFilter: filter,
            globalFilter,
        })
        return h
            .response(
                messages.successResponse(
                    {
                        listing: rows,
                        page,
                        pageSize: items_per_page,
                        totalPages: totalPages,
                        totalRecord: totalRecordCount,
                    },
                    `Daily rates fatched successfully !`
                )
            )
            .code(200)
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

const save_mandi_rates = async (req, h) => {
    const { id } = req.auth.credentials
    let payload = { ...req.payload, created_by: id }
    const connection = await req.server.mysqlPool.getConnection()
    try {
        await connection.beginTransaction()

        const whereObj = {
            user_id: payload.user_id,
            fruit_id: payload.fruit_id,
            city_id: payload.city_id,
            rate_date: payload.rate_date,
        }
        const [rows] = await getRecordById(mandi_rates, whereObj, connection)

        if (!isObjectNotEmptyOrUndefined(rows)) {
            await insertRecord(mandi_rates, payload, connection)
            await connection.commit()
            return h
                .response(
                    messages.successResponse(
                        {},
                        `Mandi rate is inserted successfully !`
                    )
                )
                .code(201)
        } else {
            throw Boom.conflict('Record already exists for this date!')
        }
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

const update_mandi_rates = async (req, h) => {
    const { id } = req.auth.credentials
    let payload = { ...req.payload, updated_by: id }
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()
        const whereObj = {
            id: payload.id,
        }
        const rows = await getRecordById(mandi_rates, whereObj, connection)
        if (rows.length === 0) {
            throw Boom.conflict('Records not found!')
        } else {
            delete payload.id
            await connection.beginTransaction()
            const whereConditions = { id: rows[0].id }
            await updateRecord(
                mandi_rates,
                payload,
                whereConditions,
                connection
            )
            await connection.commit()
            return h
                .response(
                    messages.successResponse(
                        {},
                        `Rate is updated successfully !`
                    )
                )
                .code(201)
        }
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
    getMandiRates,
    save_mandi_rates,
    update_mandi_rates,
}
