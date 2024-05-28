import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router";
import { CONT } from "../AppContext/context";

function StateChecker() {
  const vl = useContext(CONT);

  useEffect(() => {
    const storedCartInfo = localStorage.getItem("cart_data");
    if (storedCartInfo) {
      vl.setCartData(JSON.parse(storedCartInfo));
    }
  }, []);

  return <Outlet />;
}

export default StateChecker;
