    import axios from "axios";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

    ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

    const UserChart = () => {
    const [labels, setLabels] = useState([]);
    const [dataValues, setDataValues] = useState([]);

    useEffect(() => {
        getBugStatus();
    }, []);

    const getBugStatus = async () => {
        try {
        const res = await axios.get("/user/role");

        const apiData = res.data.data;

        // Extract from your response format
        const statusLabels = apiData.map(item => item._id);
        const statusCounts = apiData.map(item => item.total);

        setLabels(statusLabels);
        setDataValues(statusCounts);

        } catch (err) {
        console.log(err);
        }
    };

    const data = {
        labels: labels,
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
        <h2>User  Role Distribution</h2>
        <Doughnut data={data} options={options} />
        </div>
    );
    };

    export default UserChart;