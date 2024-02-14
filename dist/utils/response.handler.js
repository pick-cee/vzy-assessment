"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomResponse {
    constructor(res, err) {
        this.res = res,
            this.exception = err || new Error();
    }
    success(message = "", data = {}, statusCode = 200, meta = {}) {
        return this.res.status(statusCode || 200).json({
            success: true,
            code: statusCode || 200,
            message,
            data,
            meta
        });
    }
    error(message, statusCode, data, meta) {
        return this.res.status(statusCode).json({
            success: false,
            code: statusCode,
            message: message,
            data,
            meta,
        });
    }
}
exports.default = CustomResponse;
