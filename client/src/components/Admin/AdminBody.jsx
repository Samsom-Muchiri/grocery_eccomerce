import React from "react";
import AdminSideNav from "./AdminSideNav";
import AdminSection from "./AdminSection";
import { Outlet } from "react-router";

function AdminBody() {
  return (
    <div style={{ display: "flex" }}>
      <AdminSideNav />
      <AdminSection Pages={Outlet} />
    </div>
  );
}

export default AdminBody;
