import React from "react";

function Myaccount() {
  return (
    <div>
      <section className="ac-sec-head">
        <h1>My account</h1>
      </section>
      <section className="ac-sec ac-detail-cards">
        <div className="ac-detail-card">
          <div className="acd-head">ACCOUNT DETAILS</div>
          <ul>
            <li>User name: Username</li>
            <li>Email: useremail@gmail.com</li>
          </ul>
        </div>
        <div className="ac-detail-card">
          <div className="acd-head">ADDRESS BOOK</div>
          <p>Your default shipping address:</p>
          <p>No default shipping address available.</p>
        </div>
      </section>
    </div>
  );
}

export default Myaccount;
