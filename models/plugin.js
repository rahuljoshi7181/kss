const databaseManager = require('./connection')
const logger = require('../loggers')
module.exports = {
    name: 'database',
    register: async (server) => {
        await databaseManager.testConnection()
        server.expose('dbPoolConnection', databaseManager.pool)
        server.ext('onPreStop', async () => {
            logger.log('Stopping server. Closing MySQL connection pool...')
            await databaseManager.stopClient()
            logger.log('MySQL connection pool closed.')
        })
    },
}
