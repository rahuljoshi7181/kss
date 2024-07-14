const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const routes = require('./routes')
const hapipino = require('hapi-pino')
const mysqlPlugin = require('./models/connection')
const logger = require('./logger')
const errorMessages = require('./messages/messages')
const redisPlugin = require('./redis/plugin')
const rateLimitor = require('hapi-rate-limitor')
const cors = require('./cors')

module.exports = async (config, { enableRatelimit = true } = {}) => {
    const { host, port } = config

    const server = Hapi.server({
        host,
        port,
        debug: false,
        routes: {
            cors: false,
            timeout: {
                server: 300000,
            },
            validate: {
                failAction: async (req, h, err) => {
                    req.logger.info({ err })
                    return errorMessages.createBadRequestError()
                },
            },
        },
        state: { strictHeader: false, clearInvalid: true },
    })

    try {
        const pluginsList = [
            {
                plugin: hapipino,
                options: {
                    prettyPrint: false,
                    logEvents: [
                        'onPostStart',
                        'onPostStop',
                        'response',
                        'request-error',
                    ],
                    ignorePaths: ['/api/health'],
                    level: process.env.LOG_LEVEL || 'info',
                    instance: logger,
                },
            },
            mysqlPlugin,
            redisPlugin,
            cors,
            Inert,
            Vision,
            routes, // Ensure routes are registered last or after Vision if routes depend on Vision
        ]

        if (enableRatelimit) {
            pluginsList.push({
                plugin: rateLimitor,
                options: {
                    redis: config.redis,
                    extensionPoint: 'onRequest',
                    max: 100,
                    duration: 1000,
                },
            })
        }

        server.ext('onPreResponse', function (request, h) {
            const response = request.response
            if (response.isBoom) {
                // Handle error responses
            } else {
                // Handle successful responses
            }
            return h.continue
        })

        await server.register(pluginsList, {
            routes: {
                prefix: '/kss/api',
            },
        })
    } catch (error) {
        logger.error(error)
        throw error
    }

    return server
}
