import React from "react";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import Nav from "./Public/reusables/Nav";
import { createBrowserRouter } from "react-router-dom";
import StateChecker from "./StateChecker";
import LandingPage from "./Public/LandingPage";
import CheckoutPage from "./Public/CheckoutPage";
import ProductView from "./Public/ProductView";

function Main() {
  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<StateChecker />}>
        <Route path="/" element={<Nav />}>
          <Route index element={<LandingPage />} />
          <Route path="/product/:view" element={<ProductView />} />
          <Route path="chekout" element={<CheckoutPage />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={routes} />;
}

export default Main;
