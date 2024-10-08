import React, { useContext, useRef, useState } from "react";
import "../../styles/checkoutpage.css";
import { CONT } from "../../AppContext/context";
import { useNavigate } from "react-router";

function CheckoutPage() {
  const vl = useContext(CONT);
  const navTo = useNavigate(null);
  const [tip, setTip] = useState({ type: "none", value: "0" });
  const payButtonRef = useRef(null);
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
          vl.setOrderDetails({ ...data, total: tip.value + vl.cartTotal });
          navTo("/chekout/payment");
        }}
      >
        <h2>Contact</h2>
        <small>Enter contact that will use to contact you</small>

        <div className="ci-field">
          <input required type="text" name="contact" />

          <span class="bar"></span>
          <label>Email or phone number</label>
        </div>

        <h2>Delivery</h2>
        <div className="delivery-fields">
          <small>Country</small>
          <select name="country" required>
            <option value="">Choose</option>
            <option value="kenya">Kenya</option>
            <option value="tanzania">Tanzania</option>
            <option value="uganda">Uganda</option>
            <option value="ethiopia">Ethiopia</option>
          </select>
          <div className="df-row">
            <div className="ci-field">
              <input required name="first_name" type="text" />

              <span class="bar"></span>
              <label>First name</label>
            </div>
            <div className="ci-field">
              <input required name="second_name" type="text" />

              <span class="bar"></span>
              <label>Second name</label>
            </div>
          </div>
          <div className="ci-field">
            <input required name="address" type="text" />

            <span class="bar"></span>
            <label>Address</label>
          </div>
          <div className="df-row">
            <div className="ci-field">
              <input required name="city" type="text" />

              <span class="bar"></span>
              <label>City</label>
            </div>
            <div className="ci-field">
              <input required name="postcode" type="text" />

              <span class="bar"></span>
              <label>Postal code</label>
            </div>
          </div>
          <div className="ci-field">
            <input required name="phone_2" type="text" />

            <span class="bar"></span>
            <label>Phone number for updates</label>
          </div>
          <div className="save-info">
            <input type="checkbox" /> Save this info for next time
          </div>
        </div>
        <h2>Payment</h2>
        <small>All transactions are secure and encrypted.</small>
        <ul className="payment-methods">
          <li>
            <div>
              {" "}
              <input type="radio" checked readOnly /> <span>Mpesa</span>{" "}
            </div>{" "}
            <img
              src="https://www.safaricom.co.ke/images/Lipanampesa.png"
              alt=""
            />
          </li>
        </ul>
        <h2>Add tip</h2>
        <div className="tip-card">
          <div className="tip-card-head">
            <h3>Show your surpport to us </h3>
          </div>
          <ul className="tip-variation">
            <li
              style={tip.type === "3%" ? { backgroundColor: "#afafaf" } : null}
              onClick={() => setTip({ value: vl.cartTotal * 0.03, type: "3%" })}
            >
              <span>3%</span>
              <span>{vl.formatCurrencyKE(vl.cartTotal * 0.03)}</span>
            </li>
            <li
              style={tip.type === "5%" ? { backgroundColor: "#afafaf" } : null}
              onClick={() => setTip({ value: vl.cartTotal * 0.05, type: "5%" })}
            >
              <span>5%</span>
              <span>{vl.formatCurrencyKE(vl.cartTotal * 0.05)}</span>
            </li>
            <li
              style={tip.type === "15%" ? { backgroundColor: "#afafaf" } : null}
              onClick={() =>
                setTip({ value: vl.cartTotal * 0.15, type: "15%" })
              }
            >
              <span>15%</span>
              <span>{vl.formatCurrencyKE(vl.cartTotal * 0.15)}</span>
            </li>
            <li
              style={
                tip.type === "none" ? { backgroundColor: "#afafaf" } : null
              }
              onClick={() => setTip({ value: 0, type: "none" })}
            >
              <span>None</span>
            </li>
          </ul>
          <div className="custom-tip">
            <span>Ksh</span>
            <input
              type="number"
              placeholder="Place you fair price"
              value={tip.type === "custom" ? tip.value : ""}
              onClick={() => setTip({ type: "custom", value: 0 })}
              onInput={(e) =>
                setTip({ type: "custom", value: Math.max(e.target.value, 0) })
              }
            />
          </div>
          <small>Thank you, we appriciate.</small>
        </div>
        <button className="pay-now pbtn2" ref={payButtonRef}>
          Pay now
        </button>
      </form>
      <div className="c-cart-info">
        <h2>Order summery</h2>
        <div className="ci-cart-item">
          {vl.cartData.map((item, i) => {
            const { name, image_url, price, quantity, id } = item;
            return (
              <div className="cart-item" key={name + price + i}>
                <div className="ci-image_url">
                  <img src={image_url} alt="" />
                </div>
                <div className="ci-inf">
                  <span>{name}</span>
                  <span>{vl.formatCurrencyKE(price)}</span>
                  <ul>
                    <li
                      onClick={() => {
                        const targetIndex = vl.cartData.findIndex(
                          (item) => item.id === id && item.name === name
                        );
                        if (targetIndex !== -1) {
                          const cartData = [...vl.cartData];
                          cartData[targetIndex] = {
                            ...cartData[targetIndex],
                            quantity: Math.max(
                              cartData[targetIndex].quantity - 1,
                              1
                            ),
                          };
                          vl.setCartData(cartData);
                        }
                      }}
                    >
                      -
                    </li>
                    <li>{quantity}</li>
                    <li
                      onClick={() => {
                        const targetIndex = vl.cartData.findIndex(
                          (item) => item.id === id && item.name === name
                        );
                        if (targetIndex !== -1) {
                          const cartData = [...vl.cartData];
                          cartData[targetIndex] = {
                            ...cartData[targetIndex],
                            quantity: cartData[targetIndex].quantity + 1,
                          };
                          vl.setCartData(cartData);
                        }
                      }}
                    >
                      +
                    </li>
                  </ul>
                </div>
                <span
                  className="material-symbols-outlined ci-delete"
                  onClick={() =>
                    vl.setCartData((prev) =>
                      prev.filter(
                        (item) => item.name !== name && item.id !== id
                      )
                    )
                  }
                >
                  delete
                </span>
              </div>
            );
          })}
        </div>
        <ul className="c-cart-summery">
          <li>
            <span>Subtotal - {vl.cartData.length} item</span>
            <span>{vl.formatCurrencyKE(vl.cartTotal)}</span>
          </li>
          <li>
            <span>Shipping</span>
            <span>xxx</span>
          </li>
          <li>
            <span>Tip</span>
            <span>{vl.formatCurrencyKE(tip.value)}</span>
          </li>
          <li style={{ fontWeight: "600" }}>
            <span>Total</span>
            <span>{vl.formatCurrencyKE(tip.value + vl.cartTotal)}</span>
          </li>
        </ul>
        <label htmlFor="pay-now">
          <button
            className="pay-now pbtn1"
            onClick={() => {
              if (payButtonRef.current) {
                payButtonRef.current.click();
              }
            }}
          >
            Pay now
          </button>
        </label>
      </div>
    </div>
  );
}

export default CheckoutPage;
