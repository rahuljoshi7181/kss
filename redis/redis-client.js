const redis = require('redis')
const config = require('../config')
const logger = require('../logger')
const redisHost = 'redis'
logger.info('Redis HOST : ' + redisHost)
async function buildRedisConnection() {
    const redisClient = redis.createClient({
        port: 6379,
        host: 'redis',
    })

    redisClient.on('error', (err) => {
        logger.error('Redis error:', err.message)
        logger.error('Redis stack:', err.stack)
    })

    return await redisClient.connect()
}

module.exports = {
    buildRedisConnection,
}
