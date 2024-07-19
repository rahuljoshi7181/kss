function errorResponse(error, statusCode = 500) {
    const errorMessage = error.message || 'Internal Server Error' // Provide a default message
    return {
        statusCode,
        error: errorMessage,
    }
}

module.exports = {
    successResponse,
    errorResponse,
}
