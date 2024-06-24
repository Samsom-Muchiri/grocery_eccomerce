import React, { Fragment, useContext } from "react";
import { productData } from "../../fakeData";
import { useParams } from "react-router";
import "../../styles/productview.css";
import { CONT } from "../../AppContext/context";
import { Link } from "react-router-dom";
import { base_url } from "../../base_url";
import axios from "axios";


function ProductView() {
  const vl = useContext(CONT);
  const { view } = useParams();
  const productId = view.split("_")[1];
  const product = productData.filter((product) => product.id === productId)[0];
  const { id, name, image_url, price, discount, description } = product;

  const addtoCart = useMutation(
    async (data) => {
      const response = await axios.post(`${base_url}/add-to-cart`, data, {
        headers: {
          "X-CSRFToken": vl.csrfToken,
        },
      });
      return response.data;
    },
    {
      onError: (error) => {
        toast(`Failed to add item to cart, ${error.response.data?.message}`);
      },
    }
  );

  const ProductSection = ({ products, title }) => {
    return (
      <section className="product-section">
        <h2>{title}</h2>
        <div className="product-s-row">
          <div className="psr-slide-btn" style={{ left: "0.5rem" }}>
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </div>
          <div className="psr-cnt">
            <div className="psr-cnt-w">
              {products.map((product, i) => {
                const { name, id, price, discount, image_url } = product;

                return (
                  <Fragment key={product.name + i}>
                    <div className="product-card">
                      <Link to={`/product/${product.name}_${product.id}`}>
                        <img src={image_url} alt="" />
                      </Link>
                      <div className="product-detail">
                        <span className="product-name">{name}</span>
                        <ul className="product-prices">
                          <li>
                            <strike>{vl.formatCurrencyKE(discount)}</strike>
                          </li>
                          <li>{vl.formatCurrencyKE(price)}</li>
                        </ul>
                      </div>
                      {vl.cartData.some(
                        (item) => item.id === id && item.name === name
                      ) ? (
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
                                  quantity: Math.max(
                                    cartData[targetIndex].quantity - 1,
                                    1
                                  ), // Ensure quantity is at least 1
                                };
                                vl.setCartData(cartData);
                              }
                            }}
                          >
                            -
                          </li>
                          <li>
                            {
                              vl.cartData.find(
                                (item) => item.id === id && item.name === name
                              )?.quantity
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
                              }
                            }}
                          >
                            +
                          </li>
                        </ul>
                      ) : (
                        <button
                          className="cart-add-btn"
                          onClick={() => {
                            vl.setCartData((prev) => [
                              ...prev,
                              { ...product, quantity: 1 },
                            ])
                            addtoCart.mutate({
                              product_id: product.id,
                              quantity: 1,
                              price: product.price,
                              offer: product.discount
                            })
                          }}
                        >
                          ADD{" "}
                          <span className="material-symbols-outlined">
                            shopping_cart
                          </span>
                        </button>
                      )}
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
          <div className="psr-slide-btn" style={{ right: "0.5rem" }}>
            <span className="material-symbols-outlined">arrow_forward_ios</span>
          </div>
        </div>
      </section>
    );
  };


  const productSections = [
    {
      title: "You may also like",
      data: productData,
    },
  ];

  return (
    <div>
      <section className="p-v-detail">
        <div className="pv-image">
          <img src={image_url} alt="" />
        </div>
        <div className="pv-info">
          <div className="pv-name">{name}</div>
          <div className="pv-price">
            <strike style={{ color: "gray", marginRight: "1rem" }}>
              {vl.formatCurrencyKE(discount)}
            </strike>
            <span>{vl.formatCurrencyKE(price)}</span>
          </div>
          <div className="pv-instock">Availability: In stock</div>
          <button className="pv-addtocart"
            onClick={ addtoCart.mutate({
              product_id: id,
              quantity: 1,
              price: price,
              offer: discount
            })}
          >ADD TO CART
          </button>
          <span>Description:</span>
          <p className="pv-description">{description}</p>
        </div>
      </section>
      <section>
        {productSections.map((ps, i) => (
          <ProductSection
            title={ps.title}
            products={ps.data}
            key={ps.title + i}
          />
        ))}
      </section>
    </div>
  );
}

export default ProductView;
