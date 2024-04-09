import React, { useContext, useState } from "react";
import "../../styles/admin/overview.css";
import LineGraph from "../Reusables/LineGraph";
import { CONT } from "../../AppContext/context";
import DoughnutChart from "../Reusables/DoughnutChart";

function Overview() {
  const [orgValueHistory, setOrgValueHistory] = useState("month");
  const [view, setView] = useState("total_income"); // ['total_income', 'members', 'committiees', 'projects']
  const unitLabel = {
    total_income: "Total income",
    members: "Number of members",
    committiees: "Number of committees",
    projects: "Number of projects",
  };
  const vl = useContext(CONT);
  const dataCards = [
    {
      title: "Listing",
      count: "300",
      icon: "list_alt",
    },
    {
      title: "Orders",
      count: "30",
      icon: "orders",
    },
    {
      title: "Closed orders",
      count: "30",
      icon: "handshake",
    },
    {
      title: "Promotions",
      count: "10",
      icon: "trending_up",
    },
  ];
  function generateDataObjects(numObjects = 30) {
    const startDate = new Date(); // Start from today's date
    const dataObjects = [];
    const amount = Math.floor(Math.random() * 1000) + 1;
    for (let i = 0; i < numObjects; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000); // Advance date by 1 day for each object
      dataObjects.push({
        date: date.toUTCString(), // Format as UTC string
        unit: amount,
      });
    }

    return dataObjects;
  }
  return (
    <div>
      <section className="overview-head">
        <h1>Overview</h1>
      </section>
      <section className="top-data">
        {dataCards.map((card) => (
          <div className="o-data-c">
            <div className="obc-head">
              <h2>{card.title}</h2>
            </div>
            <div className="obc-body">
              <div className="obc-count">{card.count}</div>
              <span className="material-symbols-outlined">{card.icon}</span>
            </div>
            <div className="obc-view">
              <span>View</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </div>
        ))}
      </section>
      <section className="ov-inventory">
        <div className="sale-activity-summery">
          <div className="sas-head">
            <h2>Sale activity summery</h2>
          </div>
          <div className="sas-activity">
            <ul className="sas-left">
              <li>To be picked: 20</li>
              <li>To be deliverd: 50</li>
              <li>To be shipped: 30</li>
            </ul>
            <div className="sas-chart">
              <DoughnutChart values={[20, 50, 30]} />
            </div>
          </div>
        </div>
        <div className="inventory-summery">
          <div className="iv-head">
            <h2>Inventory summery</h2>
          </div>
          <div className="iv-summery">
            <span>Items in hand</span> 270
          </div>
          <div className="iv-summery">
            <span>
              {" "}
              Out of stock{" "}
              <div className="view-stock-out">
                view{" "}
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </span>{" "}
            270
          </div>
        </div>
      </section>
      <section className="ens-org-trands">
        <div className="ens-trand-graph-cnt">
          <div className="ens-trand-graph-cnt-head">
            <h2>Sales summery</h2>
            <div className="ens-d-tgd-cnt">
              <div className="ens-d-tgd">
                Time
                <select
                  value={orgValueHistory}
                  onChange={(e) => setOrgValueHistory(e.target.value)}
                >
                  <option value="month">Months</option>
                  <option value="day">Days</option>
                  <option value="week">Weeks</option>
                  <option value="year">Years</option>
                </select>
              </div>
              <div className="ens-d-tgd">
                <span>Category</span>
                <select value={view} onChange={(e) => setView(e.target.value)}>
                  <option value="total_income">Total income</option>
                  <option value="members">Members</option>
                </select>
              </div>
            </div>
          </div>
          <div className="ens-trand-graph">
            <LineGraph
              period={orgValueHistory}
              data={generateDataObjects(100)}
              units={unitLabel[view]}
            />
          </div>
        </div>
        <div className="top-products">
          <h2>Top products</h2>
          <ul>
            <li>
              <span>KAWEBO</span>{" "}
              <div className="eto-revenue">
                <span className="material-symbols-outlined">payments</span>
                {vl.formatCurrencyKE(75000)}
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Overview;
