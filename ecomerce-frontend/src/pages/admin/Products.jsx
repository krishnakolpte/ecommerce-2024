/** @format */

import { Link } from "react-router-dom";
import Adminsidebar from "../../components/admin/Adminsidebar";
import Table from "../../components/admin/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { FaPlus } from "react-icons/fa";
import { useAdminAllProductsQuery } from "../../redux/api/productAPI";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Skeleton } from "../../components/layout/Loader";

function Products() {
    const { user } = useSelector((state) => state.userReducer);

    const columnHelper = createColumnHelper();

    const { data, isError, error, isLoading } = useAdminAllProductsQuery(
        user?._id
    );

    const [products, setProducts] = useState([{}]);

    if (isError) toast.error(error.data.message);

    const columns = [
        columnHelper.accessor("photo", {
            id: "photo",
            header: "Photo",
            cell: ({ getValue }) => getValue(),
        }),
        columnHelper.accessor("name", {
            id: "name",
            header: "Name",
        }),
        columnHelper.accessor("price", {
            id: "price",
            header: "Price",
        }),
        columnHelper.accessor("stock", {
            id: "stock",
            header: "Stock",
        }),
        columnHelper.accessor("action", {
            id: "action",
            header: "Action",
            cell: ({ getValue }) => getValue(),
        }),
    ];

    useEffect(() => {
        if (data)
            setProducts(
                data.products.map((prod) => ({
                    photo: (
                        <img
                            src={prod.photo.url}
                            alt={prod.name}
                        />
                    ),
                    name: prod.name,
                    price: prod.price,
                    stock: prod.stock,
                    action: (
                        <Link to={`/admin/product/${prod._id}`}>Manage</Link>
                    ),
                }))
            );
    }, [data]);

    return (
        <div className="adminContainer">
            <Adminsidebar />
            <main className="productList">
                {isLoading ? (
                    <Skeleton width={"80%"} />
                ) : (
                    <Table
                        data={products}
                        columns={columns}
                        containerClassname={"dashboardProductList"}
                        heading={"Products"}
                        pagination={true}
                    />
                )}
            </main>
            <Link
                to={"/admin/product/new"}
                className="createProductBtn">
                <FaPlus />
            </Link>
        </div>
    );
}

export default Products;
