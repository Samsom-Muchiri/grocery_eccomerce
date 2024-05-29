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
import { productData } from "../../fakeData";
import { useMutation, useQuery } from "react-query";
import { base_url } from "../../base_url";
import axios from "axios";
import Loader from "../Reusables/Loader";
import AddButton from "../Reusables/AddButton";

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

  const products = useQuery(
    "products",
    async () => {
      const response = await axios.get(`${base_url}/products/`, {
        headers: {
          Authorization: `Bearer ${vl.token}`,
        },
      });
      return response.data;
    },
    {
      refetchInterval: 300000, // Refetch data every 10 seconds (in milliseconds)
      refetchIntervalInBackground: true, // Allow refetching even when the component is not visible
    }
  );
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

  const productSections = [
    {
      title: "Top pics for you",
      data: products.data,
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
  const ProductSection = ({ products = [], title }) => {
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
                      <AddButton type="small" product={product} />
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
