import React, { useContext } from "react";
import { CONT } from "../../AppContext/context";
import Loader from "./Loader";
import { useMutation } from "react-query";
import { base_url } from "../../base_url";
import axios from "axios";

function AddButton({ type = "small", product }) {
  const { name, id, price, discount, image } = product;
  const vl = useContext(CONT);
  const postCartData = useMutation(
    async (data) => {
      const response = await axios.post(base_url + "/add-to-cart/", data, {
        headers: "",
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        vl.setCartData((prev) => [...prev, { ...data, quantity: 1 }]);
      },
      onError: (error) => {
        console.error(`Error: ${error.data}`);
      },
    }
  );

  function addToCart() {
    if (vl.userIsLoged) {
      postCartData.mutate(product);
    } else {
      vl.setCartData((prev) => [...prev, { ...product, quantity: 1 }]);
      localStorage.setItem("cart_data", JSON.stringify(vl.cartData));
    }
  }

  return (
    <>
      {postCartData.isLoading ? (
        <div className="btn-loader">
          <Loader />
        </div>
      ) : vl.cartData.some((item) => item.id === id && item.name === name) ? (
        <ul className="cart-t-q">
          <li
            onClick={() => {
              const targetIndex = vl.cartData.findIndex(
                (item) => item.id === id && item.name === name
              );
              if (targetIndex !== -1) {
                const cartData = [...vl.cartData];
                cartData[targetIndex] = {
                  ...cartData[targetIndex],
                  quantity: Math.max(cartData[targetIndex].quantity - 1, 1), // Ensure quantity is at least 1
                };
                vl.setCartData(cartData);
                if (!vl.userIsLoged) {
                  localStorage.setItem(
                    "cart_data",
                    JSON.stringify(vl.cartData)
                  );
                }
              }
            }}
          >
            -
          </li>
          <li>
            {
              vl.cartData.find((item) => item.id === id && item.name === name)
                ?.quantity
            }
          </li>
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
                    JSON.stringify(vl.cartData)
                  );
                }
              }
            }}
          >
            +
          </li>
        </ul>
      ) : (
        <button className="cart-add-btn" onClick={() => addToCart()}>
          ADD <span className="material-symbols-outlined">shopping_cart</span>
        </button>
      )}
    </>
  );
}

export default AddButton;
