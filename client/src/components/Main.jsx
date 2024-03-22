import React from "react";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import Nav from "./Public/reusables/Nav";
import { createBrowserRouter } from "react-router-dom";
import StateChecker from "./StateChecker";
import LandingPage from "./Public/LandingPage";

function Main() {
  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<StateChecker />}>
        <Route path="/" element={<Nav />}>
          <Route index element={<LandingPage />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={routes} />;
}

export default Main;
