
const STATUS_CODE = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
}

const successCode = (res, data, message) => {
    res.status(STATUS_CODE.SUCCESS).json({
        statusCode: STATUS_CODE.SUCCESS,
        message,
        content: data
    })
}

const failCode = (res, data, message) => {
    res.status(STATUS_CODE.BAD_REQUEST).json({
        statusCode: STATUS_CODE.BAD_REQUEST,
        message,
        content: data
    })
}

const errorCode = (res, message) => {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
        message
    })
}

const notFoundCode = (res, message) => {
    res.status(STATUS_CODE.NOT_FOUND).json({
        statusCode: STATUS_CODE.NOT_FOUND,
        data: {},
        message
    })
}

module.exports = {
    STATUS_CODE,
    successCode,
    failCode,
    errorCode,
    notFoundCode
}