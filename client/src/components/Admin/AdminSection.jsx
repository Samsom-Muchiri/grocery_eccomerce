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
  console.log(vl.menuOpen);
  return (
    <div className="admin-section">
      <div className="admin-section-nav">
        <div className="menu-btn" onClick={() => vl.setMenuOpen(true)}>
          <span className="material-symbols-outlined">menu</span>
          <h1>logo</h1>
        </div>
      </div>
      <Pages />
    </div>
  );
}

export default AdminSection;
