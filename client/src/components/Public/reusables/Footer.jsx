import React from "react";
import "../../../styles/footer.css";

function Footer() {
  return (
    <footer>
      <ul className="f-c-info">
        <li>
          <span className="material-symbols-outlined">location_on</span>
          <div>
            <h1>Find us</h1>
            <p>1010 Avenue, sw 54321, chandigarh</p>
          </div>
        </li>
        <li>
          <span className="material-symbols-outlined">call</span>
          <div>
            <h1>Call us</h1>
            <p>07xx xxx xxx</p>
          </div>
        </li>
        <li>
          <span className="material-symbols-outlined">mail</span>
          <div>
            <h1>Mail us</h1>
            <p>xx@gmail.com</p>
          </div>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
