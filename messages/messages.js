const Boom = require('@hapi/boom')
const R = require('ramda')

const createBadImplementationError = (message, cause) => {
    const error = Boom.badImplementation()
    error.reformat()
    error.output.payload.message = message
    error.cause = cause
    return error
}
const createForbiddenError = (message, cause, locale) => {
    const error = Boom.forbidden()
    error.reformat()
    error.output.payload.message = message
    error.cause = cause
    return error
}

const createUnauthorizedError = (message, cause) => {
    const error = Boom.unauthorized()
    error.reformat()
    error.cause = cause
    error.output.payload.message = message || 'Failed to authorize the request.'
    return error
}

const createNotFoundError = (message, cause) => {
    const error = Boom.notFound()
    error.reformat()
    error.cause = cause
    error.output.payload.message =
        message || "Requested resource doesn't exist."
    return error
}

const createBadDataError = (mesage, data, cause) => {
    const error = Boom.badData(message, data)
    error.reformat()
    error.output.payload.message = message
    error.cause = cause
    return error
}

const createBadRequestError = (message, cause, includeCause = false) => {
    const error = Boom.badRequest()
    error.reformat()
    error.cause = cause

    if (includeCause) {
        error.output.payload.cause = cause || ''
    }

    error.output.payload.message = message || 'Invalid request payload input'

    return error
}

const createMethodNotAllowedError = (message, cause) => {
    const error = Boom.methodNotAllowed()
    error.reformat()
    error.output.payload.message = message
    error.cause = cause
    return error
}

module.exports = {
    createBadImplementationError,
    createNotFoundError,
    createUnauthorizedError,
    createForbiddenError,
    createBadDataError,
    createMethodNotAllowedError,
    createBadRequestError,
}
