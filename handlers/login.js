const bcrypt = require('bcryptjs')
const config = require('../config')
const jwt = require('jsonwebtoken')
const logger = require('../logger')
const R = require('ramda')
const messages = require('../messages/messages')
const { generateRandomKey, encrypt } = require('../helper')
const { getStartAndEnd } = require('../constants')
const { setData, buildRedisConnection } = require('../redis/redis-client')
const {
    insertRecord,
    getRecordById,
    updateRecord,
} = require('../models/db-common')
const moment = require('moment')

const jwtGenerate = async (req, h) => {
    const { mobile, password } = req.payload
    const connection = await req.server.mysqlPool.getConnection()

    try {
        const [rows] = await getRecordById(
            'users',
            { username: mobile },
            connection
        )

        if (R.isEmpty(rows)) {
            throw messages.createNotFoundError('User not found')
        }

        const isPasswordValid = await bcrypt.compare(password, rows.password)
        if (!isPasswordValid) {
            throw messages.createNotFoundError('Invalid credentials')
        }

        const randomKey = generateRandomKey(16)
        const redisClient = await buildRedisConnection()

        let token = jwt.sign({ id: rows.id }, config.secret, {
            expiresIn: config.JWTEXPIRE,
        })

        token = encrypt(token, randomKey)

        const key = getStartAndEnd(token)
        await setData(redisClient, `ENCRYPT_${key}`, randomKey, 172800)

        const payload = {
            last_login: moment().format('YYYY-MM-DD HH:mm:ss'),
            login_count: rows.login_count + 1,
        }
        const whereConditions = { id: rows.id }
        await updateRecord('users', payload, whereConditions, connection)
        await redisClient.quit()
        const histPayload = { user_id: rows.id }
        await insertRecord('login_hist', histPayload, connection)

        return h
            .response(
                messages.successResponse(
                    { token },
                    `${mobile} is authenticated successfully!`
                )
            )
            .code(201)
    } catch (error) {
        logger.error(error.message)
        throw messages.createUnauthorizedError(error.message)
    } finally {
        connection.release() // Ensure the connection is always released
    }
}

const user_register = async (req, h) => {
    let { mobile, password } = req.payload
    let payload = { ...req.payload, username: mobile }
    delete payload.mobile
    const connection = await req.server.mysqlPool.getConnection()
    const whereObj = {
        username: mobile,
    }
    const [rows] = await getRecordById('users', whereObj, connection)

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
        logger.error(error.message)
        throw messages.createBadRequestError(error.message)
    } finally {
        await connection.release()
    }
}

module.exports = {
    jwtGenerate,
    user_register,
}
