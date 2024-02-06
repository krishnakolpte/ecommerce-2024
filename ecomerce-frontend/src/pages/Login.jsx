/** @format */

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userAPI";

function Login() {
    const [gender, setGender] = useState("");
    const [date, setDate] = useState("");
    const [login] = useLoginMutation();

    const loginHandler = async () => {
        try {
            const provider = new GoogleAuthProvider();

            const { user } = await signInWithPopup(auth, provider);

            const res = await login({
                _id: user.uid,
                name: user.displayName,
                photo: user.photoURL,
                email: user.email,
                dob: date,
                gender: gender,
            });

            if ("data" in res) {
                toast.success(res.data.message);
            } else {
                const error = res.error;
                const message = error.data.message;

                toast.error(message);
            }
        } catch (error) {
            toast.error("Sign In Fail");
        }
    };

    return (
        <section className="login">
            <main>
                <h1>Login</h1>

                <div>
                    <label htmlFor="gender">Gender</label>
                    <select
                        name="gender"
                        id="gender"
                        required
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}>
                        <option value="">Choose Your Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        value={date}
                        id="date"
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <p>Already Signed Once?</p>
                <div className="gauth">
                    <FcGoogle />
                    <button
                        onClick={loginHandler}
                        className="actionButton">
                        Login with Google
                    </button>
                </div>
            </main>
        </section>
    );
}

export default Login;
