/** @format */

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    addToCart,
    applayDiscount,
    calculatePrice,
    removeCartItem,
} from "../redux/reducer/cartReducer";
import { server } from "../redux/store";

function Cart() {
    const dispatch = useDispatch();
    const { cartItems, subtotal, tax, shippingCharges, discount, total } =
        useSelector((state) => state.cartReducer);

    const [couponCode, setCouponCode] = useState("");
    const [isValidCouponCode, setIsValidCouponCode] = useState(false);

    useEffect(() => {
        const { cancelToken, cancel } = axios.CancelToken.source();
        const timeOutId = setTimeout(() => {
            axios
                .get(`${server}/payment/discount?couponcode=${couponCode}`, {
                    cancelToken,
                })
                .then((res) => {
                    dispatch(applayDiscount(res.data.discount));
                    toast.success(
                        `Congratulation's, You get ${res.data.discount} Rupies Discount`
                    );
                    dispatch(calculatePrice());
                    setIsValidCouponCode(true);
                })
                .catch((e) => {
                    toast.error(e.response.data.message);
                    dispatch(applayDiscount(0));
                    dispatch(calculatePrice());
                    setIsValidCouponCode(false);
                });
        }, 1000);
        return () => {
            clearTimeout(timeOutId);
            cancel();
            setIsValidCouponCode(false);
        };
    }, [couponCode, dispatch]);

    useEffect(() => {
        dispatch(calculatePrice());
    }, [cartItems, dispatch]);

    return (
        <section className="cart">
            <main>
                {cartItems.length > 0 ? (
                    <h1>Cart Items</h1>
                ) : (
                    <h1>No Cart Items Added!</h1>
                )}
                {cartItems &&
                    cartItems?.map((item, i) => (
                        <CartItem
                            key={i}
                            cartItem={item}
                        />
                    ))}
            </main>
            <aside>
                <p>Subtotal- ₹{subtotal}</p>
                <p>Shipping Charges- ₹{shippingCharges}</p>
                <p>Tax- ₹{tax}</p>
                <p>
                    Discount: <em className="red"> - ₹{discount}</em>
                </p>
                <p>
                    <b>Total- ₹{total}</b>
                </p>
                <input
                    type="text"
                    value={couponCode}
                    placeholder="Coupon code"
                    onChange={(e) => setCouponCode(e.target.value)}
                />

                {couponCode &&
                    (isValidCouponCode ? (
                        <span className="green">
                            ₹ {discount} off using the{" "}
                            <code>({couponCode}) </code>
                            coupon code.
                        </span>
                    ) : (
                        <span className="red">
                            Invalid coupon code <VscError />
                        </span>
                    ))}

                {cartItems.length > 0 && (
                    <Link
                        className="actionButton"
                        to={`/shipping`}>
                        Checkout
                    </Link>
                )}
            </aside>
        </section>
    );
}

const CartItem = ({ cartItem }) => {
    const dispatch = useDispatch();

    const increamentHandler = () => {
        if (cartItem?.quantity >= cartItem?.stock) {
            return toast.error(
                `Avalable Stock,  Only ${cartItem?.stock} Items.`
            );
        }
        dispatch(addToCart({ ...cartItem, quantity: cartItem?.quantity + 1 }));
    };

    const decreamentHandler = () => {
        if (cartItem?.quantity <= 1) {
            return;
        }

        dispatch(addToCart({ ...cartItem, quantity: cartItem?.quantity - 1 }));
    };

    const removeHandler = () => {
        dispatch(removeCartItem(cartItem?.productId));
        toast.success("removed Item Successfully");
    };

    return (
        <div className="cartItem">
            <img
                src={cartItem?.photo.url}
                alt={cartItem?.name}
            />
            <article>
                <Link to={`/product/${cartItem?.productId}`}>
                    {cartItem?.name}
                </Link>
                <span>₹{cartItem?.price}</span>
            </article>
            <div>
                <button onClick={decreamentHandler}>-</button>
                <p>{cartItem?.quantity}</p>
                <button onClick={increamentHandler}>+</button>
            </div>
            <button onClick={removeHandler}>
                <FaTrash />
            </button>
        </div>
    );
};

export default Cart;
