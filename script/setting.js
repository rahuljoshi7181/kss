const { buildRedisConnection, setData } = require('../redis/redis-client')
const mysqlPlugin = require('../models/connection')
const Hapi = require('@hapi/hapi')
require('dotenv').config()

const init = async () => {
    try {
        const redisClient = await buildRedisConnection()
        const server = Hapi.server({
            port: 4000,
            host: process.env.HOST,
        })
        await server.register({
            plugin: mysqlPlugin,
            options: {},
        })
        await server.start()
        console.log('Server running on %s', server.info.uri)
        const connection = await server.mysqlPool.getConnection()
        const [rows] = await connection.query('SELECT * FROM common_settings')
        console.log('Fetched settings from DB:', rows)
        if (rows.length !== 0) {
            for (const data of rows) {
                await setData(redisClient, data.setting_key, data.setting_value)
            }
        }

        await redisClient.quit()
        connection.release()
        await server.stop()
        console.log('Server stopped gracefully')
    } catch (err) {
        console.error('Error:', err)
    } finally {
        process.exit(0)
    }
}

init()
