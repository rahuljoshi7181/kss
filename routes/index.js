const { handleRequest } = require('../handle-request')
const login = require('./login.js')
const users = require('./users.js')
const fruits = require('./fruits.js')
const forms = require('./forms.js')
const leads = require('./leads.js')
const purchase = require('./purchase.js')
const global = require('./global.js')
const health = [
    {
        method: 'GET',
        path: '/health',
        config: {
            handler: (request, h) => {
                return h.response({ status: 'ok' }).code(200)
            },
            description: 'Health Check',
            notes: 'Returns a health status',
            tags: ['api', 'health'],
        },
    },
]

function routeWithCorrelationId(routes) {
    return routes.map((route) => {
        return {
            ...route,
            config: {
                ...route.config,
                handler: handleRequest(route.config.handler),
            },
        }
    })
}

module.exports = {
    name: 'routes',
    version: '1.0.0',
    register: async (server) => {
        server.route(routeWithCorrelationId(login)),
            server.route(routeWithCorrelationId(users)),
            server.route(routeWithCorrelationId(fruits)),
            server.route(routeWithCorrelationId(health)),
            server.route(routeWithCorrelationId(leads)),
            server.route(routeWithCorrelationId(forms)),
            server.route(routeWithCorrelationId(purchase)),
            server.route(routeWithCorrelationId(global))
    },
}
