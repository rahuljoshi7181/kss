const R = require('ramda')
const bcrypt = require('bcryptjs')
const moment = require('moment')
const Boom = require('@hapi/boom')
const messages = require('../messages/messages')
const { isObjectNotEmptyOrUndefined } = require('../constants')
const {
    getRecordById,
    getRecords,
    getRecordsCount,
    insertRecord,
    updateRecord,
} = require('../models/db-common')
const { pagination } = require('../helper')
const [table_name] = ['users']

const profile = async (req, h) => {
    const { id } = req.auth.credentials
    const connection = await req.server.mysqlPool.getConnection()
    const whereObj = {
        id: id,
    }
    const [rows] = await getRecordById(table_name, whereObj, connection)
    await connection.release()
    if (rows !== undefined && R.isEmpty(rows)) {
        throw messages.createNotFoundError('User not found')
    } else {
        return h
            .response(
                messages.successResponse(
                    rows,
                    `User profile fetched successfully !`
                )
            )
            .code(201)
    }
}

const userListing = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()
        const columns = [
            { name: table_name + '.id', alias: 'user_id' },
            { name: table_name + '.name', alias: 'name' },
            { name: table_name + '.username', alias: 'mobile' },
            { name: 'area.colony_name', alias: 'area_name' },
            { name: 'city.name', alias: 'city' },
            { name: 'state.name', alias: 'state' },
            { name: 'last_login', alias: 'last_login' },
            { name: table_name + '.is_active', alias: 'status' },
        ]

        const joins = [
            {
                type: 'LEFT',
                table: 'city',
                on: `city.id = ${table_name}.city`,
            },
            {
                type: 'LEFT',
                table: 'area',
                on: `area.id = users.area`,
            },
            { type: 'LEFT', table: 'state', on: 'state.id = city.state_id' },
        ]

        const rows = await getRecords({
            table: table_name,
            columns,
            order_by: 'desc',
            order_by_column: 'users.id',
            limit: 0,
            offset: 0,
            connection,
            joins,
            pagination: false,
        })

        return h
            .response(
                messages.successResponse(
                    rows,
                    'User Listing fetched successfully!'
                )
            )
            .code(200)
    } catch (error) {
        throw messages.createBadRequestError(
            error.message ||
                'An error occurred while fetching the user listing.'
        )
    } finally {
        if (connection) await connection.release()
    }
}

const userListingWithPagination = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()
        const page = parseInt(req.query.page, 10) || 1
        const items_per_page = parseInt(req.query.items_per_page, 10) || 10
        const offset = (page - 1) * items_per_page

        const columns = [
            { name: table_name + '.id', alias: 'user_id' },
            { name: table_name + '.name', alias: 'name' },
            { name: 'area.name', alias: 'area_name' },
            { name: 'city.name', alias: 'city' },
            { name: 'state.name', alias: 'state' },
            { name: 'last_login', alias: 'last_login' },
            { name: table_name + '.is_active', alias: 'status' },
        ]

        const joins = [
            {
                type: 'INNER',
                table: 'city',
                on: `city.id = ${table_name}.city`,
            },
            {
                type: 'INNER',
                table: 'area',
                on: `city.id = area.city_id`,
            },
            { type: 'LEFT', table: 'state', on: 'state.id = city.state_id' },
        ]

        const rows = await getRecords({
            table: table_name,
            columns,
            order_by: 'desc',
            order_by_column: 'users.id',
            limit: items_per_page,
            offset,
            connection,
            joins,
            pagination: true,
        })

        if (!rows || rows.length === 0) {
            throw messages.createNotFoundError('User not found!')
        }

        const totalRecords = await getRecordsCount({
            table: table_name,
            order_by: 'desc',
            order_by_column: table_name + '.id',
            connection,
            joins,
        })
        const pagePayload = pagination(totalRecords, page, items_per_page)
        const response = { result: rows, ...pagePayload }

        return h
            .response(
                messages.successResponse(
                    response,
                    'User Listing fetched successfully!'
                )
            )
            .code(200)
    } catch (error) {
        throw messages.createBadRequestError(
            error.message ||
                'An error occurred while fetching the user listing.'
        )
    } finally {
        if (connection) await connection.release()
    }
}

const save = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()
        let {
            name,
            name_hindi,
            user_type,
            address,
            city,
            area,
            postal_code,
            is_active,
        } = req.payload
        let username = req.payload.username
        const password = await bcrypt.hash('123456', 10)
        const last_login = moment().format('YYYY-MM-DD')
        postal_code = postal_code === undefined ? '' : postal_code
        const whereObj = {
            username: username,
        }
        const [rows] = await getRecordById(table_name, whereObj, connection)
        if (isObjectNotEmptyOrUndefined(rows)) {
            throw Boom.conflict('User already exists!')
        } else {
            await connection.beginTransaction()
            const { id } = req.auth.credentials
            let payload = {
                name,
                username,
                name_hindi,
                user_type,
                address,
                city,
                area,
                postal_code,
                is_active,
                password,
                last_login,
                created_by: id,
            }
            await insertRecord(table_name, payload, connection)
            await connection.commit()
            return h
                .response(
                    messages.successResponse(
                        {},
                        `New user account has been successfully created !`
                    )
                )
                .code(200)
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

const isUserExists = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()
        let username = req.query.username
        const whereObj = {
            username: username,
        }
        const [rows] = await getRecordById(table_name, whereObj, connection)

        if (isObjectNotEmptyOrUndefined(rows)) {
            throw Boom.conflict('User already exists!')
        } else {
            return h
                .response(messages.successResponse({}, `User not exists !`))
                .code(200)
        }
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

const updateUser = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()
        let payload = { ...req.payload, updated_by: req.auth.credentials.id }
        const whereObj = {
            id: req.payload.id,
        }
        const rows = await getRecordById(table_name, whereObj, connection)

        if (rows.length === 0) {
            throw Boom.conflict('User not found!')
        } else {
            await connection.beginTransaction()
            delete payload.id
            await updateRecord(
                table_name,
                payload,
                'id',
                rows[0].id,
                connection
            )
            await connection.commit()
            return h
                .response(
                    messages.successResponse(
                        {},
                        `${rows.name} details updated successfully!!`
                    )
                )
                .code(200)
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

module.exports = {
    profile,
    userListing,
    save,
    updateUser,
    isUserExists,
    userListingWithPagination,
}
