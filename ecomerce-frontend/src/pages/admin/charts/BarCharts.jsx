/** @format */

import { useEffect, useState } from "react";
import Adminsidebar from "../../../components/admin/Adminsidebar";
import { BarChart, last12Months } from "../../../components/admin/Charts";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useBarQuery } from "../../../redux/api/dashboardAPI";
import { Skeleton } from "../../../components/layout/Loader";

function BarCharts() {
    const { user } = useSelector((state) => state.userReducer);

    const { data, isLoading, isError, error } = useBarQuery(user._id);

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
                <h1>Bar Charts</h1>
                {isLoading ? (
                    <Skeleton width={"80%"} />
                ) : (
                    <>
                        <section>
                            <BarChart
                                data_1={chartData?.products}
                                data_2={chartData?.users}
                                title_1={"Products"}
                                title_2={"Users"}
                                bgColor_1={"hsl(260,50%,30%)"}
                                bgColor_2={"hsl(360,90%,90%)"}
                                legendDisplay={true}
                            />
                            <h2>TOP SELLING PRODUCTS & CUSTOMERS</h2>
                        </section>
                        <section>
                            <BarChart
                                horizontal={true}
                                data_1={chartData?.orders}
                                data_2={[]}
                                title_1={"Products"}
                                title_2={""}
                                bgColor_1={"hsl(260,50%,30%)"}
                                bgColor_2={""}
                                labels={last12Months}
                            />
                            <h2>Orders throughout the year</h2>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

export default BarCharts;
