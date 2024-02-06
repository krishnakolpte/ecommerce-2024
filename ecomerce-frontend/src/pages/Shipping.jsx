/** @format */

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { server } from "../redux/store";

function Shipping() {
    const { user } = useSelector((state) => state.userReducer);
    const { cartItems, total } = useSelector((state) => state.cartReducer);

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [pincode, setPincode] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch(
            saveShippingInfo({
                address: address,
                city: city,
                state: state,
                country: country,
                pincode: pincode,
            })
        );

        try {
            const { data } = await axios.post(
                `${server}/payment/create`,
                {
                    amount: total,
                    name: user?.name,
                    address,
                    pincode,
                    city,
                    state,
                    country,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            navigate("/pay", {
                state: data.clientSecrate,
            });
        } catch (error) {
            toast.error("somthing went wrong");
        }
    };

    useEffect(() => {
        if (cartItems?.length <= 0) return navigate("/cart");
    }, [navigate, cartItems]);

    return (
        <section className="shipping">
            <button
                className="back-btn"
                onClick={() => navigate("/cart")}>
                <BiArrowBack />
            </button>
            <form onSubmit={submitHandler}>
                <h1>Shipping Address</h1>
                <input
                    required
                    type="text"
                    placeholder="Address"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <input
                    required
                    type="text"
                    placeholder="City"
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <input
                    required
                    type="text"
                    placeholder="State"
                    name="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                />

                <select
                    name="country"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}>
                    <option value="">Chose Country</option>
                    <option value="india">India</option>
                </select>

                <input
                    required
                    type="number"
                    placeholder="Pincode"
                    name="pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                />

                <button
                    className="actionButton"
                    type="submit">
                    Pay Now
                </button>
            </form>
        </section>
    );
}

export default Shipping;
