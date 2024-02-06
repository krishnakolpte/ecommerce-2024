/** @format */
import { useState, useEffect } from "react";
import Adminsidebar from "../../../components/admin/Adminsidebar";

const formatTime = (timeInSeconds) => {
    const ts = Number(timeInSeconds);
    const hours = String(Math.floor(ts / 3600));
    const mins = String(Math.floor((ts % 3600) / 60));
    const seconds = String(ts % 60);

    return `${hours.padStart(2, "0")} : ${mins.padStart(
        2,
        "0"
    )} : ${seconds.padStart(2, "0")}`;
};

function StopWatch() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const resetHandler = () => {
        setTime(0);
        setIsRunning(false);
    };

    useEffect(() => {
        let intervalID;
        if (isRunning) {
            intervalID = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        }

        return () => {
            clearInterval(intervalID);
        };
    }, [isRunning]);

    return (
        <div className="adminContainer">
            <Adminsidebar />
            <main className="dashboardAppContainer">
                <h1>Stopwatch</h1>
                <section>
                    <div className="stopwatch">
                        <h2>{formatTime(time)}</h2>
                        <button onClick={() => setIsRunning((prev) => !prev)}>
                            {isRunning ? "Stop" : "Start"}
                        </button>
                        <button onClick={resetHandler}>Reset</button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default StopWatch;
