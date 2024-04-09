import React, { useContext, useEffect, useState } from "react";
import "../../styles/admin/addlisting.css";
import ListingForm from "./ListingForm";
import Loader from "../Loader";
import { CONT } from "../../AppContext/context";

function AddListing() {
  const [category, setCategory] = useState("default");
  const [posting, setPosting] = useState(false);
  const vl = useContext(CONT);

  function Default() {
    return <h1>Choose category</h1>;
  }

  function PostComplete() {
    return (
      <div className="complete-message">
        <span className="material-symbols-outlined">check_circle</span>
        <br />
        Item listed successfuly
      </div>
    );
  }

  const forms = {
    clothing: { form: ListingForm, path: "/post_listing/1" },
    default: { form: Default, path: "" },
    postComplete: { form: PostComplete },
    home_garden: { form: ListingForm, path: "/post_listing/1" },
    electronics: { form: ListingForm, path: "/post_listing/1" },
  };
  const ChosenCategory = forms[category].form;

  function postListing(data) {
    setPosting(true);
    fetch(vl.baseUrl + forms[category].path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data.formValues, model: category }),
    })
      .then((res) => res.json())

      .then((resdata) => {
        if (resdata.hasOwnProperty("success")) {
          uploadImages(data.images);
        }
        console.log(resdata);
      })
      .cath((error) => console.log(error));
  }

  const uploadImages = async (imageObject) => {
    try {
      const formData = new FormData();

      // Append each file to the FormData object
      for (const key in imageObject) {
        if (imageObject[key] instanceof File) {
          formData.append("file", imageObject[key]);
        }
      }

      // Make a POST request to the API endpoint
      const response = await fetch(vl.baseUrl + "/add_product_image", {
        method: "POST",
        body: formData,
      });

      // Handle the response
      if (response.ok) {
        const result = await response.json();
        if (result.hasOwnProperty("file_paths")) {
          setPosting(false);
          setCategory("postComplete");
        }
      } else {
        console.error("Upload failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <>
      {" "}
      {!posting ? (
        <>
          <section>
            <div className="listing-title">
              <h1>New listing</h1>
            </div>

            <div className="item-category-select">
              <br />
              <label htmlFor="categories">
                <big>Chose item category</big>
                <br />
              </label>
              <select
                id="categories"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="default">Select a category</option>
                <option value="clothing">Clothing</option>
                <option value="clothing">Electronics</option>
                <option value="clothing">Home and Garden</option>
              </select>
            </div>
          </section>
          <ChosenCategory /* postFunction={postListing} */ />
        </>
      ) : (
        <center>
          <h1>Uploading..</h1>
          <Loader />
        </center>
      )}
    </>
  );
}

export default AddListing;
