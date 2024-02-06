/** @format */
import photo from "../../assets/images/page-not-found-404.jpg";

function PageNotFound() {
    return (
        <div className="pge-not-fond">
            <h1>Pge not found</h1>
            <img
                src={photo}
                alt="pge not found"
            />
        </div>
    );
}

export default PageNotFound;
