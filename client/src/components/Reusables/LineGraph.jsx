import React, { useContext, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function LineGraph({ period, data = [], units }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  Date.prototype.getWeek = function () {
    const date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    const week1 = new Date(date.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((date - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
      )
    );
  };
  if (data.length < 1) {
    return <h1>Loading...</h1>;
  }
  function filterDatesByPeriod(dates, period) {
    const groupedData = {};

    for (const entry of dates) {
      const date = new Date(entry.date);
      let key;

      if (period === "day") {
        key = date.toDateString();
      } else if (period === "week") {
        const currentWeek = new Date(date);
        currentWeek.setDate(date.getDate() - date.getDay());
        key = `Week ${getISOWeek(new Date(currentWeek))}`;
      } else if (period === "month") {
        key = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
      } else if (period === "year") {
        key = date.getFullYear().toString();
      }

      if (!groupedData[key]) {
        groupedData[key] = { date: key, unit: 0 };
      }

      groupedData[key].unit += entry.unit;
    }

    return Object.values(groupedData);
  }

  function getISOWeek(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }

  const filteredDates = filterDatesByPeriod(data, period);
  const lables = filteredDates.map((d) => d.date);
  const values = filteredDates.map((d) => d.unit);
  console.log(values);

  useEffect(() => {
    setChartData({
      labels: lables,
      datasets: [
        {
          label: units,
          data: values,
          fill: true,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    });
  }, [period, units]);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Line
      data={chartData}
      options={options}
      style={{ minHeight: "50vh" }}
    ></Line>
  );
}

export default LineGraph;
