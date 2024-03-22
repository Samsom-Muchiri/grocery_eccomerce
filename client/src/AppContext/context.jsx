import { createContext, useEffect, useState } from "react";

const CONT = createContext(null);
function Context({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const functions = {
    formatCurrencyKE,
    cartOpen,
    setCartOpen,
    cartData,
    setCartData,
    cartTotal,
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
