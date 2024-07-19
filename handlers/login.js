const bcrypt = require('bcryptjs')
const config = require('../config')
const jwt = require('jsonwebtoken')
const logger = require('../logger')
const R = require('ramda')
const messages = require('../messages/messages')
const { insertRecord, getRecordById } = require('../models/db-common')
const boom = require('@hapi/boom')

const login = async (req, h) => {
    return 'TEST' + config.secret
}

const jwtGenerate = async (req, h) => {
    const { mobile, password } = req.payload
    const connection = await req.server.mysqlPool.getConnection()
    const [rows] = await getRecordById('users', 'username', mobile, connection)
    connection.release()

    if (rows !== undefined && R.isEmpty(rows)) {
        throw messages.createNotFoundError('User not found')
    } else if (await bcrypt.compare(password, rows.password)) {
        const token = jwt.sign({ id: rows.id }, config.secret, {
            expiresIn: '1h',
        })
        return h
            .response(
                messages.successResponse(
                    { token: token },
                    `${mobile} is authenticated successfully !`
                )
            )
            .code(201)
    } else {
        throw messages.createNotFoundError('Invalid credentials')
    }
}

const user_register = async (req, h) => {
    let { mobile, password } = req.payload
    let payload = { ...req.payload, username: mobile }
    delete payload.mobile
    const connection = await req.server.mysqlPool.getConnection()
    const [rows] = await getRecordById('users', 'username', mobile, connection)

    if (rows !== undefined && R.isEmpty(rows)) {
        logger.error('User already exists')
        throw messages.createBadRequestError('User already exists') // Use Boom for consistent error handling
    }

    try {
        await connection.beginTransaction()
        const hashedPassword = await bcrypt.hash(password, 10)
        payload = { ...payload, password: hashedPassword }
        await insertRecord('users', payload, connection)
        await connection.commit()
        await connection.release()
        return h
            .response(
                messages.successResponse(
                    { user: mobile },
                    `${mobile} is inserted successfully !`
                )
            )
            .code(201)
    } catch (error) {
        await connection.rollback()
        logger.error(error)
        throw messages.createBadRequestError(error)
    }
}

module.exports = {
    login,
    jwtGenerate,
    user_register,
}
