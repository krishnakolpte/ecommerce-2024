/** @format */

import { FaRegBell } from "react-icons/fa";
import Adminsidebar from "../../components/admin/Adminsidebar";
import { BsSearch } from "react-icons/bs";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import { BiMaleFemale } from "react-icons/bi";
import avatarImg from "../../assets/avatar.png";
import { BarChart, DoughnutChart } from "../../components/admin/Charts";
import DashboardTable from "../../components/admin/DashboardTable";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useStatsQuery } from "../../redux/api/dashboardAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/layout/Loader";

function Dashboard() {
    const { user } = useSelector((state) => state.userReducer);

    const { data, isLoading, isError, error } = useStatsQuery(user._id);

    if (isError) toast.error(error.data.message);

    const [stats, setStats] = useState();

    useEffect(() => {
        if (data) {
            setStats(data?.stats);
        }
    }, [data]);

    return (
        <div className="adminContainer">
            <Adminsidebar />
            <main className="dashboard">
                <div className="searchBar">
                    <BsSearch />
                    <input
                        type="text"
                        placeholder="Search Data, Users, docs"
                    />
                    <FaRegBell />
                    <img
                        src={avatarImg}
                        alt="avatar image"
                    />
                </div>
                {isLoading ? (
                    <Skeleton width={"80%"} />
                ) : (
                    <>
                        <section className="widgetContainer">
                            <Widgetitem
                                percent={stats?.percents?.revenue}
                                amount={true}
                                value={stats?.counts?.revenue}
                                heading={"Revenue"}
                                color={"rgb(0,115,255)"}
                            />
                            <Widgetitem
                                percent={stats?.percents?.user}
                                amount={false}
                                value={stats?.counts?.user}
                                heading={"Users"}
                                color={"rgb(0 198 202)"}
                            />
                            <Widgetitem
                                percent={stats?.percents?.order}
                                amount={false}
                                value={stats?.counts?.order}
                                heading={"Transactions"}
                                color={"rgb(255 192 0)"}
                            />
                            <Widgetitem
                                percent={stats?.percents?.product}
                                amount={false}
                                value={stats?.counts?.product}
                                heading={"Products"}
                                color={"rgb(76 0 255)"}
                            />
                        </section>
                        <section className="graphContainer">
                            <div className="revenueChart">
                                <h2>Revenue & Transaction</h2>
                                <BarChart
                                    horizontal={false}
                                    data_1={stats?.chart?.revenue}
                                    data_2={stats?.chart?.order}
                                    title_1={"Revenue"}
                                    title_2={"Transaction"}
                                    bgColor_1={"rgb(0,115,225)"}
                                    bgColor_2={"rgba(53,162,235,0.8)"}
                                    legendDisplay={true}
                                />
                            </div>
                            <div className="dashboardCategory">
                                <h2>Inventory</h2>
                                <div>
                                    {stats?.categoryCounts.map((category) => {
                                        const [heading, value] =
                                            Object.entries(category)[0];

                                        return (
                                            <CategoryItem
                                                key={heading}
                                                heading={heading}
                                                value={value}
                                                color={`hsl(${
                                                    value * 7
                                                },${value}%,50%)`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                        <div className="transactionContainer">
                            <div className="genderChart">
                                <h2>Gender Ratio</h2>
                                <DoughnutChart
                                    data={[
                                        stats?.genderRatio.female,
                                        stats?.genderRatio.male,
                                    ]}
                                    labels={["Female", "Male"]}
                                    bgColor={[
                                        "hsl(340,80%,56%)",
                                        "rgba(53,162,235,0.8)",
                                    ]}
                                    cutout={90}
                                />

                                <p>
                                    <BiMaleFemale />
                                </p>
                            </div>
                            <DashboardTable
                                transactions={stats?.latestTopTransactions}
                            />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

const Widgetitem = ({ heading, value, percent, color, amount }) => (
    <article className="widget">
        <div className="widgetInfo">
            <p>{heading}</p>
            <h4>{amount ? `$${value}` : value}</h4>
            {percent > 0 ? (
                <span className="green">
                    <HiTrendingUp />+{percent === null ? 0 : percent}%
                </span>
            ) : (
                <span className="red">
                    <HiTrendingDown />
                    {percent === null ? 0 : percent}%
                </span>
            )}
        </div>
        <div
            className="wedgetCircle"
            style={{
                background: `conic-gradient(${color} ${
                    (Math.abs(percent) / 100) * 360
                }deg,rgb(255,255,255)0)`,
            }}>
            <span style={{ color: `${color}` }}>
                {percent > 0 && `${percent > 10000 ? 9999 : percent}%`}
                {percent < 0 && `${percent < -10000 ? -9999 : percent}%`}
                {percent === null && `${0}%`}
            </span>
        </div>
    </article>
);

const CategoryItem = ({ heading, color, value }) => (
    <dir className={"categoryItem"}>
        <h5>{heading}</h5>
        <div>
            <div style={{ backgroundColor: color, width: `${value}%` }}></div>
        </div>
        <span>{value}%</span>
    </dir>
);

export default Dashboard;
