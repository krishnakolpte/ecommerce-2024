/** @format */

import { useSelector } from "react-redux";
import Adminsidebar from "../../../components/admin/Adminsidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import { usePieQuery } from "../../../redux/api/dashboardAPI";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Skeleton } from "../../../components/layout/Loader";

function PieCharts() {
    const { user } = useSelector((state) => state.userReducer);

    const { data, isLoading, isError, error } = usePieQuery(user._id);

    if (isError) toast.error(error.data.message);

    const [chartData, setChartData] = useState();

    const categories = chartData?.productsCategories;

    useEffect(() => {
        if (data) {
            setChartData(data.charts);
        }
    }, [data]);

    return (
        <div className="adminContainer">
            <Adminsidebar />
            <main className="chartsContainer">
                <h1>Pie & Doughnut Charts</h1>
                {isLoading ? (
                    <Skeleton width={"80%"} />
                ) : (
                    <>
                        <section>
                            <div>
                                <PieChart
                                    labels={[
                                        "Processing",
                                        "Shipped",
                                        "Delivered",
                                    ]}
                                    data={[
                                        chartData?.orderFullFillment.processing,
                                        chartData?.orderFullFillment.shipped,
                                        chartData?.orderFullFillment.delivered,
                                    ]}
                                    bgColor={[
                                        "hsl(246, 46%, 37%)",
                                        "hsl(45, 99%, 49%)",
                                        "hsl(22, 97%, 48%)",
                                    ]}
                                    offset={[0, 0, 50]}
                                    legends={true}
                                />
                            </div>
                            <h2>Order Fullfillment Ratio</h2>
                        </section>
                        <section>
                            <div>
                                <DoughnutChart
                                    labels={categories?.map(
                                        (i) => Object.keys(i)[0]
                                    )}
                                    data={categories?.map(
                                        (i) => Object.values(i)[0]
                                    )}
                                    bgColor={chartData?.productsCategories.map(
                                        (i) =>
                                            `hsl(${Object.values(i)[0]},${
                                                Math.random().toFixed() + 1 * 20
                                            }%,50%)`
                                    )}
                                    offset={[0, 0, 0, 80]}
                                    legends={false}
                                />
                            </div>
                            <h2>Product Category Ratio</h2>
                        </section>
                        <section>
                            <div>
                                <DoughnutChart
                                    labels={["In Stock", "Out of Stock"]}
                                    data={[
                                        chartData?.stockAvailability.instock,
                                        chartData?.stockAvailability.outOfStock,
                                    ]}
                                    bgColor={[
                                        "hsl(269,90%,40%)",
                                        "hsl(190,90%,30%)",
                                    ]}
                                    offset={[0, 80]}
                                    legends={false}
                                    cutout={"70%"}
                                />
                            </div>
                            <h2>Stock Availability</h2>
                        </section>
                        <section>
                            <div>
                                <DoughnutChart
                                    labels={[
                                        "Marketing Cost",
                                        "Discount",
                                        "Burnt",
                                        "Production Cost",
                                        "Net Margin",
                                    ]}
                                    data={[
                                        chartData?.revenueDistribution
                                            .marketingCost,
                                        chartData?.revenueDistribution.discount,
                                        chartData?.revenueDistribution.burnt,
                                        chartData?.revenueDistribution
                                            .productionCost,
                                        chartData?.revenueDistribution
                                            .netmargin,
                                    ]}
                                    bgColor={[
                                        "hsl(199, 64%, 73%)",
                                        "hsl(192, 70%, 43%)",
                                        "hsl(200, 95%, 14%)",
                                        "hsl(43, 100%, 51%)",
                                        "hsl(32, 100%, 49%)",
                                    ]}
                                    offset={[0, 80, 0, 0, 80]}
                                    legends={false}
                                />
                            </div>
                            <h2>Revenue Distribution</h2>
                        </section>
                        <section>
                            <div>
                                <PieChart
                                    labels={[
                                        "Teenager(Below 20)",
                                        "Adult(20 - 40)",
                                        "Older(Above 40)",
                                    ]}
                                    data={[
                                        chartData?.usersAgeGroupRatio.teen,
                                        chartData?.usersAgeGroupRatio.adult,
                                        chartData?.usersAgeGroupRatio.old,
                                    ]}
                                    bgColor={[
                                        "hsl(0, 100%, 24%)",
                                        "hsl(201, 100%, 14%)",
                                        "hsl(203, 39%, 57%)",
                                    ]}
                                    offset={[60, 0, 0]}
                                    legends={false}
                                />
                            </div>
                            <h2>Users Age Group</h2>
                        </section>
                        <section>
                            <div>
                                <DoughnutChart
                                    labels={["Admin", "Customers"]}
                                    data={[
                                        chartData?.adminAndUsersRatio.admin,
                                        chartData?.adminAndUsersRatio.customers,
                                    ]}
                                    bgColor={[
                                        "hsl(221, 51%, 16%)",
                                        "hsl(37, 98%, 53%)",
                                    ]}
                                    offset={[80, 0]}
                                    legends={true}
                                />
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

export default PieCharts;
