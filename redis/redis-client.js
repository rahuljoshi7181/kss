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

async function setData(redisClient, key, value, expiryInSeconds = null) {
    try {
        await redisClient.set(key, value)
        if (expiryInSeconds) {
            await redisClient.expire(key, expiryInSeconds)
        }
        logger.info(`Data set in Redis: ${key}`)
    } catch (error) {
        logger.error('Error setting data in Redis:', error.message)
    }
}

async function getData(redisClient, key) {
    try {
        const value = await redisClient.get(key)
        if (value) {
            logger.info(`Data retrieved from Redis: ${key}`)
        } else {
            logger.info(`No data found for key: ${key}`)
        }
        return value
    } catch (error) {
        logger.error('Error getting data from Redis:', error.message)
        return null
    }
}

module.exports = {
    buildRedisConnection,
    setData,
    getData,
}
