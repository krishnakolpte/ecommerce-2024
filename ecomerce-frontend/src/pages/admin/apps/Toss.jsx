/** @format */
import { useState, useEffect } from "react";
import Adminsidebar from "../../../components/admin/Adminsidebar";

function Toss() {
    const [angle, setAngle] = useState(0);

    const flipCoine = () => {
        if (Math.random() > 0.5) {
            setAngle((prev) => prev + 180);
        } else setAngle((prev) => prev + 360);
    };

    return (
        <div className="adminContainer">
            <Adminsidebar />
            <main className="dashboardAppContainer">
                <h1>Toss</h1>
                <section>
                    <article
                        className="tossCoine"
                        onClick={flipCoine}
                        style={{
                            transform: `rotateY(${angle}deg)`,
                        }}>
                        <div></div>
                        <div></div>
                    </article>
                </section>
            </main>
        </div>
    );
}

export default Toss;
