import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router";
import { CONT } from "../AppContext/context";
import { useQuery } from "react-query";
import axios from "axios";
import { base_url } from "../base_url";

function StateChecker() {
  const vl = useContext(CONT);

  const csrf = useQuery("products", async () => {
    const response = await axios.get(`${base_url}/get-csrf-token/`, {
      headers: {
        Authorization: `Bearer ${vl.token}`,
      },
    });
    return response.data;
  });

  useEffect(() => {
    if (csrf.isSuccess) {
      vl.setCsrfToken(csrf.data?.csrf_token);
    }
  }, [csrf.data]);

  useEffect(() => {
    const storedCartInfo = localStorage.getItem("cart_data");
    if (storedCartInfo) {
      vl.setCartData(JSON.parse(storedCartInfo));
    }
  }, []);

  return <Outlet />;
}

export default StateChecker;
