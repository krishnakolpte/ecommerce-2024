/** @format */

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Adminsidebar from "../../components/admin/Adminsidebar";
import { Skeleton } from "../../components/layout/Loader";
import { responseToast } from "../../features";
import {
    useDeleteOrderMutation,
    useOrderDetailsQuery,
    useProcessOrderMutation,
} from "../../redux/api/orderAPI";

function TransactionManagement() {
    const params = useParams();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.userReducer);

    const { data, isLoading, isError } = useOrderDetailsQuery({
        oid: params.id,
        id: user._id,
    });

    const [processOrder] = useProcessOrderMutation();
    const [deleteOrder] = useDeleteOrderMutation();

    const [order, setOrder] = useState({});

    const { user: userInfo, orderItems, shippingInfo } = order;

    const updateHandler = async () => {
        if (order?.status === "delivered") {
            return toast.error("Orderer Already Delivered");
        }
        const res = await processOrder({ oid: params.id, id: user._id });
        responseToast(res);
    };

    const deleteHandler = async () => {
        const res = await deleteOrder({ oid: params.id, id: user._id });
        responseToast(res, navigate, "/admin/transactions");
    };

    useEffect(() => {
        if (data) {
            setOrder(data?.order);
        }
    }, [data]);

    if (isError) {
        return <Navigate to={"/404"} />;
    }

    return (
        <div className="adminContainer">
            <Adminsidebar />
            <main className="productManagement">
                <div>
                    {isLoading ? (
                        <Skeleton />
                    ) : (
                        <>
                            <section style={{ padding: "2rem 4rem" }}>
                                <h2>Order Items</h2>

                                {order &&
                                    orderItems?.map((item) => (
                                        <OrderItemCard
                                            photo={item.photo.url}
                                            name={item.name}
                                            price={item.price}
                                            quantity={item.quantity}
                                            id={item._id}
                                            key={item._id}
                                        />
                                    ))}
                            </section>
                            <article className="shippingInfoCard">
                                <h1>Order Info</h1>
                                <h5>User Info</h5>
                                <p>Name: {userInfo?.name}</p>
                                <p>
                                    Address:{" "}
                                    {`${shippingInfo?.address}, ${shippingInfo?.city}, ${shippingInfo?.state}, ${shippingInfo?.country}, ${shippingInfo?.pincode}`}
                                </p>
                                <h5>Amount Info</h5>
                                <p>Subtotal: {order?.subtotal}</p>
                                <p>
                                    Shipping Charges: {order?.shippingCharges}
                                </p>
                                <p>Tax : {order?.tax}</p>
                                <p>Discount: {order?.discount}</p>
                                <p>Total: {order?.total}</p>

                                <h5>Status Info</h5>
                                <p>
                                    Status:{" "}
                                    <span
                                        className={
                                            order?.status === "Delivered"
                                                ? "purple"
                                                : order?.status === "Shipped"
                                                ? "green"
                                                : "red"
                                        }>
                                        {order?.status}
                                    </span>
                                </p>
                                <button
                                    style={{ marginTop: "2rem" }}
                                    className="actionButton"
                                    onClick={updateHandler}>
                                    Process Status
                                </button>
                                <button
                                    className="delete-product-Button"
                                    onClick={deleteHandler}>
                                    <FaTrash />
                                </button>
                            </article>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

const OrderItemCard = ({ photo, name, price, quantity, id }) => (
    <div className="transactionProductCard">
        <img
            src={photo}
            alt={name}
        />
        <Link to={`/product/${id}`}>{name}</Link>
        <span>{`₹ ${price} X ${quantity} = ${price * quantity}`}</span>
    </div>
);

export default TransactionManagement;
