import React, { useContext, useEffect, useState } from "react";
import "../../../styles/nav.css";
import { Outlet } from "react-router";
import Cart from "../Cart";
import { CONT } from "../../../AppContext/context";

function Nav() {
  const vl = useContext(CONT);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    function handleClick(e) {
      if (e.target.closest(".nav-links-cnt")) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <nav>
        <div className="site-logo">
          <div className="mobile-menu" onClick={() => setMenuOpen(true)}>
            <span className="material-symbols-outlined">menu</span>
          </div>
          <h1>Logo</h1>
        </div>
        <div
          className="nav-links-cnt"
          style={
            menuOpen ? { transform: "translateX(0%)", opacity: "1" } : null
          }
        >
          <ul className="nav-links">
            <li className="nl-logo">
              <h1>Logo</h1>
            </li>
            <li>
              <span>Home</span>
            </li>
            <li>
              <span>Shop</span>
            </li>
            <li>
              <span>Pages</span>
              <span className="material-symbols-outlined">
                keyboard_arrow_down
              </span>
            </li>
            <li>
              <span>Blog</span>
              <span className="material-symbols-outlined">
                keyboard_arrow_down
              </span>
            </li>
            <li>
              <span>Contact</span>
              <span className="material-symbols-outlined">
                keyboard_arrow_down
              </span>
            </li>
          </ul>
        </div>
        <ul className="nav-actions">
          <li>
            <span className="material-symbols-outlined">search</span>
          </li>
          <li
            onClick={() => vl.setCartOpen(true)}
            className="cart-icon"
            datacount={vl.cartData.length}
          >
            <span className="material-symbols-outlined">shopping_cart</span>
          </li>
          <li>
            <span className="material-symbols-outlined">account_circle</span>
          </li>
        </ul>
      </nav>
      <Outlet />
      <Cart />
    </>
  );
}

export default Nav;
