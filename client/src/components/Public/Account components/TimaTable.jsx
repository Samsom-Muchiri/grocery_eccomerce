import React from "react";
import { useNavigate } from "react-router";

function TimaTable() {
  const navTo = useNavigate(null);
  return (
    <div>
      <section className="ac-sec-head">
        <div className="ac-sec-back" onClick={() => navTo("/account")}>
          <span className="material-symbols-outlined">keyboard_backspace</span>
          <h1>Timetable</h1>
        </div>
        <h1 className="ac-sec-title">Timetable</h1>
      </section>
    </div>
  );
}

export default TimaTable;
