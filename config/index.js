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
    DB_HOST = 'localhost',
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
}

module.exports = objconf
