import React, { useContext, useState } from "react";
import "../../styles/admin/listing.css";
import { useNavigate } from "react-router";
import { productData } from "../../fakeData";
import DataTable from "../Reusables/DataTable";
import { CONT } from "../../AppContext/context";

function Listing() {
  const [checkedData, setCheckedData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navTo = useNavigate(null);
  const vl = useContext(CONT);
  return (
    <div>
      <section>
        <div className="section-head" onClick={() => navTo("/admin")}>
          <span className="material-symbols-outlined">arrow_back</span>{" "}
          <h1>Listing</h1>
        </div>
      </section>
      <section className="prd-data">
        <div className="data-table-cnt acc-crd">
          <div className="data-table-head">
            <div className="table-menu-left">
              <div className="table-data-count">{productData.length}</div>

              <div className="table-search-m">
                <span className="material-symbols-outlined">search</span>{" "}
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  name=""
                  id=""
                  onChange={(e) => setFilterBy(e.target.value)}
                >
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
            <div
              className="add-btn"
              onClick={() => {
                vl.setPath((prev) => [
                  ...prev,
                  { title: "New post", path: "/admin/dashboard/new_post" },
                ]);
                navTo("new-listing");
              }}
            >
              <span className="material-symbols-outlined">add</span>
            </div>
          </div>
          <div
            style={{ position: "relative", height: "55vh", overflow: "auto" }}
          >
            <div className="f-finance-table-cnt">
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
        </div>
      </section>
    </div>
  );
}

export default Listing;
