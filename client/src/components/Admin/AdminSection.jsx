import React, { useContext, useEffect, useState } from "react";
import "../../styles/admin/adminsection.css";
import { CONT } from "../../AppContext/context";

function AdminSection({ Pages = () => {} }) {
  const vl = useContext(CONT);
  useEffect(() => {
    function menuToggole(e) {
      if (
        !e.target.closest(".admin-sidenav") &&
        !e.target.closest(".menu-btn")
      ) {
        vl.setMenuOpen(false);
      }
    }
    window.addEventListener("click", menuToggole);
    return () => {
      window.removeEventListener("click", menuToggole);
    };
  }, []);
  return (
    <div className="admin-section">
      {/* <div className="admin-section-nav">
        <div className="menu-btn" onClick={() => vl.setMenuOpen(true)}>
          <span className="material-symbols-outlined">menu</span>
          <h1>logo</h1>
        </div>
      </div> */}
      <div className="admin-body-nav">
        <div className="amn-sec">
          <span
            className="material-symbols-outlined adm-nav-menu-btn menu-btn"
            onClick={() => vl.setMenuOpen(true)}
          >
            menu
          </span>
          <span className="material-symbols-outlined">home</span>/ Dashboard
        </div>
        <div className="amn-sec">
          Welcome
          <span className="material-symbols-outlined">account_circle</span>
        </div>
      </div>
      <Pages />
    </div>
  );
}

export default AdminSection;
