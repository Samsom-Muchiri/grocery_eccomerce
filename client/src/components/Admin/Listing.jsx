import React, { useState } from "react";
import "../../styles/admin/listing.css";
import { useNavigate } from "react-router";
import { productData } from "../../fakeData";
import DataTable from "../Reusables/DataTable";

function Listing() {
  const [checkedData, setCheckedData] = useState(null);
  const navTo = useNavigate(null);
  return (
    <div>
      <section>
        <div className="section-head" onClick={() => navTo("/admin")}>
          <span className="material-symbols-outlined">arrow_back</span>{" "}
          <h1>Listing</h1>
        </div>
      </section>
      <section className="prd-data">
        <div className="prd-table-toolbar">
          <div className="flex-card-s">
            <div className="prd-search">
              <span className="material-symbols-outlined">search</span>
              <input type="text" placeholder="Search prd name..." />
            </div>
          </div>
          <button onClick={() => navTo("/admin/new-listing")}>
            ADD LISTING
          </button>
        </div>
        <div className="prd-table-cnt">
          <div className="prd-table">
            <DataTable
              data={productData.map((obj) => {
                const { description: a, image: b, ...rest } = obj; // Destructuring assignment to remove the specified key
                return rest; // Returning the modified object without the specified key
              })}
              checker={true}
              checkerState={setCheckedData}
              doubleClick={(name) => navTo(`/admin/listing/prod/${name}`)}
              doubleClickData="name"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Listing;
