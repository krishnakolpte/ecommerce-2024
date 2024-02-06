/** @format */
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Adminsidebar from "../../components/admin/Adminsidebar";
import { Skeleton } from "../../components/layout/Loader";
import { responseToast } from "../../features";
import {
    useDeleteProductMutation,
    useProductDetailsQuery,
    useUpdateProductMutation,
} from "../../redux/api/productAPI";

function ProductManagemet() {
    const params = useParams();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.userReducer);

    const { data, isLoading, isError } = useProductDetailsQuery({
        pid: params.id,
        uid: user._id,
    });

    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const {
        name,
        price,
        stock,
        category,
        photo,
        _id: id,
    } = data?.product || {
        name: "",
        price: 0,
        stock: 0,
        category: "",
        photo: "",
    };

    const [nameUpdate, setNameUpdate] = useState(name);
    const [categoryUpdate, setCategoryUpdate] = useState(category);
    const [priceUpdate, setPriceUpdate] = useState(price);
    const [stockUpdate, setStockUpdate] = useState(stock);
    const [imagePrevUpdate, setImagePrevUpdate] = useState();
    const [imageUpdate, setImageUpdate] = useState();

    const changeImageHandler = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImagePrevUpdate(reader.result);
            setImageUpdate(file);
        };
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        if (nameUpdate) {
            formData.set("name", nameUpdate);
        }

        if (priceUpdate) {
            formData.set("price", priceUpdate.toString());
        }

        if (stockUpdate !== undefined) {
            formData.set("stock", stockUpdate.toString());
        }

        if (imageUpdate) {
            formData.set("photo", imageUpdate);
        }

        if (categoryUpdate) {
            formData.set("category", categoryUpdate);
        }

        const res = await updateProduct({ formData, pid: id, uid: user?._id });

        responseToast(res, navigate, "/admin/products");
    };
    const deleteHandler = async () => {
        const res = await deleteProduct({ pid: id, uid: user?._id });

        responseToast(res, navigate, "/admin/products");
    };

    useEffect(() => {
        if (data) {
            setNameUpdate(data.product.name);
            setPriceUpdate(data.product.price);
            setStockUpdate(data.product.stock);
            setCategoryUpdate(data.product.category);
        }
    }, [data]);

    if (isError) {
        return <Navigate to={"/404"} />;
    }

    return (
        <div className="adminContainer">
            <Adminsidebar />
            <main className="productManagement">
                {isLoading ? (
                    <Skeleton />
                ) : (
                    <div>
                        <section>
                            <strong>ID - {id}</strong>
                            <img
                                src={photo?.url}
                                alt={name}
                            />
                            <p>{name}</p>
                            {stock > 0 ? (
                                <span className="green">{stock} Available</span>
                            ) : (
                                <span className="red">Not Available</span>
                            )}
                            <h3> {`₹ ${price}`}</h3>
                        </section>
                        <article>
                            <form onSubmit={submitHandler}>
                                <h2>Update Product</h2>
                                <div>
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={nameUpdate}
                                        onChange={(e) =>
                                            setNameUpdate(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={priceUpdate}
                                        onChange={(e) =>
                                            setPriceUpdate(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        placeholder="Stock"
                                        value={stockUpdate}
                                        onChange={(e) =>
                                            setStockUpdate(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label>Category</label>
                                    <input
                                        type="text"
                                        placeholder="Category"
                                        value={categoryUpdate}
                                        onChange={(e) =>
                                            setCategoryUpdate(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label>Photo</label>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        onChange={changeImageHandler}
                                        placeholder="Select File"
                                    />
                                </div>
                                {imagePrevUpdate && (
                                    <img
                                        src={imagePrevUpdate}
                                        alt="Product Photo"
                                    />
                                )}
                                <button
                                    className="actionButton"
                                    type="submit">
                                    Update
                                </button>
                                <button
                                    className="delete-product-Button"
                                    onClick={deleteHandler}>
                                    <FaTrash />
                                </button>
                            </form>
                        </article>
                    </div>
                )}
            </main>
        </div>
    );
}

export default ProductManagemet;
