/** @format */

import { useSelector } from "react-redux";
import Adminsidebar from "../../../components/admin/Adminsidebar";
import { LineChart } from "../../../components/admin/Charts";
import { useLineQuery } from "../../../redux/api/dashboardAPI";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Skeleton } from "../../../components/layout/Loader";

function LineCharts() {
    const { user } = useSelector((state) => state.userReducer);

    const { data, isLoading, isError, error } = useLineQuery(user._id);

    if (isError) toast.error(error.data.message);

    const [chartData, setChartData] = useState();

    useEffect(() => {
        if (data) {
            setChartData(data.charts);
        }
    }, [data]);

    return (
        <div className="adminContainer">
            <Adminsidebar />
            <main className="chartsContainer">
                <h1>Line Charts</h1>
                {isLoading ? (
                    <Skeleton width={"80%"} />
                ) : (
                    <>
                        <section>
                            <LineChart
                                data={chartData?.users}
                                bgColor={["rgb(76, 201, 240)"]}
                                borderColor={"rgb(67, 97, 238)"}
                                label={"Users"}
                            />
                            <h2>Active Users</h2>
                        </section>
                        <section>
                            <LineChart
                                data={chartData?.products}
                                borderColor={"rgb(90, 24, 154)"}
                                bgColor={["rgb(157, 78, 221)"]}
                                label={"Products"}
                            />
                            <h2>Total Products(SKU)</h2>
                        </section>
                        <section>
                            <LineChart
                                data={chartData?.revenue}
                                borderColor={"rgb(128, 147, 241)"}
                                bgColor={["rgb(247, 174, 248)"]}
                                label={"Revenue"}
                            />
                            <h2>Total Revenue</h2>
                        </section>
                        <section>
                            <LineChart
                                data={chartData?.orders}
                                borderColor={"rgb(140, 147, 241)"}
                                bgColor={["rgb(247, 174, 248)"]}
                                label={"Orders"}
                            />
                            <h2>Total Orders</h2>
                        </section>
                        <section>
                            <LineChart
                                data={chartData?.discount}
                                borderColor={"rgb(255, 15, 18)"}
                                bgColor={["rgb(255, 191, 105)"]}
                                label={"Discount"}
                            />
                            <h2>Discount Alloted</h2>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

export default LineCharts;
