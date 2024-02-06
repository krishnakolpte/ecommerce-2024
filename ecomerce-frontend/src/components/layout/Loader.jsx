/** @format */

function Loader() {
    return (
        <section className="loader">
            <div></div>
        </section>
    );
}

export const Skeleton = ({ width }) => (
    <div
        className="skeleton-loader"
        style={{ width: width || "unset" }}>
        <div className="skleleton-shape"></div>
        <div className="skleleton-shape"></div>
        <div className="skleleton-shape"></div>
    </div>
);

export default Loader;
