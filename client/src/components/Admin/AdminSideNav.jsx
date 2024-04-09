import React, { useContext } from "react";
import "../../styles/admin/adminSideNav.css";
import { NavLink } from "react-router-dom";
import { CONT } from "../../AppContext/context";

function AdminSideNav() {
  const vl = useContext(CONT);
  return (
    <div
      className={
        vl.menuOpen ? "admin-sidenav-cnt menu-open" : "admin-sidenav-cnt"
      }
    >
      <aside className="admin-sidenav">
        <div className="admin-logo">Logo</div>
        <ul>
          <NavLink to="/admin">
            <li>
              <span className="material-symbols-outlined">dashboard</span>{" "}
              Overview
            </li>
          </NavLink>
          <li>
            <span className="material-symbols-outlined">person</span> Profile
          </li>
        </ul>
      </aside>
    </div>
  );
}

export default AdminSideNav;
