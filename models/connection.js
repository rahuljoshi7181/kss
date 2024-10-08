/* eslint-disable */

const mysql = require('mysql2/promise')
const logger = require('../logger')
const config = require('../config')
// MySQL configuration
const dbConfig = {
    host: config.db_host,
    user: config.db_user,
    password: config.db_password,
    database: config.db_database,
    port: config.db_port,
}

/// Plugin function to register MySQL connection
const mysqlPlugin = {
    name: 'mysqlPlugin',
    version: '1.0.0',
    register: async function (server, options) {
        const pool = mysql.createPool(dbConfig)

        // Test MySQL connection on plugin registration (optional)
        try {
            const connection = await pool.getConnection()
            logger.info('Connected to MySQL database!')
            connection.release()
        } catch (error) {
            logger.error('MySQL connection test failed:', error)
            process.exit(1)
        }

        server.decorate('server', 'mysqlPool', pool)

        server.ext('onPreStop', async () => {
            logger.info('Stopping server. Closing MySQL connection pool...')
            await pool.end()
            logger.info('MySQL connection pool closed.')
        })
    },
}

module.exports = mysqlPlugin
