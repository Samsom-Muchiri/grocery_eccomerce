import React from "react";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import Nav from "./Public/reusables/Nav";
import { createBrowserRouter } from "react-router-dom";
import StateChecker from "./StateChecker";
import LandingPage from "./Public/LandingPage";
import CheckoutPage from "./Public/CheckoutPage";
import ProductView from "./Public/ProductView";
import AdminBody from "./Admin/AdminBody";
import Overview from "./Admin/Overview";
import Listing from "./Admin/Listing";
import AddListing from "./Admin/AddListing";
import ListingDetail from "./Admin/ListingDetail";
import Account from "./Public/Account";
import Myaccount from "./Public/Account components/Myaccount";
import TimaTable from "./Public/Account components/TimaTable";
import Orders from "./Public/Account components/Orders";
import SavedItems from "./Public/Account components/SavedItems";
import Vouchers from "./Public/Account components/Vouchers";

function Main() {
  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<StateChecker />}>
        <Route path="/admin" element={<AdminBody />}>
          <Route index element={<Overview />} />
          <Route path="listing" element={<Listing />} />
          <Route path="new-listing" element={<AddListing />} />
          <Route path="listing/prod/:product" element={<ListingDetail />} />
        </Route>
        <Route path="/" element={<Nav />}>
          <Route index element={<LandingPage />} />
          <Route path="account" element={<Account />}>
            <Route path="my_account" element={<Myaccount />} />
            <Route path="time_table" element={<TimaTable />} />
            <Route path="orders" element={<Orders />} />
            <Route path="vouchers" element={<Vouchers />} />
            <Route path="saved_items" element={<SavedItems />} />
          </Route>
          <Route path="/product/:view" element={<ProductView />} />
          <Route path="chekout" element={<CheckoutPage />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={routes} />;
}

export default Main;
