function Response(error, code, type, message, results) {
    this.status = {
        error: error,
        code: code ? code : 400,
        type: type ? type : "error",
        message: message ? message : 'Error' 
    },
    this.results = results ?  results : [];
};
function ResponsePagination(error, code, type, message, results, pagination) {
    this.status = {
        error: error,
        code: code ? code : 400,
        type: type ? type : "error",
        message: message ? message : 'Error' 
    },
    this.pagination = pagination ? pagination : {};
    this.results = results ?  results : [];
};
module.exports = {
    Response,
    ResponsePagination
};