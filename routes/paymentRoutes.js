import express from "express";
import {
    cashOnDelivery,
    esewaPayment,
    esewaSuccess,
    esewaFailure,
    stripePayment,
} from "../controllers/paymentController.js";

const router = express.Router();

// COD
router.post("/payment/cod", cashOnDelivery);

// Esewa
router.post("/payment/esewa", esewaPayment);
router.get("/payment/esewa/success", esewaSuccess);
router.get("/payment/esewa/failure", esewaFailure);

// Stripe
router.post("/payment/stripe", stripePayment);

export default router;
