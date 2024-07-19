const fs = require('fs')
const path = require('path')
require('dotenv').config()
const crypto = require('crypto')
const getRandomkey = () => {
    let keyInBytes = ''

    const hash = crypto.createHash('sha256')

    hash.on('readable', () => {
        const data = hash.read()

        if (data) {
            keyInBytes = data.toString('hex')
        }
    })

    hash.write(Math.random() + '')

    hash.end()

    return keyInBytes
}

const {
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE,
    MYSQL_PORT,
    REDIS_HOST,
    host = 'localhost',
    PORT = 8803,
    isProd = false,
    HOST = 'localhost',
    JWT_SECRET,
} = process.env

const objconf = {
    host: HOST,
    port: PORT,
    secret: JWT_SECRET,
    db_host: MYSQL_HOST,
    db_user: MYSQL_USER,
    db_password: MYSQL_PASSWORD,
    db_database: MYSQL_DATABASE,
    db_port: MYSQL_PORT,
}

module.exports = objconf
