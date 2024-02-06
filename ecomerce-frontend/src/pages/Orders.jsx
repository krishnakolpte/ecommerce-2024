/** @format */
import { Link } from "react-router-dom";
import Table from "../components/admin/Table";
import { createColumnHelper } from "@tanstack/react-table";

function Orders() {
    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor("id", {
            id: "id",
            header: "Id",
        }),
        columnHelper.accessor("quantity", {
            id: "quantity",
            header: "Quantity",
        }),
        columnHelper.accessor("discount", {
            id: "discount",
            header: "Discount",
        }),
        columnHelper.accessor("amount", {
            id: "amount",
            header: "Amount",
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

    const transactions = [
        {
            id: "Hanuman",
            quantity: 3,
            discount: 400,
            amount: 2000000,
            status: <span className="red">Processing</span>,
            action: <Link to={"/order/dfgb"}>View</Link>,
        },
        {
            id: "Hanuman",
            amount: 2000000,
            discount: 400,
            quantity: 3,
            status: <span className="green">Processing</span>,
            action: <Link to={"/order/dfgb"}>View</Link>,
        },
        {
            id: "Hanuman",
            amount: 2000000,
            discount: 400,
            quantity: 3,
            status: <span className="purple">Processing</span>,
            action: <Link to={"/order/dfgb"}>View</Link>,
        },
    ];

    return (
        <div className="container">
            <h1>My Orders</h1>
            <Table
                data={transactions}
                columns={columns}
                containerClassname={"myOrdersList"}
                heading={"Orders"}
                pagination={true}
            />
        </div>
    );
}

export default Orders;
