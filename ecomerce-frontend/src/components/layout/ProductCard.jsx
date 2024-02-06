/** @format */
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/reducer/cartReducer";

function ProductCard({ photo, name, price, id, stock }) {
    const dispatch = useDispatch();
    const addToCartHandler = () => {
        const cartItem = {
            name: name,
            photo: photo,
            price: price,
            quantity: 1,
            productId: id,
            stock: stock,
        };
        if (stock < 1) {
            return toast.error("Out Of Stock");
        }

        dispatch(addToCart(cartItem));
        return toast.success("Added to Cart");
    };

    return (
        <div className="productCard">
            <img
                src={photo}
                alt={name}
            />
            <p> {name} </p>
            <span>₹ {price}</span>
            <div>
                <button onClick={addToCartHandler}>
                    <FaPlus />
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
