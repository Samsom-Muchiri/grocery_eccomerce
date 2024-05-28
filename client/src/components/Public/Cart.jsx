import React, { useContext } from "react";
import "../../styles/cart.css";
import { CONT } from "../../AppContext/context";
import { useNavigate } from "react-router";

function Cart() {
  const vl = useContext(CONT);
  const navTo = useNavigate(null);
  const cartItems = Array(7).fill({
    id: "9",
    name: "Galic",
    image:
      "data:image/jpeg;base64,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",
    price: "50",
    discount: "60",
    quantity: 1,
  });
  return (
    <div
      className="cart-nt"
      style={
        vl.cartOpen
          ? { opacity: "1", transform: "translateX(0)", pointerEvents: "all" }
          : null
      }
    >
      <div className="close-cart-btn" onClick={() => vl.setCartOpen(false)}>
        <span className="material-symbols-outlined">close</span>
      </div>
      <div className="cart">
        <div className="cart-header">
          <h1>Your cart</h1>
        </div>
        <div className="cart-welcome-msg">
          <h2>Welcome guest! 👋</h2>
          <p>
            Register with Greenspoon to save your cart, save products for later,
            view order history & more!
          </p>
          <button>Register</button>
          <small>Already a customer? Sign in</small>
        </div>
        {vl.cartData.map((item, i) => {
          const { name, image, price, quantity, id } = item;
          return (
            <div className="cart-item" key={name + price + i}>
              <div className="ci-image">
                <img src={image} alt="" />
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
                        if (!vl.userIsLoged) {
                          localStorage.setItem(
                            "cart_data",
                            JSON.stringify(cartData)
                          );
                        }
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
                        if (!vl.userIsLoged) {
                          localStorage.setItem(
                            "cart_data",
                            JSON.stringify(cartData)
                          );
                        }
                      }
                    }}
                  >
                    +
                  </li>
                </ul>
              </div>
              <span
                className="material-symbols-outlined ci-delete"
                onClick={() => {
                  vl.setCartData((prev) =>
                    prev.filter((item) => item.name !== name && item.id !== id)
                  );
                  if (!vl.userIsLoged) {
                    localStorage.setItem(
                      "cart_data",
                      JSON.stringify(vl.cartData)
                    );
                  }
                }}
              >
                delete
              </span>
            </div>
          );
        })}
        {vl.cartData.length > 0 ? (
          <div className="cart-check-out">
            <div className="cart-summery">
              <div>
                <span>Subtotal - {vl.cartData.length} item</span>
                <small>Shipping calculated at checkout.</small>
              </div>
              <div>{vl.formatCurrencyKE(vl.cartTotal)}</div>
            </div>
            <button
              className="checkout-btn"
              onClick={() => {
                vl.setCartOpen(false);
                navTo("chekout");
              }}
            >
              <span className="cb-txt">Checkout Now </span>{" "}
              <span className="material-symbols-outlined">trending_flat</span>
            </button>
          </div>
        ) : (
          <div className="cart-empty-msg">
            <span className="material-symbols-outlined">
              production_quantity_limits
            </span>
            <h1>Your Cart is empty!</h1>
            <p>It looks like you haven't added any items to your cart yet.</p>
            <button>Browse Products</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
