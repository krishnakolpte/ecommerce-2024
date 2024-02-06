/** @format */

import { useState } from "react";
import ProductCard from "../components/layout/ProductCard";
import {
    useCategoriesQuery,
    useSearchProductsQuery,
} from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../components/layout/Loader";

function Search() {
    const {
        data: categoriesData,
        isLoading: loadingCategories,
        isError: categoriesIsError,
        error: categoriesError,
    } = useCategoriesQuery("");

    const [category, setCtegory] = useState("");
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [page, setPage] = useState(1);

    const {
        data: searchsearchProductsData,
        isLoading: productsLoading,
        isError: productsIsError,
        error: productsError,
    } = useSearchProductsQuery({
        search,
        sort,
        category,
        price: maxPrice,
        page,
    });
    if (categoriesIsError) toast.error(categoriesError.data.message);
    if (productsIsError) toast.error(productsError.data.message);

    return (
        <section className="search">
            <aside>
                <section>
                    <h2>Filters</h2>
                    <div>
                        <h4>Sort</h4>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}>
                            <option value="">None</option>
                            <option value="asc">Price (Low to High)</option>
                            <option value="dsc">Price (High to Low)</option>
                        </select>
                    </div>
                    <div>
                        <h4>Max Price: {maxPrice || ""} </h4>
                        <input
                            type="range"
                            min={100}
                            max={100000}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                    <div>
                        <h4>Category</h4>
                        <select
                            value={category}
                            onChange={(e) => setCtegory(e.target.value)}>
                            <option value="">All</option>
                            {!loadingCategories &&
                                categoriesData?.categories.map(
                                    (category, index) => (
                                        <option
                                            key={index}
                                            value={category}>
                                            {category.toUpperCase()}
                                        </option>
                                    )
                                )}
                        </select>
                    </div>
                </section>
            </aside>
            <main>
                <h1>Products</h1>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div>
                    {productsLoading ? (
                        <Skeleton width={"80%"} />
                    ) : (
                        searchsearchProductsData?.products.map((product) => (
                            <ProductCard
                                key={product._id}
                                id={product._id}
                                name={product.name}
                                price={product.price}
                                stock={product.stock}
                                photo={product.photo.url}
                            />
                        ))
                    )}
                </div>
                {searchsearchProductsData &&
                    searchsearchProductsData.totalPages > 1 && (
                        <article>
                            <button
                                disabled={page == 1 && true}
                                onClick={() => setPage((prev) => prev - 1)}>
                                Prev
                            </button>
                            <span>
                                {page} of {searchsearchProductsData?.totalPages}{" "}
                            </span>
                            <button
                                disabled={
                                    page ==
                                        searchsearchProductsData?.totalPages &&
                                    true
                                }
                                onClick={() => setPage((prev) => prev + 1)}>
                                Next
                            </button>
                        </article>
                    )}
            </main>
        </section>
    );
}

export default Search;
