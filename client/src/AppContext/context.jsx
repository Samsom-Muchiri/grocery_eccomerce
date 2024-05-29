import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { base_url } from "../base_url";

const CONT = createContext(null);
function Context({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userIsLoged, setUserIsLoged] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [path, setPath] = useState([
    { title: "Dashboard", path: "/admin/dashboard" },
  ]);
  const [csrfToken, setCsrfToken] = useState(null);
  const functions = {
    csrfToken,
    setCsrfToken,
    path,
    setPath,
    formatCurrencyKE,
    cartOpen,
    setCartOpen,
    cartData,
    setCartData,
    orderDetails,
    setOrderDetails,
    cartTotal,
    menuOpen,
    setMenuOpen,
    userIsLoged,
    setUserIsLoged,
  };

  function formatCurrencyKE(number) {
    if (isNaN(number)) {
      return "Invalid Input";
    }
    const amount = parseFloat(number);
    const formatter = new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    });

    return formatter.format(amount);
  }

  useEffect(() => {
    let total = 0;
    cartData.forEach((item) => (total = total + item.quantity * item.price));
    setCartTotal(total);
  }, [cartData]);

  return <CONT.Provider value={functions}>{children}</CONT.Provider>;
}
export { Context, CONT };
