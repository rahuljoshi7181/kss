const Boom = require('@hapi/boom')
const messages = require('../messages/messages')
const moment = require('moment')
const { isObjectNotEmptyOrUndefined } = require('../constants')

const {
    getRecords,
    insertRecord,
    updateRecord,
    getRecordById,
    getRecordsCount,
} = require('../models/db-common')

const getTransposrtListing = async (req, h) => {
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
            { name: `transport.id`, alias: `id` },
            {
                name: `transport.transporter_company_name`,
                alias: `transporter_company_name`,
            },
            {
                name: `transport.transporter_company_name`,
                alias: `company_name`,
                global: true,
            },
            { name: `transport.route`, alias: `route`, global: true },
            { name: `transport.route_start`, alias: `route_start` },
            { name: `transport.route_end`, alias: `route_end` },
            { name: `transport.office_address`, alias: `office_address` },
            {
                name: `transport.contact_number`,
                alias: `contact_number`,
                global: true,
            },
            { name: `transport.notes`, alias: `notes` },
            { name: `transport.createdAt`, alias: `createdAt` },
        ]

        const joins = []
        let totalRecords = await getRecordsCount({
            table: 'transport',
            columns,
            connection,
            joins,
            whereConditionsFilter: filter,
            globalFilter,
        })

        const totalRecordCount =
            totalRecords.length === 0 ? 0 : totalRecords[0].total_records

        const totalPages = Math.ceil(totalRecordCount / items_per_page)

        let rows = await getRecords({
            table: 'transport',
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
                    'Transport details fetched successfully!'
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

const transport_save = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()
        const { id } = req.auth.credentials
        let payload = {
            ...req.payload,
            created_by: id,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        const whereObj = {
            transporter_company_name: payload.transporter_company_name,
            contact_number: payload.contact_number,
        }
        const [rows] = await getRecordById('transport', whereObj, connection)
        if (!isObjectNotEmptyOrUndefined(rows)) {
            await connection.beginTransaction()
            await insertRecord('transport', payload, connection)
            await connection.commit()

            return h
                .response(
                    messages.successResponse(
                        {},
                        `Transport created successfully !`,
                        201
                    )
                )
                .code(201)
        } else {
            throw Boom.conflict('Transport already exists!')
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

const transport_update = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()
        const { id } = req.auth.credentials
        let payload = {
            ...req.payload,
            updated_by: id,
            updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        const whObj = {
            transporter_company_name: payload.transporter_company_name,
            contact_number: payload.contact_number,
            id: { value: payload.id, not: true },
        }
        const rows = await getRecordById('transport', whObj, connection)
        console.log(rows, rows.length)
        if (rows.length !== 0) {
            throw Boom.conflict('Transport company already exists!')
        } else {
            await connection.beginTransaction()
            const whereConditions = { id: payload.id }
            await updateRecord(
                'transport',
                payload,
                whereConditions,
                connection
            )
            await connection.commit()

            return h
                .response(
                    messages.successResponse(
                        {},
                        `Transport updated successfully !`,
                        201
                    )
                )
                .code(201)
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
    getTransposrtListing,
    transport_save,
    transport_update,
}
