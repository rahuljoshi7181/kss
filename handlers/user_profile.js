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
            { name: table_name + '.id', alias: 'user_id' },
            { name: table_name + '.name', alias: 'name', global: true },
            { name: table_name + '.username', alias: 'mobile', global: true },
            { name: 'area.colony_name', alias: 'area_name', global: true },
            { name: 'city.name', alias: 'city' },
            { name: 'state.name', alias: 'state' },
            { name: 'last_login', alias: 'last_login' },
            { name: table_name + '.is_active', alias: 'status' },
            { name: table_name + '.createdAt', alias: 'createdAt' },
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

        let totalRecords = await getRecordsCount({
            table: table_name,
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
            table: table_name,
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

        return h
            .response(
                messages.successResponse(
                    { list: rows },
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
            const whereConditions = { id: rows[0].id }
            await updateRecord(table_name, payload, whereConditions, connection)
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
