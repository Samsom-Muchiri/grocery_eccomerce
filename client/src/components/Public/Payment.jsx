import React, { useContext, useRef, useState } from "react";
import "../../styles/checkoutpage.css";
import { CONT } from "../../AppContext/context";
import "../../styles/payment.css";

function Payment() {
  const vl = useContext(CONT);
  const [tip, setTip] = useState({ type: "none", value: "0" });
  const payButtonRef = useRef(null);
  const {
    contact,
    country,
    first_name,
    second_name,
    address,
    city,
    postcode,
    phone_2,
    total,
  } = vl.orderDetails || {};
  return (
    <div className="chakout-cnt">
      <form
        className="checkout-info"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const data = {};
          for (const [key, value] of formData.entries()) {
            data[key] = value;
          }
          console.log(data);
        }}
      >
        <h1>Payment</h1>
        <div className="pay-method-logo">
          <img
            src="https://www.safaricom.co.ke/images/Lipanampesa.png"
            alt=""
          />
        </div>
        <h4></h4>
        <ol>
          <li>Provide your MPESA mobile number below</li>
          <li>
            Click Proceed and a prompt will appear on your phone requesting you
            to confirm transaction by providing your MPESA PIN
          </li>
          <li>
            Once completed, you will receive the confirmation SMS for this
            transaction
          </li>
        </ol>
        <div className="phone-form">
          <h5>Provide your Mpesa phone number</h5>
          <div className="phone-form-input-cnt">
            <div className="pfic-icon">
              <span className="material-symbols-outlined">smartphone</span>
              <span> +254</span>
            </div>
            <input type="text" placeholder="7xx xxx xxx" />
          </div>
          <button>Proceed</button>
        </div>
      </form>
      <div className="c-cart-info">
        <ul className="order-detail">
          <li>
            <h1>Customer details</h1>
            <p>
              {first_name} {second_name}
            </p>
            <p>{contact}</p>
          </li>
          <li>
            <h1>Shipping details</h1>
            <p>
              {address}, {postcode}, {country}
            </p>
          </li>
        </ul>
        <h3>
          Total: <small>{vl.formatCurrencyKE(parseInt(total))}</small>
        </h3>
      </div>
    </div>
  );
}

export default Payment;
