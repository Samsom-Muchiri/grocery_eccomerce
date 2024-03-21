import React, {
  Fragment,
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "../../styles/landingpage.css";
import groceryImg from "../../assets/groceryimg.png";
import veg from "../../assets/ct-veg.png";
import meat from "../../assets/ct-meat.png";
import fruit from "../../assets/ct-fruits.png";
import fish from "../../assets/ct-fish.png";
import snack from "../../assets/ct-snack.png";
import drinks from "../../assets/ct-drink.png";
import { CONT } from "../../AppContext/context";
import { Link } from "react-router-dom";

function LandingPage() {
  const [fqa, setFqa] = useState([]);
  const sliderRef = useRef(null);
  const vl = useContext(CONT);

  const lrm =
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi consectetur laborum error ut eius sunt! Dicta at reprehenderit est, deleniti ex aspernatur impedit enim dignissimos beatae ad, dolor cupiditate molestias!  ";
  useEffect(() => {
    const fqaObj = Array(6).fill({
      open: false,
      height: "3rem",
      title: "Fqa title",
      body: lrm,
    });
    setFqa(fqaObj);
  }, []);
  const topCategories = [
    {
      image: veg,
      name: "Vegetables",
    },
    {
      image: meat,
      name: "Row meat",
    },
    {
      image: fruit,
      name: "Fruits",
    },
    {
      image: fish,
      name: "Fish",
    },
    {
      image: drinks,
      name: "Drinks",
    },
    {
      image: snack,
      name: "Snaks",
    },
  ];

  const productData = [
    {
      id: "1",
      name: "Melon",
      image:
        "https://boxkick.ie/cdn/shop/products/melon-water.jpg?v=1593885822",
      price: "200",
      discount: "250",
    },
    {
      id: "2",
      name: "Orange",
      image:
        "https://thecoconutmama.com/wp-content/uploads/2023/06/oranges-scaled.webp",
      price: "50",
      discount: "60",
    },
    {
      id: "3",
      name: "Carrot",
      image: "https://farmiken.com/wp-content/uploads/2020/09/Carrot1.jpg",
      price: "50",
      discount: "60",
    },
    {
      id: "4",
      name: "Cabbage",
      image:
        "data:image/jpeg;base64,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",
      price: "50",
      discount: "60",
    },
    {
      id: "5",
      name: "Fish",
      image:
        "https://www.tastingtable.com/img/gallery/x-different-ways-to-cook-fish/l-intro-1643135113.jpg",
      price: "50",
      discount: "60",
    },
    {
      id: "6",
      name: "Broccoli",
      image:
        "https://cdn.britannica.com/25/78225-050-1781F6B7/broccoli-florets.jpg",
      price: "50",
      discount: "60",
    },
    {
      id: "7",
      name: "Tomato",
      image:
        "https://harvestmarkets.com.au/cdn/shop/products/GourmetTomato_600x600.jpg?v=1585204312",
      price: "50",
      discount: "60",
    },
    {
      id: "8",
      name: "Onions",
      image:
        "data:image/jpeg;base64,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",
      price: "50",
      discount: "60",
    },
    {
      id: "9",
      name: "Galic",
      image:
        "data:image/jpeg;base64,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",
      price: "50",
      discount: "60",
    },
    {
      id: "9",
      name: "Qucumber",
      image:
        "https://cdn.dotpe.in/longtail/item_thumbnails/8077861/d7IpFxQb.webp",
      price: "50",
      discount: "60",
    },
    {
      id: "10",
      name: "Galic",
      image:
        "https://t4.ftcdn.net/jpg/02/01/36/21/360_F_201362181_ZmACmd822Lk2SE4En0KFJB4dHWlIaAAz.jpg",
      price: "50",
      discount: "60",
    },
  ];

  console.log(vl.cartData.some((item) => item.id === "1"));
  console.log(vl.cartData);
  const productSections = [
    {
      title: "Top pics for you",
      data: productData,
    },
    {
      title: "New arivals",
      data: productData,
    },
    {
      title: "100% organic",
      data: productData,
    },
  ];
  const wwdRefs = Array(6)
    .fill("")
    .map(() => createRef());

  const openWwd = (i) => {
    const wwdRef = wwdRefs[i];
    if (wwdRef.current) {
      setFqa((prev) => {
        const target = Array(6).fill({
          open: false,
          height: "3rem",
          title: "Fqa title",
          body: lrm,
        });
        target[i] = {
          open: true,
          height: wwdRef.current.scrollHeight + "px",
          title: "Fqa title",
          body: lrm,
        };
        return target;
      });
    }
  };

  const closeWwd = (e, i) => {
    e.stopPropagation();
    if (fqa[i].open === false) return openWwd(i);
    const target = [...fqa];
    target[i] = { open: !fqa[i].open, height: "3rem" };
    setFqa(target);
  };
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
                const { name, id, price, discount, image } = product;

                return (
                  <Fragment key={product.name + i}>
                    <Link to="#">
                      <div className="product-card">
                        <img src={image} alt="" />
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
                                    quantity:
                                      cartData[targetIndex].quantity + 1,
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
                            onClick={() =>
                              vl.setCartData((prev) => [
                                ...prev,
                                { ...product, quantity: 1 },
                              ])
                            }
                          >
                            ADD{" "}
                            <span className="material-symbols-outlined">
                              shopping_cart
                            </span>
                          </button>
                        )}
                      </div>
                    </Link>
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

  return (
    <>
      <section className="lp-header">
        <div className="lp-h-cnt">
          <div className="lp-h-cnt-txt">
            <h6>
              Sale up to <span>20% OFF</span>
            </h6>
            <h1>Buy Fresh Groceries & Organic food.</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
              totam consectetur, iusto fuga inventore officia voluptate veniam,
              tempore excepturi.
            </p>
            <button className="sc-btn">
              Shop now{" "}
              <span className="material-symbols-outlined">arrow_right_alt</span>
            </button>
          </div>
          <div className="lp-h-cnt-img">
            <img src={groceryImg} alt="" />
          </div>
          <ul className="lp-h-dl">
            <li>
              <span className="material-symbols-outlined">local_shipping</span>{" "}
              <div>
                <h2>Free Shipping</h2>
                <p>Free shipping on all orders</p>
              </div>
            </li>
            <li>
              <span className="material-symbols-outlined">headset_mic</span>{" "}
              <div>
                <h2>Support 25/7</h2>
                <p>Support 24 hours a day</p>
              </div>
            </li>
            <li>
              <span className="material-symbols-outlined">local_mall</span>{" "}
              <div>
                <h2>100% Secure Payment</h2>
                <p>Back garantee under 5 days</p>
              </div>
            </li>
            <li>
              <span className="material-symbols-outlined">replay_5</span>{" "}
              <div>
                <h2>Money return</h2>
                <p>Onery order under over Ksh 2000</p>
              </div>
            </li>
          </ul>
          <svg viewBox="0 0 1500 200" style={{ width: "100%" }}>
            <path
              fill="#fff"
              d="m 0,240 h 1500.4828 v -71.92164 c 0,0 -286.2763,-81.79324 -743.19024,-81.79324 C 300.37862,86.28512 0,168.07836 0,168.07836 Z"
            ></path>
          </svg>
        </div>
      </section>
      <section className="top-categories">
        <h1>Top categories</h1>
        <div className="sld-w">
          <div className="ct-card-cnt">
            {topCategories.map((ct, i) => (
              <div className="ct-card" key={ct.name + 1}>
                <img src={ct.image} alt="" />
                <span>{ct.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {productSections.map((ps, i) => (
        <ProductSection
          title={ps.title}
          products={ps.data}
          key={ps.title + i}
        />
      ))}
      <section className="about-company">
        <div className="about-c-cnt">
          <h1>About company</h1>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro
            veritatis dolores ut numquam architecto at ducimus voluptas quasi
            aut magni? Obcaecati voluptatum, in vel corporis facere provident
            perspiciatis rerum ea?
          </p>
        </div>
      </section>
      <section className="fqa">
        <h1>FQA</h1>
        <ul>
          {fqa?.map((f, i) => (
            <li
              onClick={() => openWwd(i)}
              ref={wwdRefs[i]}
              style={{ maxHeight: fqa[i].height }}
            >
              <div className="fqa-head">
                <h3>{f.title}</h3>
                <div
                  className="wwd-plus"
                  style={fqa[i].open ? { transform: "rotate(45deg)" } : {}}
                  onClick={(e) => closeWwd(e, 1)}
                >
                  <span className="material-symbols-outlined">add</span>
                </div>
              </div>

              <p>{f.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default LandingPage;
