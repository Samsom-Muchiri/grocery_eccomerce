import React from "react";
import { useNavigate } from "react-router";

function SavedItems() {
  const savedItems = [];
  const navTo = useNavigate(null);
  return (
    <div>
      <section className="ac-sec-head">
        <div className="ac-sec-back" onClick={() => navTo("/account")}>
          <span className="material-symbols-outlined">keyboard_backspace</span>
          <h1>Saved</h1>
        </div>
        <h1 className="ac-sec-title">Saved</h1>
      </section>
      {savedItems.length > 1 ? (
        <div></div>
      ) : (
        <div className="empty-account-sec">
          <div className="center-empty-desc">
            <span className="material-symbols-outlined">favorite</span>
            <h1>You dont have any saved items</h1>
            <p>
              To save items click on the heart icon on product view page to
              save.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SavedItems;
