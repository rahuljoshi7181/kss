const Boom = require('@hapi/boom')
const messages = require('../messages/messages')
const {
    isNotNilOrEmpty,
    VendorType,
    LeadStatus,
    isObjectNotEmptyOrUndefined,
} = require('../constants')
const {
    getRecords,
    getRecordById,
    insertRecord,
    updateRecord,
} = require('../models/db-common')
const [table_name, userTable, fruitTable, fruitCat, follow_ups] = [
    'leads',
    'users',
    'fruits',
    'fruit_categories',
    'follow_ups',
]

const saveLeads = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()
        const { id } = req.auth.credentials
        let payload = { ...req.payload, created_by: id }
        const whereObj = {
            user_id: payload.user_id,
            fruit_id: payload.fruit_id,
        }
        const [rows] = await getRecordById(table_name, whereObj, connection)
        if (!isObjectNotEmptyOrUndefined(rows)) {
            await connection.beginTransaction()
            await insertRecord(table_name, payload, connection)
            await connection.commit()

            return h
                .response(
                    messages.successResponse(
                        {},
                        `Leads created successfully !`,
                        201
                    )
                )
                .code(201)
        } else {
            throw Boom.conflict('Lead already exists!')
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

const updateLeads = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()
        const { id } = req.auth.credentials
        let payload = { ...req.payload, created_by: id }
        const whereObj = {
            id: payload.id,
        }
        const [rows] = await getRecordById(table_name, whereObj, connection)
        if (!isObjectNotEmptyOrUndefined(rows)) {
            throw Boom.conflict('Lead not found!')
        } else {
            const whObj = {
                user_id: payload.user_id,
                fruit_id: payload.fruit_id,
                id: { value: payload.id, not: true },
            }
            const [rows] = await getRecordById(table_name, whObj, connection)
            if (!isObjectNotEmptyOrUndefined(rows)) {
                throw Boom.conflict('Lead already exists!')
            } else {
                await connection.beginTransaction()
                delete payload.id
                await updateRecord(
                    table_name,
                    payload,
                    'id',
                    rows.id,
                    connection
                )
                await connection.commit()
                return h
                    .response(
                        messages.successResponse(
                            {},
                            `Lead updated successfully!`
                        )
                    )
                    .code(201)
            }
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

const getLeads = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()

        const columns = [
            { name: userTable + '.name', alias: 'name' },
            { name: userTable + '.username', alias: 'mobile' },
            {
                concat: [`${fruitTable}.name`, `${fruitCat}.name`],
                alias: 'fruit',
            },
            { name: `${table_name}.business_type`, alias: 'business_type' },
            { name: `${table_name}.lead_status`, alias: 'lead_status' },
            {
                name: `${table_name}.potential_volume`,
                alias: 'potential_volume',
            },
            { name: `${table_name}.lead_status`, alias: 'lead_status' },
            { name: `userss.name`, alias: 'created_by' },
            { name: `${table_name}.createdAt`, alias: 'createdAt' },
        ]

        const joins = [
            {
                type: 'INNER',
                table: userTable,
                on: `${userTable}.id = ${table_name}.user_id`,
            },
            {
                type: 'LEFT',
                table: fruitCat,
                on: `${fruitCat}.id = ${table_name}.fruit_id`,
            },
            {
                type: 'LEFT',
                table: fruitTable,
                on: `${fruitTable}.id = ${fruitCat}.fruit_id`,
            },
            {
                type: 'LEFT',
                table: 'users as userss',
                on: `userss.id = ${table_name}.created_by`,
            },
        ]

        const rows = await getRecords({
            table: table_name,
            columns,
            order_by: 'desc',
            order_by_column: table_name + '.id',
            limit: 0,
            offset: 0,
            connection,
            joins,
            pagination: false,
        })

        rows.forEach((data) => {
            data.business_type = isNotNilOrEmpty(data?.business_type)
                ? VendorType[data.business_type]
                : ''
            data.lead_status = isNotNilOrEmpty(data?.lead_status)
                ? LeadStatus[data.lead_status]
                : ''
        })

        return h
            .response(
                messages.successResponse(
                    {
                        listing: rows,
                        business_type: VendorType,
                        lead_status: LeadStatus,
                    },
                    'Leads fetched successfully!'
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

const saveFollowups = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()
        const { id } = req.auth.credentials
        let payload = { ...req.payload, created_by: id }
        await connection.beginTransaction()
        await insertRecord(follow_ups, payload, connection)
        await connection.commit()

        return h
            .response(
                messages.successResponse(
                    {},
                    `follow up created successfully !`,
                    201
                )
            )
            .code(201)
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

const getFollowupLeads = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()
        const columns = [
            { name: follow_ups + '.follow_up_date', alias: 'follow_up_date' },
            { name: follow_ups + '.follow_up_type', alias: 'follow_up_type' },
            { name: `${follow_ups}.follow_up_notes`, alias: 'follow_up_notes' },
            {
                name: `${follow_ups}.next_follow_up_date`,
                alias: 'next_follow_up_date',
            },
            { name: `${userTable}.name`, alias: 'created_by' },
        ]

        const joins = [
            {
                type: 'LEFT',
                table: userTable,
                on: `${userTable}.id = ${follow_ups}.created_by`,
            },
        ]

        const rows = await getRecords({
            table: follow_ups,
            columns,
            order_by: 'desc',
            order_by_column: follow_ups + '.id',
            limit: 0,
            offset: 0,
            connection,
            joins,
            pagination: false,
        })

        rows.forEach((data) => {
            data.business_type = isNotNilOrEmpty(data?.business_type)
                ? VendorType[data.business_type]
                : ''
            data.lead_status = isNotNilOrEmpty(data?.lead_status)
                ? LeadStatus[data.lead_status]
                : ''
        })

        return h
            .response(
                messages.successResponse(
                    {
                        listing: rows,
                    },
                    'followup fetched successfully!'
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

module.exports = {
    getLeads,
    saveLeads,
    updateLeads,
    saveFollowups,
    getFollowupLeads,
}
