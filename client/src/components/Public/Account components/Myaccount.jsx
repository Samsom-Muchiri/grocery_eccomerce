import React from "react";
import { useNavigate } from "react-router";

function Myaccount() {
  const navTo = useNavigate(null);

  // GET the profile data
  const accountData = useQuery(
    "accountData",
    async () => {
      const response = await axios.get(`${base_url}/profile/`, {
        headers: {
          Authorization: `Bearer ${vl.token}`,
        },
      });
      return response.data;
    }
  );

  return (
    <div>
      <section className="ac-sec-head">
        <div className="ac-sec-back" onClick={() => navTo("/account")}>
          <span className="material-symbols-outlined">keyboard_backspace</span>
          <h1>My account</h1>
        </div>
        <h1 className="ac-sec-title">My account</h1>
      </section>
      <section className="ac-sec ac-detail-cards">
        <div className="ac-detail-card">
          <div className="acd-head">ACCOUNT DETAILS</div>
          <ul>
            <li>User name: Username</li>
            <li>Email: useremail@gmail.com</li>
            <li>Password</li>
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
