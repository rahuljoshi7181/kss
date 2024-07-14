const { buildRedisConnection } = require('./redis-client')

module.exports = {
    name: 'redis',
    register: async (server) => {
        const redisclient = await buildRedisConnection()
        server.expose('redisClient', redisclient)

        server.ext('onPreStop', async () => {
            await redisClient.quit()
        })
    },
}
