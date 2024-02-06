/** @format */

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import moment from "moment";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
);

function getMonths() {
    const currentDate = moment();
    currentDate.date();

    const lastSixMonths = [];
    const last12Months = [];

    for (let i = 0; i < 6; i++) {
        const monthsDate = currentDate.clone().subtract(i, "months");
        const monthName = monthsDate.format("MMMM");
        lastSixMonths.unshift(monthName);
    }

    for (let i = 0; i < 12; i++) {
        const monthsDate = currentDate.clone().subtract(i, "months");
        const monthName = monthsDate.format("MMMM");
        last12Months.unshift(monthName);
    }

    return { lastSixMonths, last12Months };
}

export const { lastSixMonths, last12Months } = getMonths();

export function BarChart({
    horizontal,
    data_1,
    data_2,
    title_1,
    title_2,
    bgColor_1,
    bgColor_2,
    labels = lastSixMonths,
    legendDisplay = false,
}) {
    const options = {
        responsive: true,
        indexAxis: horizontal ? "y" : "x",
        plugins: {
            legend: {
                position: "bottom",
                display: legendDisplay,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    const data = {
        labels,
        datasets: [
            {
                label: title_1,
                data: data_1,
                backgroundColor: bgColor_1,
                barThikness: "flex",
                barPercentage: 1,
                categoryPercentage: 0.4,
            },
            {
                label: title_2,
                data: data_2,
                backgroundColor: bgColor_2,
                barThikness: "flex",
                barPercentage: 1,
                categoryPercentage: 0.4,
            },
        ],
    };
    return (
        <Bar
            width={horizontal ? "200%" : ""}
            options={options}
            data={data}
        />
    );
}

export const DoughnutChart = ({
    data,
    bgColor,
    labels,
    cutout,
    legends = true,
    offset,
}) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: legends,
                position: "bottom",
                labels: {
                    padding: 40,
                },
            },
        },
        cutout,
    };

    const dataset = {
        labels,
        datasets: [
            {
                data: data,
                backgroundColor: bgColor,
                borderWidth: 0,
                offset,
            },
        ],
    };
    return (
        <Doughnut
            options={options}
            data={dataset}
        />
    );
};

export const PieChart = ({
    data,
    bgColor,
    labels,
    offset,
    legends = false,
}) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: legends,
                position: "bottom",
                labels: {
                    padding: 40,
                },
            },
        },
    };

    const dataset = {
        labels,
        datasets: [
            {
                data: data,
                backgroundColor: bgColor,
                borderWidth: 1,
                offset,
            },
        ],
    };
    return (
        <Pie
            options={options}
            data={dataset}
        />
    );
};

export function LineChart({
    data,
    bgColor,
    borderColor,
    label,
    labels = last12Months,
}) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    const datasets = {
        labels,
        datasets: [
            {
                fill: true,
                label,
                data,
                backgroundColor: bgColor,
                borderColor,
            },
        ],
    };
    return (
        <Line
            options={options}
            data={datasets}
        />
    );
}
