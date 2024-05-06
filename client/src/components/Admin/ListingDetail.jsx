import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DoughnutChart from "../Reusables/DoughnutChart";
import LineGraph from "../Reusables/LineGraph";
import { useContext } from "react";
import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import NumberAnimation from "../Reusables/NumberAnimation";
import { base_url } from "../../base_url";
import { CONT } from "../../AppContext/context";
import "../../styles/admin/listingdetail.css";

function ListingDetail() {
  const [mainImage, setMainImage] = useState("");
  const [priceHistoryDetail, setPriceHistoryDetail] = useState({});
  const { product } = useParams();
  const [popState, setPopState] = useState(false);
  const [targetPopContent, setTargetPopContent] = useState("");
  const [productDetail, setProductDetail] = useState({});
  const [choosenImage, setCHoosenImage] = useState({});
  const vl = useContext(CONT);
  const [saleHistoryPeriod, setSaleHistoryPeriod] = useState("week");
  const navTo = useNavigate(null);

  const fetchProduct = async () => {
    const response = await axios.get(
      base_url + "/get_product/" + product.replace("_", "/")
    );
    return response.data;
  };
  const postProductDetail = async (update) => {
    const response = await axios.post(
      base_url + "/update_product_detail",
      update
    );

    return response.data;
  };

  const uploadImage = async (formData) => {
    const response = await fetch(base_url + "/update_product_image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }
    const result = await response.json();
    console.log(result);
    return response;
  };

  const updateProductDetail = useMutation(postProductDetail);
  const uploadProdImage = useMutation(uploadImage);
  const {
    isLoading,
    data: productData,
    error,
  } = useQuery("product-detail-data", fetchProduct);
  /*  useEffect(() => {
    setMainImage({
      primary_image: true,
      image: base_url + productData?.primary_image,
    });
    setPriceHistoryDetail(productData?.price_history[0]);

    setProductDetail({
      name: productData?.name,
      brand: productData?.brand,
      price: productData?.price,
      discount: productData?.discount,
      product_id: productData?.id,
      category: productData?.category,
      type: productData?.type,
      model: productData?.model,
    });
  }, [productData]); */

  function formatKenyanShilling(number) {
    const formatter = new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    });

    return formatter.format(number);
  }
  function soldItems() {
    let count = 0;

    if (productData.hasOwnProperty("product_track")) {
      productData.product_track.forEach((sold) => {
        count += sold.quantity > 1 ? sold.quantity : 1;
      });
      return count;
    } else {
      return 0;
    }
  }

  function markedVsDiscount() {
    let discountedItems = 0;
    let fullPriceItems = 0;
    if (productData.hasOwnProperty("product_track")) {
      productData.product_track.forEach((sold) => {
        if (sold.on_offer) {
          discountedItems += 1;
        } else {
          fullPriceItems += 1;
        }
      });
      return {
        discount: discountedItems,
        fullPrice: fullPriceItems,
      };
    } else {
      return {
        discount: discountedItems,
        fullPrice: fullPriceItems,
      };
    }
  }

  function totalSales() {
    let amount = 0;

    if (productData.hasOwnProperty("product_track")) {
      productData.product_track.forEach((sold) => {
        amount += sold.quantity > 1 ? sold.quantity * sold.price : sold.price;
      });

      return formatKenyanShilling(amount);
    } else {
      return 0;
    }
  }

  function getItemSoldOnPriceHistoryDetail() {
    if (productData.product_track) {
      return productData.product_track.filter(
        (sold) => sold.price === priceHistoryDetail?.price
      )?.length;
    } else {
      return 0;
    }
  }

  const DetailCard = ({ title, jsx, editable = false }) => {
    return (
      <div className="product-info-card">
        <div className="card-title">
          <h3>
            <span>{title}</span>
            {editable && (
              <span
                className="material-symbols-outlined"
                onClick={() => {
                  setPopState(true);
                  setTargetPopContent(editable);
                }}
              >
                edit
              </span>
            )}
          </h3>
        </div>
        <div
          className={
            title === "Product description"
              ? "listing-card-body listing-card-body-short"
              : "listing-card-body"
          }
        >
          {jsx}
        </div>
      </div>
    );
  };

  function handleInput(e) {
    setProductDetail((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  const productDetailForm = (
    <>
      <h3>
        Product detail{"  "}
        {updateProductDetail.isSuccess === true ? (
          <span style={{ color: "green", fontSize: "1rem" }}>
            Updated <i className="fa fa-check-circle" aria-hidden="true"></i>
          </span>
        ) : updateProductDetail.isSuccess === false ? (
          <span style={{ color: "red", fontSize: "1rem" }}>Failed!</span>
        ) : (
          ""
        )}
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateProductDetail.mutate(productDetail);
        }}
      >
        {updateProductDetail.isLoading ? (
          <p>Updating...</p>
        ) : (
          <>
            <label>
              Name
              <input
                type="text"
                value={productDetail?.name}
                name="name"
                onInput={handleInput}
                id="product-name"
              />
            </label>

            <label htmlFor="product-price">
              Price
              <input
                type="number"
                value={productDetail?.price}
                name="price"
                onInput={handleInput}
                id="product-price"
              />
            </label>

            <label htmlFor="brand">
              Brand
              <input
                type="text"
                value={productDetail?.brand}
                name="brand"
                onInput={handleInput}
                id="brand"
              />
            </label>

            <label htmlFor="product-offer">
              Offer
              <input
                type="number"
                value={productDetail?.discount}
                name="discount"
                onInput={handleInput}
                id="product-offer"
              />
            </label>
            <br />
            <button>Save</button>
            <span onClick={() => setPopState(false)}>Cancle</span>
          </>
        )}
      </form>
    </>
  );

  const generateFileName = () => {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 10000);

    return `${timestamp}-${randomNumber}.jpg`;
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
    const objToAppend = { ...choosenImage };
    delete objToAppend.image;
    const formData = new FormData();
    const image = choosenImage.image;
    formData.append("file", image);
    /* uploadImages(formData); */
    uploadProdImage.mutate(formData);
  };

  const handleImageChange = (e, i) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imgIndex = productData.secondary_images.findIndex(
          (img) => img === choosenImage.name
        );
        const newFile = choosenImage.primary_image
          ? new File([file], productData.primary_image, {
              type: file.type,
            })
          : new File([file], productData.secondary_images[imgIndex], {
              type: file.type,
            });

        setCHoosenImage((prev) => ({
          ...prev,
          image: newFile,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const vImg = () => {
    if (choosenImage) {
      if (choosenImage.image instanceof File) {
        const objectUrl = URL.createObjectURL(choosenImage.image);

        return <img src={objectUrl} className="pr-img" alt="" />;
      } else {
        return <img src={choosenImage.image} className="pr-img" alt="" />;
      }
    }
  };
  const chooseImage = (
    <form onSubmit={handleImageUpload}>
      {uploadProdImage.isLoading ? (
        <h1>Updating...</h1>
      ) : (
        <>
          <label
            htmlFor={"image"}
            className="itm-img-add"
            title="Add image"
            /*  style={!secImages["img_1"] ? {} : { backgroundColor: "white" }} */
          >
            <span className="material-symbols-outlined">add_a_photo</span>
            {vImg()}
            <input
              onChange={(e) => handleImageChange(e)}
              name="image"
              id={"image"}
              type="file"
              accept="image/jpeg, image/png, image/gif"
            />
          </label>
          <button
            style={
              !choosenImage?.image
                ? { opacity: ".5", pointerEvents: "none" }
                : {}
            }
          >
            Save
          </button>
        </>
      )}
    </form>
  );

  const popContents = {
    productDetail: productDetailForm,
    image: chooseImage,
  };
  const TargetPC = popContents[targetPopContent];
  const popUp = (
    <div className="pop-up">
      <div className="close-pop">
        <span
          className="material-symbols-outlined"
          onClick={() => {
            const prevChosenImage = { ...choosenImage };
            delete prevChosenImage.image;
            setCHoosenImage(prevChosenImage);
            setPopState(false);
          }}
        >
          close
        </span>
      </div>
      {TargetPC}
    </div>
  );
  function countWithDelayAndDuration(targetNumber) {
    let counter = 0;
    let startTime = Date.now();

    function updateCounter() {
      if (counter < targetNumber && Date.now() - startTime <= 500) {
        counter++;
        requestAnimationFrame(updateCounter);
      }
    }

    updateCounter();
  }
  // Usage
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return <h1>Error loading data! {error}</h1>;
  }
  return (
    <>
      {popState && popUp}
      <section>
        <div className="section-head" onClick={() => navTo("/admin/listing")}>
          <span className="material-symbols-outlined">arrow_back</span>{" "}
          <h1>New Listing</h1>
        </div>
      </section>
      <center className="image-cnt">
        <div className="product-img-container">
          <div
            className="edit-main-img"
            onClick={() => {
              setPopState(true);
              setTargetPopContent("image");
            }}
          >
            <span className="material-symbols-outlined">edit</span>
          </div>
          <img src={mainImage.image} alt="" className="product-main-image" />
        </div>
      </center>
      <div className="listing-details">
        <DetailCard
          title="Product detail"
          editable="productDetail"
          jsx={
            <>
              <p>
                Name <span>Product name</span>
              </p>
              <p>
                Price{" "}
                <span>
                  ksh
                  <NumberAnimation n={500} />{" "}
                </span>
              </p>

              {productData.offer && (
                <p>
                  Offer <NumberAnimation n={400} />{" "}
                </p>
              )}
            </>
          }
        />
        <DetailCard
          title="Product description"
          editable
          jsx={
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Repellendus, suscipit dolor maiores corrupti minus et rem
              architecto similique unde ab consectetur maxime temporibus vero
              ipsum quibusdam asperiores alias veniam tenetur!
            </p>
          }
        />

        <DetailCard
          title="Sale activity"
          jsx={
            <div className="sale-activity-cnt">
              <div className="sale-activity-values">
                <p style={{ color: "red" }}>
                  Items in hand{" "}
                  <span>
                    <NumberAnimation n={30} />
                  </span>
                </p>
                <p style={{ color: "blue" }}>
                  Items sold <span>{302}</span>
                </p>
                <p>{countWithDelayAndDuration(8, 8)}</p>
              </div>
              <div className="sale-chart-cnt">
                <DoughnutChart values={[302, 400]} />
              </div>
            </div>
          }
        />

        <DetailCard
          title="Total Sales"
          jsx={
            <div className="sale-activity-cnt">
              <center>
                <h1>
                  <big>Ksh 3,0360.00</big>
                </h1>
              </center>
            </div>
          }
        />
        <div className="burger-card">
          <div className="brg-sl">
            STOCK OUTS{" "}
            <span>
              <NumberAnimation n={4} />{" "}
            </span>
          </div>
          <div className="brg-sl">
            RETURNS{" "}
            <span>
              <NumberAnimation n={36} />
            </span>
          </div>
        </div>
        <DetailCard
          title="Discounts vs. Marked Prices"
          jsx={
            <div className="sale-activity-cnt">
              <div className="sale-activity-values">
                <p style={{ color: "red" }}>
                  Bought on offer: <span>300</span> items
                </p>
                <p style={{ color: "blue" }}>
                  Bought on marked price: <span>4</span> items
                </p>
              </div>
              <div className="sale-chart-cnt">
                <DoughnutChart values={[4, 300]} />
              </div>
            </div>
          }
        />
        <DetailCard
          title="Price History"
          jsx={
            <div className="sale-activity-cnt">
              <div className="sale-activity-values">
                {productData && (
                  <select
                    name=""
                    id="price_history"
                    onChange={(e) =>
                      setPriceHistoryDetail(
                        productData?.price_history[e.target.value]
                      )
                    }
                    /* value={productData?.price_history.findIndex(
                      (price) => price.set_at === priceHistoryDetail?.set_at
                    )} */
                  >
                    {productData?.price_history?.map((price, i) => {
                      return (
                        <option value={i} key={price.set_at}>
                          {formatKenyanShilling(price.price)}
                        </option>
                      );
                    })}
                  </select>
                )}
                <p>
                  Change date: <br />
                  <span>{priceHistoryDetail?.set_at}</span>
                </p>

                <p>
                  Sales made:
                  <span>
                    {formatKenyanShilling(
                      priceHistoryDetail?.price *
                        getItemSoldOnPriceHistoryDetail()
                    )}
                  </span>
                </p>
                <p>
                  Items sold:
                  <span>{getItemSoldOnPriceHistoryDetail()}</span>
                </p>
              </div>
              <div className="sale-chart-cnt">
                <div className="chart-percent">
                  {Math.floor(
                    (getItemSoldOnPriceHistoryDetail() /
                      productData?.product_track?.length) *
                      100
                  )}
                  %
                </div>
                <center>Percent on total items sold</center>
                <DoughnutChart
                  values={[
                    (getItemSoldOnPriceHistoryDetail() /
                      productData?.product_track?.length) *
                      100,
                    100 -
                      (getItemSoldOnPriceHistoryDetail() /
                        productData?.product_track?.length) *
                        100,
                  ]}
                />
              </div>
            </div>
          }
        />
      </div>

      <div className="prd-line-chart">
        <div className="sale-history-title">
          <h3>Sale summery</h3>
          <div className="graph-tool-bar">
            <span>
              Filter by
              <select
                value={saleHistoryPeriod}
                onChange={(e) => setSaleHistoryPeriod(e.target.value)}
              >
                <option value="month">Months</option>
                <option value="day">Days</option>
                <option value="week">Weeks</option>
                <option value="year">Years</option>
              </select>
            </span>
          </div>
        </div>
        <div className="line-graph-cnt">
          {/* <LineGraph
            period={saleHistoryPeriod}
            data={productData?.product_track}
          /> */}
        </div>
      </div>
    </>
  );
}

export default ListingDetail;
