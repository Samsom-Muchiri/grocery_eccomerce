import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function DoughnutChart({ values }) {
  const ChartRef = useRef(null);
  const ChartInstance = useRef(null);
  useEffect(() => {
    if (ChartInstance.current) {
      ChartInstance.current.destroy();
    }
    const myChartRef = ChartRef.current.getContext("2d");
    ChartInstance.current = new Chart(myChartRef, {
      type: "doughnut",
      data: {
        lables: ["Donations", "Investments", "Contributions"],
        datasets: [
          {
            label: "",
            data: values,
            backgroundColor: ["#008db9", "#b2cbd3", "#00aeef"],
            hoverOffset: 4,
          },
        ],
      },
    });
    return () => {
      if (ChartInstance.current) {
        ChartInstance.current.destroy();
      }
    };
  }, [values]);
  return <canvas ref={ChartRef} />;
}

export default DoughnutChart;
