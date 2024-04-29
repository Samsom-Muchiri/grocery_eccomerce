import React from "react";
import "../../styles/account.css";
import { Outlet } from "react-router";
import { NavLink } from "react-router-dom";

function Account() {
  return (
    <div className="account-cnt">
      <ul className="account-side-nav">
        <NavLink to="my_account">
          <li>
            <span className="material-symbols-outlined">account_circle</span> My
            account
          </li>
        </NavLink>
        <NavLink to="time_table">
          <li>
            <span className="material-symbols-outlined">calendar_month</span>{" "}
            Time table
          </li>
        </NavLink>
        <NavLink to="orders">
          <li>
            <span className="material-symbols-outlined">orders</span> Orders
          </li>
        </NavLink>
        <NavLink to="vouchers">
          <li>
            <span className="material-symbols-outlined">local_activity</span>{" "}
            Vouchers
          </li>
        </NavLink>
        <NavLink to="saved_items">
          <li>
            <span className="material-symbols-outlined">favorite</span> Saved
            Items
          </li>
        </NavLink>
      </ul>
      <div className="account-sec-cnt">
        <Outlet />
      </div>
    </div>
  );
}

export default Account;
