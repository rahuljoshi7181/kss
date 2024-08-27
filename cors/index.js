const Boom = require('@hapi/boom')
const allowedOrigins = ['localhost:3000', 'rahul']
// Example helper function to check if origin is allowed
function isNotAllowedOrigin(origin) {
    return !allowedOrigins.includes(
        origin.split('//')[1] || origin.split('//')[0]
    )
}

module.exports = {
    name: 'cors',

    register: async (server) => {
        server.ext('onPreResponse', async (request, h) => {
            try {
                const response = request.response.isBoom
                    ? request.response.output
                    : request.response

                const requestOrigin =
                    request.headers.origin ||
                    (request.headers.referer &&
                        request.headers.referer.split('/')[2])

                if (
                    requestOrigin !== undefined &&
                    isNotAllowedOrigin(requestOrigin)
                ) {
                    throw Boom.unauthorized(
                        'You are not authorized to perform this operation'
                    )
                } else {
                    response.headers['access-control-allow-origin'] =
                        requestOrigin
                }
                return h.continue
            } catch (error) {
                throw Boom.unauthorized('Internal Server Error')
            }
        })
    },
}
