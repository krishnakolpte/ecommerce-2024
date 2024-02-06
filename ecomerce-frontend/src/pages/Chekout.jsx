/** @format */

import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { responseToast } from "../features";
import { useCreateNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart } from "../redux/reducer/cartReducer";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const ChekoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setProcessing] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.userReducer);

    const {
        cartItems,
        total,
        shippingInfo,
        subtotal,
        tax,
        shippingCharges,
        discount,
    } = useSelector((state) => state.cartReducer);
    const [newOrder] = useCreateNewOrderMutation();

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;
        setProcessing(true);

        const order = {
            shippingInfo: shippingInfo,
            orderItems: cartItems,
            user: user?._id,
            subtotal,
            tax,
            shippingCharges,
            discount,
            total,
        };

        const { paymentIntent, error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.origin },
            redirect: "if_required",
        });

        if (error) {
            setProcessing(false);
            return toast.error(error.message || "Somthing went wrong!");
        }

        if (paymentIntent.status === "succeeded") {
            const res = await newOrder(order);
            dispatch(resetCart());
            console.log("response:", res);
            responseToast(res, navigate, "/orders");
        }
        setProcessing(false);
    };

    return (
        <div className="checkout-container">
            <form onSubmit={submitHandler}>
                <PaymentElement />
                <button
                    type="submit"
                    disabled={isProcessing}
                    className="actionButton">
                    {isProcessing ? "Processing..." : "Pay"}
                </button>
            </form>
        </div>
    );
};

function Chekout() {
    const location = useLocation();

    const clientSecret = location.state;

    if (!clientSecret) return <Navigate to={"/shipping"} />;

    return (
        <Elements
            options={{
                clientSecret,
            }}
            stripe={stripePromise}>
            <ChekoutForm />
        </Elements>
    );
}

export default Chekout;
