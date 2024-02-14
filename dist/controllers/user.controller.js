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
exports.changePassword = exports.updateDetails = exports.LogIn = exports.SignUp = void 0;
const bcrypt_1 = require("../utils/bcrypt");
const user_model_1 = __importDefault(require("../models/user.model"));
const response_handler_1 = __importDefault(require("../utils/response.handler"));
const auth_util_1 = require("../utils/auth.util");
function SignUp(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { fullName, email, password } = request.body;
        const hashedPassword = yield (0, bcrypt_1.passwordHash)(password);
        const userExists = yield user_model_1.default.findOne({ email: email }).exec();
        if (userExists) {
            return next(new response_handler_1.default(response).error('You cannot use this mail again', 400));
        }
        const newUSer = new user_model_1.default({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });
        yield newUSer.save();
        return next(new response_handler_1.default(response).success('Welcome onboard!', newUSer, 201, {
            type: 'success',
            action: 'sign-up'
        }));
    });
}
exports.SignUp = SignUp;
function LogIn(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = request.body;
        const user = yield user_model_1.default.findOne({ email }).exec();
        if (!user) {
            return next(new response_handler_1.default(response).error('Email does not exist', 404));
        }
        const verifyPassword = yield (0, bcrypt_1.passwordCompare)(password, user.password);
        if (!verifyPassword) {
            return next(new response_handler_1.default(response).error('Password is incorrect', 401));
        }
        const payload = {
            _id: user._id,
            fullname: user.fullName,
            email: user.email
        };
        const token = yield (0, auth_util_1.jwtSign)(payload);
        return next(new response_handler_1.default(response).success('Welcome Back!', { user, token }, 200, {
            type: 'success',
            action: 'login'
        }));
    });
}
exports.LogIn = LogIn;
function updateDetails(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = request.user._id;
        const user = yield user_model_1.default.findOne({ _id: userId }).exec();
        if (!user) {
            return next(new response_handler_1.default(response).error('User not found', 404));
        }
        yield user_model_1.default.findOneAndUpdate({ _id: userId }, request.body, { $new: true }).exec();
        return next(new response_handler_1.default(response).success('Record updated', {}, 200, {
            type: 'success',
            action: 'update'
        }));
    });
}
exports.updateDetails = updateDetails;
function changePassword(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = request.user._id;
        const user = yield user_model_1.default.findOne({ _id: userId }).exec();
        if (!user) {
            return next(new response_handler_1.default(response).error('User not found', 404));
        }
        const { password } = request.body;
        if (!password) {
            return next(new response_handler_1.default(response).error('Field is required', 403));
        }
        const hashedPassword = yield (0, bcrypt_1.passwordHash)(password);
        user.password = hashedPassword;
        yield user.save();
        return next(new response_handler_1.default(response).success('Password changed successfully', {}, 200, {
            type: 'success',
            action: 'password-change'
        }));
    });
}
exports.changePassword = changePassword;
