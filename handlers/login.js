const bcrypt = require('bcryptjs')
const config = require('../config')
const jwt = require('jsonwebtoken')
const logger = require('../logger')
const R = require('ramda')
const messages = require('../messages/messages')
const {
    insertRecord,
    getRecordById,
    updateRecord,
} = require('../models/db-common')
const moment = require('moment')

const jwtGenerate = async (req, h) => {
    const { mobile, password } = req.payload
    const connection = await req.server.mysqlPool.getConnection()
    const [rows] = await getRecordById('users', 'username', mobile, connection)

    if (rows !== undefined && R.isEmpty(rows)) {
        throw messages.createNotFoundError('User not found')
    } else if (await bcrypt.compare(password, rows.password)) {
        const token = jwt.sign({ id: rows.id }, config.secret, {
            expiresIn: '1h',
        })
        let payload = {
            last_login: moment().format('YYYY-MM-DD HH:mm:ss'),
            login_count: rows.login_count + 1,
        }
        await updateRecord('users', payload, 'id', rows.id, connection)
        connection.release()
        return h
            .response(
                messages.successResponse(
                    { token: token },
                    `${mobile} is authenticated successfully !`
                )
            )
            .code(201)
    } else {
        connection.release()
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
    jwtGenerate,
    user_register,
}
