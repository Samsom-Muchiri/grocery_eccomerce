import React, { useContext, useEffect, useState } from "react";
import "../../../styles/nav.css";
import { Outlet } from "react-router";
import Cart from "../Cart";
import { CONT } from "../../../AppContext/context";
import Search from "../Search";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useMutation } from "react-query";
import axios from "axios";
import Loader from "../../Reusables/Loader";
import { base_url } from "../../../base_url";
import Footer from "./Footer";

function Nav() {
  const vl = useContext(CONT);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

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

  const registerUser = useMutation(
    async (data) => {
      const response = await axios.post(`${base_url}/register/`, data, {
        headers: {
          "X-CSRFToken": vl.csrfToken,
        },
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast("Sign up successful");
        vl.setUserIsLoged(true);
        setSignUpOpen(false);
      },
      onError: (error) => {
        toast(`Failed to add user, ${error.response.data?.message}`);
      },
    }
  );

  const loginUser = useMutation(
    async (data) => {
      const response = await axios.post(`${base_url}/login/`, data, {
        headers: {
          "X-CSRFToken": vl.csrfToken,
        },
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast("Sign up successful");
        vl.setUserIsLoged(true);
        setSignUpOpen(false);
      },
      onError: (error) => {
        toast(`Failed to login, ${error.response.data?.error_message}`);
      },
    }
  );

  const SignUpForm = () => {
    return (
      <div className="log-form-cnt">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            if (formData.get("password1") === formData.get("password2")) {
              registerUser.mutate({
                username: formData.get("username"),
                password1: formData.get("password1"),
                password2: formData.get("password2"),
              });
            } else {
              toast("Password does not match!");
            }
          }}
        >
          <span
            className="material-symbols-outlined close-log-form"
            onClick={() => setSignUpOpen(false)}
          >
            close
          </span>
          <div className="log-form-head">Create your [company] account</div>
          <div className="log-form-imp">
            <span>Username</span>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
            />
          </div>
          <div className="log-form-imp">
            <span>Password</span>
            <input
              type="password"
              name="password1"
              placeholder="******"
              minLength={6}
              required
            />
          </div>
          <div className="log-form-imp">
            <span>Repeat password</span>
            <input
              type="password"
              name="password2"
              placeholder="******"
              minLength={6}
              required
            />
          </div>
          <input type="checkbox" />
          <button
            className="log-submit-btn"
            style={
              registerUser.isLoading
                ? { opacity: "0.5", pointerEvents: "none" }
                : null
            }
          >
            {registerUser.isLoading ? (
              <div
                className="center-loader"
                style={{ position: "absolute", top: "-5px", width: "100%" }}
              >
                <Loader />
              </div>
            ) : (
              "Sign up"
            )}
          </button>
        </form>
      </div>
    );
  };

  const SignInForm = () => {
    return (
      <div className="log-form-cnt">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            loginUser.mutate({
              username: formData.get("username"),
              password1: formData.get("password1"),
            });
          }}
        >
          <span
            className="material-symbols-outlined close-log-form"
            onClick={() => setSignInOpen(false)}
          >
            close
          </span>
          <div className="log-form-head">Sign in to your account</div>
          <div className="log-form-imp">
            <span>Username</span>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
            />
          </div>
          <div className="log-form-imp">
            <span>Password</span>
            <input
              type="password"
              name="password1"
              placeholder="******"
              minLength={6}
              required
            />
          </div>

          <br />
          <button
            className="log-submit-btn"
            style={
              loginUser.isLoading
                ? { opacity: "0.5", pointerEvents: "none" }
                : null
            }
          >
            {loginUser.isLoading ? (
              <div
                className="center-loader"
                style={{ position: "absolute", top: "-5px", width: "100%" }}
              >
                <Loader />
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    );
  };

  return (
    <>
      <ToastContainer autoClose={5000} hideProgressBar theme={"light"} />
      {signUpOpen && <SignUpForm />}
      {signInOpen && <SignInForm />}
      <nav>
        <div className="site-logo">
          <div className="mobile-menu" onClick={() => setMenuOpen(true)}>
            <span className="material-symbols-outlined">menu</span>
          </div>
          <h1>
            <Link to="/">Logo</Link>{" "}
          </h1>
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
              <Link to="/">
                {" "}
                <span>Home</span>
              </Link>
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
          <li onClick={() => setSearchOpen(true)}>
            <span className="material-symbols-outlined">search</span>
          </li>
          <li
            onClick={() => vl.setCartOpen(true)}
            className="cart-icon"
            datacount={vl?.cartData.length}
          >
            <span className="material-symbols-outlined">shopping_cart</span>
          </li>
          {vl?.userIsLoged ? (
            <Link to="/account/my_account">
              <li>
                <span className="material-symbols-outlined">
                  account_circle
                </span>
              </li>
            </Link>
          ) : (
            <li>
              <div className="log-nav-li">
                <span className="material-symbols-outlined">person</span>
                <div className="log-actions">
                  <h3>Welcome</h3>
                  <span onClick={() => setSignInOpen(true)}>
                    Sign in
                  </span> /{" "}
                  <span onClick={() => setSignUpOpen(true)}>Register</span>
                </div>
              </div>
            </li>
          )}
        </ul>
        {searchOpen && <Search closeSearch={setSearchOpen} />}
      </nav>
      <Outlet />
      <Cart />
      <Footer />
    </>
  );
}

export default Nav;
