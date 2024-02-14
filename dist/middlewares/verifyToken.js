"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const response_handler_1 = __importDefault(require("../utils/response.handler"));
dotenv_1.default.config();
// A middleware function to verify and validate the jwt token passed before
// allowing a user perform a request
function verifyToken(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (request.headers.authorization &&
            request.headers.authorization.startsWith("Bearer")) {
            try {
                const token = request.headers.authorization.split(" ")[1];
                jsonwebtoken_1.default.verify(token, `${process.env.JWT_ACCESS_KEY}`, (error, user) => __awaiter(this, void 0, void 0, function* () {
                    console.log(error);
                    if (error)
                        return next(new response_handler_1.default(response).error("Invalid bearer token", 403));
                    const userExists = yield user_model_1.default.findById(user._id).exec();
                    if (userExists) {
                        request.user = user;
                        next();
                    }
                    else {
                        return next(new response_handler_1.default(response).error('Please sign up', 401));
                    }
                }));
            }
            catch (err) {
                return next(new response_handler_1.default(response).error(err.message, 500));
            }
        }
        else {
            return next(new response_handler_1.default(response).error('Your are not authenticated', 401));
        }
    });
}
exports.verifyToken = verifyToken;
