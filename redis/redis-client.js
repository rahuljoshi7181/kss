const redis = require('redis')
const config = require('../config')
const logger = require('../logger')
logger.info('Redis HOST : ' + config.redis_host)
async function buildRedisConnection() {
    const redisClient = redis.createClient({
        port: config.redis_port,
        host: config.redis_host,
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
