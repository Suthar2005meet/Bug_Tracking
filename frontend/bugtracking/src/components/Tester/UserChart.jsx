import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

    ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

    const UserChart = () => {
    const dataValues = [10, 45, 25, 20];

    const data = {
        labels: ["Admin", "Customer", "Guest", "Moderator"],
        datasets: [
        {
            data: dataValues,
            backgroundColor: ["#1E3A8A", "#14B8A6", "#F59E0B", "#3B82F6"],
        },
        ],
    };

    const options = {
        plugins: {
        datalabels: {
            color: "#fff",
            formatter: (value, context) => {
            const total = context.chart._metasets[0].total;
            const percentage = ((value / total) * 100).toFixed(1);
            return percentage + "%";
            },
        },
        legend: {
            position: "bottom",
        },
        },
    };

    return (
        <div style={{ width: "400px", margin: "50px auto" }}>
        <h2>User Distribution</h2>
        <Doughnut data={data} options={options} />
        </div>
    );
    };

    export default UserChart;
