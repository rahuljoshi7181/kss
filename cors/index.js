const Boom = require('@hapi/boom')
const allowedOrigins = ['localhost', 'rahul']
const isNotAllowedOrigin = (origin) => {
    if (
        origin &&
        !(
            origin.endsWith(allowedOrigins[0]) ||
            origin.endsWith(allowedOrigins[1])
        )
    ) {
        return true
    }

    return false
}

module.exports = {
    name: 'cors',

    register: async (server) => {
        server.ext('onPreResponse', async (request, h) => {
            // depending on whether we have a boom or not,

            // headers need to be set differently.

            const response = request.response.isBoom
                ? request.response.output
                : request.response
            const requestOrigin =
                request.headers.origin || request.headers.referer?.split('/')[2]

            if (isNotAllowedOrigin(requestOrigin)) {
                throw Boom.unauthorized(
                    'You are not authorized to perform this operation'
                )
            } else {
                const origin = requestOrigin?.split(',').filter(function (str) {
                    return (
                        str.endswith(allowedOrigins[0]) ||
                        str.endswith(allowedOrigins[1])
                    )
                })

                response.headers['access-control-allow-origin'] = origin
            }
            return h.continue
        })
    },
}
