/** @format */
import { Link } from "react-router-dom";
import ProductCard from "../components/layout/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../components/layout/Loader";

function Home() {
    const { data, isLoading, isError } = useLatestProductsQuery("");

    if (isError) toast.error("Cannot fetch the Products");

    return (
        <section className="home">
            <section></section>
            <h1>
                Latest Products{" "}
                <Link
                    className="findMore"
                    to={"/search"}>
                    More
                </Link>
            </h1>

            <main>
                {isLoading ? (
                    <Skeleton width={"80vw"} />
                ) : (
                    data?.products.map((prod) => (
                        <ProductCard
                            key={prod._id}
                            id={prod._id}
                            name={prod.name}
                            price={prod.price}
                            stock={prod.stock}
                            photo={prod.photo.url}
                        />
                    ))
                )}
            </main>
        </section>
    );
}

export default Home;
