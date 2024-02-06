/** @format */

import Table from "./Table";

function DashboardTable({ transactions = [] }) {
    const columns = [
        {
            header: "Id",
            accessorKey: "_id",
        },
        {
            header: "Quantity",
            accessorKey: "quantity",
        },
        {
            header: "Discount",
            accessorKey: "discount",
        },
        {
            header: "Amount",
            accessorKey: "amount",
        },
        {
            header: "Status",
            accessorKey: "status",
        },
    ];

    return (
        <Table
            data={transactions}
            columns={columns}
            heading={"Top 5 Transactions"}
            containerClassname={"transactionBox"}
        />
    );
}

export default DashboardTable;
