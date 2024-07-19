const config = require('../config')
const logger = require('../logger')
const R = require('ramda')
const messages = require('../messages/messages')
const boom = require('@hapi/boom')
const { getRecordById } = require('../models/db-common')

const profile = async (req, h) => {
    const { id } = req.auth.credentials
    const connection = await req.server.mysqlPool.getConnection()
    const [rows] = await getRecordById('users', 'username', id, connection)
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

module.exports = {
    profile,
}
