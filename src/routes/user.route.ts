import express, { Router } from "express";
import { LogIn, SignUp, changePassword, updateDetails } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { webhookPayment } from "../controllers/stripe.controller";

const router: Router = express.Router();

router.post('/sign-up', SignUp)
router.post('/sign-in', LogIn)
router.put('/update', verifyToken, updateDetails)
router.put('/change-password', verifyToken, changePassword)

router.post('/stripe-webhook', express.raw({ type: 'application/json' }), verifyToken, webhookPayment)

export default router