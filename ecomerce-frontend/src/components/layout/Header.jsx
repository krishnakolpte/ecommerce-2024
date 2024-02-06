/** @format */
import { Link } from "react-router-dom";
import {
    FaSearch,
    FaShoppingBag,
    FaSignInAlt,
    FaSignOutAlt,
    FaUser,
} from "react-icons/fa";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import toast from "react-hot-toast";

function Header({ user }) {
    const [isOpen, setIsOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            await signOut(auth);
            toast.success("Sign Out Successfully");
            setIsOpen(false);
        } catch (error) {
            toast.error("Sign Out Fail");
        }
    };

    return (
        <nav className="header">
            <Link
                to={"/"}
                onClick={() => setIsOpen(false)}>
                HOME
            </Link>
            <Link
                to={"/search"}
                onClick={() => setIsOpen(false)}>
                <FaSearch />
            </Link>
            <Link
                to={"/cart"}
                onClick={() => setIsOpen(false)}>
                <FaShoppingBag />
            </Link>
            {user && user?._id ? (
                <>
                    <button onClick={() => setIsOpen((prev) => !prev)}>
                        <FaUser />
                    </button>
                    <dialog open={isOpen}>
                        <div>
                            {user?.role == "admin" && (
                                <Link
                                    onClick={() => setIsOpen((prev) => !prev)}
                                    to={"/admin/dashboard"}>
                                    Admin
                                </Link>
                            )}
                            <Link
                                onClick={() => setIsOpen((prev) => !prev)}
                                to={"/orders"}>
                                My Orders
                            </Link>
                            <button onClick={logoutHandler}>
                                <FaSignOutAlt />
                            </button>
                        </div>
                    </dialog>
                </>
            ) : (
                <Link to={"/login"}>
                    <FaSignInAlt />
                </Link>
            )}
        </nav>
    );
}

export default Header;
