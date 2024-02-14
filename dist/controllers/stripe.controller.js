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
exports.webhookPayment = void 0;
const stripe_1 = require("stripe");
const response_handler_1 = __importDefault(require("../utils/response.handler"));
const user_model_1 = __importDefault(require("../models/user.model"));
const stripeSecretKey = `${process.env.STRIPE_SECRET_KEY}`;
const stripeClient = new stripe_1.Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16'
});
function webhookPayment(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = request.user._id;
            const paymentIntent = yield stripeClient.paymentIntents.create({
                amount: 1000,
                currency: 'usd',
                metadata: {
                    userId: userId
                }
            });
            const signature = request.headers['stripe-signature'];
            let event;
            try {
                event = stripeClient.webhooks.constructEvent(request.body, signature, stripeSecretKey);
            }
            catch (err) {
                return next(new response_handler_1.default(response).error(`Webhook Error: ${err.message}`, 400));
            }
            //handle successful payment events
            switch (event.type) {
                case 'payment_intent.succeeded':
                    const user = paymentIntent.metadata.userId;
                    if (!user) {
                        return next(new response_handler_1.default(response).error('No ID passed', 404));
                    }
                    try {
                        yield user_model_1.default.updateOne({ _id: user }, { status: 'paid' }).exec();
                        return next(new response_handler_1.default(response).success(`User with ID ${userId} status updated to paid.`, {}, 200, {
                            type: 'success',
                            action: 'status-update'
                        }));
                    }
                    catch (err) {
                        return next(new response_handler_1.default(response).error(`Error updating user status: ${err.message}`, 400));
                    }
            }
        }
        catch (err) {
            return next(new response_handler_1.default(response).error(`Stripe webhook error: ${err.message}`, 500));
        }
    });
}
exports.webhookPayment = webhookPayment;
