"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const stripe_controller_1 = require("../controllers/stripe.controller");
const router = express_1.default.Router();
router.post('/sign-up', user_controller_1.SignUp);
router.post('/sign-in', user_controller_1.LogIn);
router.put('/update', verifyToken_1.verifyToken, user_controller_1.updateDetails);
router.put('/change-password', verifyToken_1.verifyToken, user_controller_1.changePassword);
router.post('/stripe-webhook', verifyToken_1.verifyToken, stripe_controller_1.webhookPayment);
exports.default = router;
