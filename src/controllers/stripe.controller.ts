import { Stripe } from 'stripe'
import express, { NextFunction } from 'express'
import CustomResponse from '../utils/response.handler'
import userModel from '../models/user.model'
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`)

const stripeSecretKey = `${process.env.STRIPE_SECRET_KEY}`
const endpointSecret = `${process.env.STRIPE_WEBHOOK_SECRET}`

const stripeClient = new Stripe(stripeSecretKey)

export async function webhookPayment(
    request: express.Request,
    response: express.Response,
    next: NextFunction
) {

    try {
        const userId = request.user._id
        const signature = request.headers['stripe-signature']
        let event
        try {
            event = stripe.webhooks.constructEvent(
                request.body,
                `${signature}`,
                `${endpointSecret}`
            )
        }
        catch (err: any) {
            return next(new CustomResponse(response).error(
                `Webhook Error: ${err.message}`,
                400
            ))
        }


        //handle successful payment events
        switch (event.type) {
            case 'payment_intent.succeeded':
                const user = userId
                if (!user) {
                    return next(new CustomResponse(response).error(
                        'No ID passed',
                        404
                    ))
                }
                try {
                    await userModel.updateOne({ _id: user }, { status: 'paid' }).exec()
                    return next(new CustomResponse(response).success(
                        `User with ID ${userId} status updated to paid.`,
                        {},
                        200,
                        {
                            type: 'success',
                            action: 'status-update'
                        }
                    ))
                }
                catch (err: any) {
                    return next(new CustomResponse(response).error(
                        `Error updating user status: ${err.message}`,
                        400
                    ))
                }
        }

    }
    catch (err: any) {
        return next(new CustomResponse(response).error(
            `Stripe webhook error: ${err.message}`,
            500
        ))
    }

}