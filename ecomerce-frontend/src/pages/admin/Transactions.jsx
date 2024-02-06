/** @format */

import { Link } from "react-router-dom";
import Adminsidebar from "../../components/admin/Adminsidebar";
import Table from "../../components/admin/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAllOrdersQuery } from "../../redux/api/orderAPI";
import { Skeleton } from "../../components/layout/Loader";

function Transactions() {
    const { user } = useSelector((state) => state.userReducer);
    const columnHelper = createColumnHelper();

    const { data, isError, error, isLoading } = useAllOrdersQuery(user?._id);

    const [transactions, setTransactions] = useState([{}]);

    if (isError) toast.error(error.data.message);

    const columns = [
        columnHelper.accessor("user", {
            id: "user",
            header: "User",
        }),
        columnHelper.accessor("amount", {
            id: "amount",
            header: "Amount",
        }),
        columnHelper.accessor("discount", {
            id: "discount",
            header: "Discount",
        }),
        columnHelper.accessor("quantity", {
            id: "quantity",
            header: "Quantity",
        }),
        columnHelper.accessor("status", {
            id: "status",
            header: "Status",
            cell: ({ getValue }) => getValue(),
        }),
        columnHelper.accessor("action", {
            id: "action",
            header: "Action",
            cell: ({ getValue }) => getValue(),
        }),
    ];

    useEffect(() => {
        if (data) {
            setTransactions(
                data.orders.map((transaction) => ({
                    user: transaction?.user?.name,
                    amount: transaction?.total,
                    discount: transaction?.discount,
                    quantity: transaction?.orderItems?.length,
                    status: (
                        <span
                            className={
                                transaction?.status === "processing"
                                    ? "red"
                                    : transaction.status === "shipped"
                                    ? "green"
                                    : "purple"
                            }>
                            {transaction?.status}
                        </span>
                    ),
                    action: (
                        <Link to={`/admin/transaction/${transaction?._id}`}>
                            Manage
                        </Link>
                    ),
                }))
            );
        }
    }, [data]);

    return (
        <div className="adminContainer">
            <Adminsidebar />
            <main className="transactionList">
                {isLoading ? (
                    <Skeleton width={"80%"} />
                ) : (
                    <Table
                        data={transactions}
                        columns={columns}
                        containerClassname={"dashboardTransactionList"}
                        heading={"Transactions"}
                        pagination={true}
                    />
                )}
            </main>
        </div>
    );
}

export default Transactions;
