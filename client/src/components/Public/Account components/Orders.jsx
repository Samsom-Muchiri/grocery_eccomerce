import React from "react";
import { useNavigate } from "react-router";

function Orders() {
  const orders = [];
  const navTo = useNavigate(null);
  return (
    <div>
      <section className="ac-sec-head">
        <div className="ac-sec-back" onClick={() => navTo("/account")}>
          <span className="material-symbols-outlined">keyboard_backspace</span>
          <h1>Oders</h1>
        </div>
        <h1 className="ac-sec-title">Oders</h1>
      </section>
      {orders.length > 1 ? (
        <div></div>
      ) : (
        <div className="empty-account-sec">
          <div className="center-empty-desc">
            <span className="material-symbols-outlined">local_shipping</span>
            <h1>You dont have any orders</h1>
            <p>This section shows all orders that you made.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
