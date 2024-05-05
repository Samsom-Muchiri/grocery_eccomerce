import React from "react";
import { useNavigate } from "react-router";

function Vouchers() {
  const vochers = [];
  const navTo = useNavigate(null);
  return (
    <div>
      {" "}
      <section className="ac-sec-head">
        <div className="ac-sec-back" onClick={() => navTo("/account")}>
          <span className="material-symbols-outlined">keyboard_backspace</span>
          <h1>Vochers</h1>
        </div>
        <h1 className="ac-sec-title">Vochers</h1>
      </section>{" "}
      {vochers.length > 1 ? (
        <div></div>
      ) : (
        <div className="empty-account-sec">
          <div className="center-empty-desc">
            <span className="material-symbols-outlined">
              confirmation_number
            </span>
            <h1>You dont have any vochers</h1>
            <p>All your [company] vochers will be displayed here.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vouchers;
