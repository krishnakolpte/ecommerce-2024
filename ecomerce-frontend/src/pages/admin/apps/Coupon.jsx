/** @format */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Adminsidebar from "../../../components/admin/Adminsidebar";
import { Skeleton } from "../../../components/layout/Loader";
import { responseToast } from "../../../features";
import { useNewCouponSaveMutation } from "../../../redux/api/paymentAPI";

const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const allNubers = "1234567890";
const allSymbols = "!@#$%^&*()_+";

function Coupon() {
    const [size, setSize] = useState(8);
    const [prefix, setPrefix] = useState("");
    const [includeNumbers, setIncludeNumbers] = useState(false);
    const [includeCharecters, setIncludeCharecters] = useState(false);
    const [includeSymbols, setIncludeSymbols] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const [coupon, setCoupon] = useState("");
    const [amount, setAmount] = useState("");
    const [couponCode, setCouponCode] = useState("");

    const { user, loading } = useSelector((state) => state.userReducer);

    const [saveNewCoupon] = useNewCouponSaveMutation();

    const copyText = async () => {
        await window.navigator.clipboard.writeText(coupon);
        setIsCopied(true);
    };
    const pastText = async () => {
        const code = await window.navigator.clipboard.readText(coupon);
        setCouponCode(code);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (!includeNumbers && !includeCharecters && !includeSymbols) {
            return toast.error("Please Select atleast One Field");
        }

        if (!prefix) {
            return toast.error("Please provide Coupon text to generate Coupon");
        }

        let result = prefix || "";
        const loopLength = Number(size - result.length);

        for (let i = 0; i < loopLength; i++) {
            let entaierString = "";
            if (includeNumbers) entaierString += allNubers;
            if (includeCharecters) entaierString += allLetters;
            if (includeSymbols) entaierString += allSymbols;

            const randomNum = ~~(Math.random() * entaierString.length);
            result += entaierString[randomNum];
        }

        setCoupon(result);
    };

    const submitSaveHandler = async (e) => {
        e.preventDefault();

        if (!amount || !couponCode) {
            return toast.error("Please enter Coupon And Amount");
        } else {
            const data = { amount: amount.toString(), couponcode: couponCode };

            const res = await saveNewCoupon({ formData: data, id: user?._id });

            responseToast(res, null, "");
            setAmount("");
            setCouponCode("");
        }
    };

    useEffect(() => {
        setIsCopied(false);
    }, [coupon]);

    return (
        <div className="adminContainer">
            <Adminsidebar />
            <main
                style={{ overflowY: "auto" }}
                className="dashboardAppContainer">
                {loading ? (
                    <Skeleton width={"80%"} />
                ) : (
                    <>
                        <h1>Coupon Generator & Save In DataBase</h1>
                        <section>
                            <form
                                className="couponForm"
                                onSubmit={submitHandler}>
                                <input
                                    type="text"
                                    placeholder="Text to include"
                                    required
                                    value={prefix}
                                    onChange={(e) => setPrefix(e.target.value)}
                                    maxLength={size}
                                />
                                <input
                                    type="number"
                                    placeholder="Coupon length"
                                    required
                                    value={size}
                                    onChange={(e) =>
                                        setSize(Number(e.target.value))
                                    }
                                    min={8}
                                    max={25}
                                />

                                <fieldset>
                                    <legend>Include</legend>
                                    <input
                                        type="checkbox"
                                        checked={includeNumbers}
                                        onChange={() => {
                                            setIncludeNumbers((prev) => !prev);
                                        }}
                                    />
                                    <span>Numbers</span>
                                    <input
                                        type="checkbox"
                                        checked={includeCharecters}
                                        onChange={() => {
                                            setIncludeCharecters(
                                                (prev) => !prev
                                            );
                                        }}
                                    />
                                    <span>Charecters</span>
                                    <input
                                        type="checkbox"
                                        checked={includeSymbols}
                                        onChange={() => {
                                            setIncludeSymbols((prev) => !prev);
                                        }}
                                    />
                                    <span>Symbols</span>
                                </fieldset>
                                <button
                                    type="submit"
                                    className="actionButton">
                                    Generate
                                </button>
                            </form>
                            {coupon && (
                                <code>
                                    {coupon}
                                    <span onClick={copyText}>
                                        {isCopied ? "Copied" : "Copy"}
                                    </span>
                                </code>
                            )}
                        </section>
                        <h1>Save Coupon </h1>
                        <section>
                            <form className="couponForm">
                                <input
                                    type="text"
                                    placeholder="Coupon Code"
                                    required
                                    onFocus={pastText}
                                    value={couponCode}
                                    onChange={(e) =>
                                        setCouponCode(e.target.value)
                                    }
                                />
                                <input
                                    type="number"
                                    placeholder="Coupon Amount"
                                    value={amount}
                                    required
                                    onChange={(e) =>
                                        setAmount(Number(e.target.value))
                                    }
                                    min={1}
                                    max={1000000}
                                />

                                <button
                                    onClick={submitSaveHandler}
                                    className="actionButton">
                                    Save Coupon
                                </button>
                            </form>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

export default Coupon;
