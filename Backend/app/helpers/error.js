function notFound(message, errorCode) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || `The requested resource couldn't be found`;
    this.statusCode = errorCode || 404;
};
module.exports = notFound;