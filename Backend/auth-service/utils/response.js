const { http } = require('http')

const RespondJSONSuccess = (res, statusCode, message, data) => {
    res.status(statusCode).json({
        status: http.STATUS_CODES[statusCode],
        message,
        data
    });
}

const RespondJSONError = (res, statusCode, message, errors = null) => {
    res.status(statusCode).json({
        status: http.STATUS_CODES[statusCode],
        message,
        errors
    });
}

module.exports = {
    RespondJSONSuccess,
    RespondJSONError
}