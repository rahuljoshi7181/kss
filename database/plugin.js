const databaseManager = require('./database-manager')
module.exports = {
    name: 'database',
    register: async (server) => {
        server.ext('onPreStop', async () => {
            console.log('Stopping server. Closing MySQL connection pool...')
            await databaseManager.stopClient()
            console.log('MySQL connection pool closed.')
        })
    },
}
