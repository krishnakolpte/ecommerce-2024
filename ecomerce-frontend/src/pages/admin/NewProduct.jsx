/** @format */

import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Adminsidebar from "../../components/admin/Adminsidebar";
import { responseToast } from "../../features";
import { useCreateProductMutation } from "../../redux/api/productAPI";

function NewProduct() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.userReducer);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [imagePrev, setImagePrev] = useState("");
    const [image, setImage] = useState("");

    const [createProduct] = useCreateProductMutation();

    const changeImageHandler = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImagePrev(reader.result);
            setImage(file);
        };
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!name || !price || !stock || !image || !category) {
            return;
        } else {
            const formData = new FormData();

            formData.set("name", name);
            formData.set("category", category);
            formData.set("price", price.toString());
            formData.set("stock", stock.toString());
            formData.set("photo", image);

            const res = await createProduct({ formData, id: user?._id });

            responseToast(res, navigate, "/admin/products");
        }
    };

    return (
        <div className="adminContainer">
            <Adminsidebar />
            <main className="productManagement">
                <div>
                    <article>
                        <form onSubmit={submitHandler}>
                            <h2>New Product</h2>
                            <div>
                                <label>Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Price</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="Price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Stock</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="Stock"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Category</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Category"
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label>Photo</label>
                                <input
                                    accept="image/*"
                                    required
                                    type="file"
                                    onChange={changeImageHandler}
                                />
                            </div>
                            {imagePrev && (
                                <img
                                    src={imagePrev}
                                    alt="Product Photo"
                                />
                            )}
                            <button
                                className="actionButton"
                                type="submit">
                                Create
                            </button>
                        </form>
                    </article>
                </div>
            </main>
        </div>
    );
}

export default NewProduct;
