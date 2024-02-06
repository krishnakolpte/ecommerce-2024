/** @format */

import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Adminsidebar from "../../components/admin/Adminsidebar";
import Table from "../../components/admin/Table";
import { Skeleton } from "../../components/layout/Loader";
import { responseToast } from "../../features";
import {
    useAdminAllUsersQuery,
    useDeleteUserMutation,
} from "../../redux/api/userAPI";

function Customers() {
    const { user } = useSelector((state) => state.userReducer);

    const columnHelper = createColumnHelper();

    const { data, isError, error, isLoading } = useAdminAllUsersQuery(
        user?._id
    );

    const [deleteUser] = useDeleteUserMutation();
    const [customers, setCustomers] = useState([{}]);

    if (isError) toast.error(error.data.message);

    const columns = [
        columnHelper.accessor("avatar", {
            id: "avatar",
            header: "Avaatar",
            cell: ({ getValue }) => getValue(),
        }),
        columnHelper.accessor("name", {
            id: "name",
            header: "Name",
        }),
        columnHelper.accessor("gender", {
            id: "gender",
            header: "Gender",
        }),
        columnHelper.accessor("email", {
            id: "email",
            header: "Email",
        }),
        columnHelper.accessor("role", {
            id: "role",
            header: "Role",
        }),
        columnHelper.accessor("action", {
            id: "action",
            header: "Action",
            cell: ({ getValue }) => getValue(),
        }),
    ];

    const deleteHandler = async (id) => {
        const res = await deleteUser({ aid: user?._id, uid: id });

        responseToast(res, null, "");
    };

    useEffect(() => {
        if (data) {
            setCustomers(
                data.users.map((user) => ({
                    avatar: (
                        <img
                            style={{ borderRadius: "50%" }}
                            src={user.photo}
                            alt={user.name}
                        />
                    ),
                    name: user.name,
                    gender: user.gender,
                    email: user.email,
                    role: user.role,
                    action: (
                        <button onClick={() => deleteHandler(user._id)}>
                            <FaTrash />
                        </button>
                    ),
                }))
            );
        }
    }, [data]);

    return (
        <div className="adminContainer">
            <Adminsidebar />
            <main className="cunsumerList">
                {isLoading ? (
                    <Skeleton width={"80%"} />
                ) : (
                    <Table
                        data={customers}
                        columns={columns}
                        containerClassname={"dashboardCunsumerList"}
                        heading={"Customers"}
                        pagination={true}
                    />
                )}
            </main>
        </div>
    );
}

export default Customers;
