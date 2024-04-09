import React, { useEffect, useState } from "react";

function ListingForm({ postFunction, uploadImageObj }) {
  const [pr_img, setPr_img] = useState("");
  const [secImages, setSecImages] = useState({});
  const [secImgOgjs, setSecImgObjs] = useState({});
  const [onOffer, setOnOffer] = useState(false);
  const [hasVariants, setHasVariants] = useState(false);
  const [variantLength, setVariantLenth] = useState(1);
  const [variantImages, setVariantImages] = useState({});
  const [variantsArr, setVariantArr] = useState([]);
  const length = variantLength;
  const [category_2, setCategory_2] = useState(0);
  const [itemImages, setItemImages] = useState({});
  const variants = Array.from({ length }, () => ({
    name: "name",
    description: "description",
    img: "",
  }));
  const [formValues, setFormValues] = useState({
    offer: onOffer,
    variants: variantsArr,
    discount: null,
    offer_exp_date: null,
    type: "clothing",
    sizes: "",
  });

  const currentDate = new Date();
  const minDate = currentDate.toISOString().split("T")[0];

  const womensClothing = [
    "Dresses",
    "Tops",
    "Bottoms",
    "Outerwear",
    "Shoes",
    "Accessories",
    "Blouses",
    "T-shirts",
    "Tanks",
    "Sweaters",
    "Hoodies",
    "Jackets",
    "Jeans",
    "Chinos",
    "Leggings",
    "Shorts",
    "Skirts",
    "Coats",
    "Vests",
    "Heels",
    "Boots",
    "Sandals",
    "Flats",
    "Sneakers",
    "Bags",
    "Jewelry",
    "Scarves",
    "Hats",
    "Belts",
    "Maxi dresses",
    "Midi dresses",
    "Mini dresses",
    "Casual dresses",
    "Cocktail dresses",
    "Evening gowns",
    "Lingerie",
    "Swimwear",
    "Activewear",
    "Workwear",
    "Maternity wear",
    "Plus-size clothing",
    "Vintage clothing",
    "Designer clothing",
  ];
  const mensClothing = [
    "Shirts",
    "Pants",
    "Jeans",
    "Shorts",
    "T-shirts",
    "Sweaters",
    "Jackets",
    "Suits",
    "Underwear",
    "Shoes",
    "Accessories",
    "Button-down shirts",
    "Polo shirts",
    "Turtlenecks",
    "Chinos",
    "Dress pants",
    "Cargo pants",
    "Khakis",
    "Boots",
    "Sneakers",
    "Dress shoes",
    "Sandals",
    "Hats",
    "Belts",
    "Wallets",
    "Watches",
    "Sunglasses",
    "Tank tops",
    "Hoodies",
    "Vests",
    "Shorts",
    "Swimwear",
    "Activewear",
    "Workwear",
    "Big and tall clothing",
  ];
  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      offer: onOffer,
      variants: variantsArr,
    }));
  }, [variantsArr, variantLength]);
  useEffect(() => {
    if (hasVariants) {
      setVariantArr((prev) => [
        ...prev,
        {
          name: "",
          description: "",
          img: "",
        },
      ]);
    }
  }, [variantLength]);
  useEffect(() => {
    if (hasVariants) {
      setFormValues((prev) => ({
        ...prev,
        offer: onOffer,
        variants: variants,
      }));
      setVariantArr(variants);
    } else {
      setFormValues((prev) => ({
        ...prev,
        offer: onOffer,
        variants: [],
      }));
      setVariantArr([]);
      setVariantLenth(1);
      setVariantImages({});
    }
  }, [hasVariants]);

  function handleSubmit(e) {
    e.preventDefault();
    postFunction({ formValues: formValues, images: itemImages });
  }
  function handleInput(e) {
    const key = e.target.name;
    const value = e.target.value;
    if (key.split(" ")[0] === "Item" && key.split("_")[0] !== "variant") {
      setFormValues((prev) => ({ ...prev, [key.split(" ")[1]]: value }));
    } else if (key.split("_")[0] === "variant") {
      const updatedVariants = [...variantsArr];
      if (updatedVariants[key.split("_")[2]]) {
        updatedVariants[key.split("_")[2]][key.split("_")[1]] = value;
      } else {
        updatedVariants.push({
          name: "name",
          description: "description",
          img: "",
          [key.split("_")[1]]: value,
        });
      }
      setVariantArr(updatedVariants);
    } else {
      setFormValues((prev) => ({ ...prev, [key]: value }));
    }
  }
  const inputsA = [
    {
      type: "text",
      name: "Item name",
      placeholder: "name",
      required: true,
      restriction: {
        maxLength: "30",
      },
    },
    {
      type: "number",
      name: "Item price",
      placeholder: "Amount in Ksh",
      required: true,
      restriction: {},
    },
    {
      type: "number",
      name: "quantity",
      placeholder: "Quantity",
      required: true,
      restriction: {
        min: 1,
      },
    },
    {
      type: "text",
      name: "Item brand",
      placeholder: "Brand",
      required: true,
      restriction: {
        maxlength: "150",
      },
    },
  ];
  const secondaryImages = [
    { name: "sec_image_1" },
    { name: "sec_image_2" },
    { name: "sec_image_3" },
  ];
  useEffect(() => {
    setFormValues((prev) => ({ ...prev, secondary_images: secImages }));
  }, [secImages]);

  const handleImageChange = (e, i) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        if (e.target.name === "primary_image") {
          setPr_img(dataUrl);
          const generatedFileName = generateFileName();
          const fileName = generatedFileName;

          const newFile = new File([file], generatedFileName, {
            type: file.type,
          });
          setItemImages((prev) => ({ ...prev, [e.target.name]: newFile }));

          // Use the stored generated file name for both file and formValues state
          setFormValues((prev) => ({
            ...prev,
            primary_image: fileName,
          }));
        } else {
          const imgNo = i + 1;
          const generatedFileName = generateFileName();
          const fileName = generatedFileName;
          setSecImages((prev) => ({
            ...prev,
            ["img_" + imgNo]: generatedFileName,
          }));

          const newFile = new File([file], fileName, {
            type: file.type,
          });
          setItemImages((prev) => ({ ...prev, [e.target.name]: newFile }));
          setSecImgObjs((prev) => ({
            ...prev,
            [`secImage_${i}`]: newFile,
          }));
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleVariantImageChange = (e, i) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const newImgVariants = [...variantsArr];
        newImgVariants[i].img = generateFileName();
        setVariantArr(newImgVariants);

        const generatedFileName = newImgVariants[i].img;

        const newFile = new File([file], generatedFileName, {
          type: file.type,
        });

        setVariantImages((prev) => ({
          ...prev,
          [`variant_image_${i}`]: newFile,
        }));

        setItemImages((prev) => ({ ...prev, [e.target.name]: newFile }));
      };

      reader.readAsDataURL(file);
    }
  };

  const generateFileName = () => {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 10000);

    return `${timestamp}-${randomNumber}.jpg`;
  };
  return (
    <div className="listing-container">
      <form onSubmit={handleSubmit} className="listin-form">
        <section className="listing-section">
          {inputsA.map((input) => {
            const inputId = input.name.toLocaleLowerCase().replace(" ", "");
            const specifications = Object.keys(input.restriction);
            const sp = "maxlength";
            return (
              <div className="input-field">
                <label htmlFor={inputId}>
                  {input.name}{" "}
                  <small>
                    {input.required ? <i>(required)</i> : <i>(optional)</i>}
                  </small>
                </label>
                <br />
                <input
                  type={input.type}
                  id={inputId}
                  onChange={handleInput}
                  name={input.name}
                  placeholder={input.placeholder}
                  {...Object.entries(input.restriction).reduce(
                    (acc, [key, value]) => {
                      acc[key] = value;
                      return acc;
                    },
                    {}
                  )}
                />
              </div>
            );
          })}
        </section>
        <section>
          <h3>Category on clothing</h3>
          <select
            name="category_2"
            id=""
            onChange={(e) => {
              setCategory_2(e.target.value);
              setFormValues((prev) => ({ ...prev, category: e.target.value }));
              console.log(category_2);
            }}
            required
          >
            <option value="">Choose </option>
            <option value="Mens clothing">Mens clothing</option>
            <option value="Womens clothing">Womens clothing</option>
            <option value="Girls clothin">Girls clothing</option>
            <option value="Boys clothing">Boys clothing</option>
            <option value="Baby clothing">Baby clothing</option>
          </select>
          {category_2 === "Womens clothing" && (
            <select
              name="type"
              id=""
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  sub_category: e.target.value,
                }))
              }
              required
            >
              <option value="">Choose</option>
              {womensClothing.map((option, i) => {
                return (
                  <option value={option} key={i + option}>
                    {option}
                  </option>
                );
              })}
            </select>
          )}
          {category_2 === "Mens clothing" && (
            <select
              name=""
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  sub_category: e.target.value,
                }))
              }
              id=""
            >
              <option value="">Choose</option>
              {mensClothing.map((option, i) => {
                return (
                  <option value={option} key={option + i}>
                    {option}
                  </option>
                );
              })}
            </select>
          )}
        </section>
        <section>
          <p>Is this item on offer?</p>
          <label>
            <b>Yes</b>{" "}
            <input
              type="radio"
              onChange={() => setOnOffer(true)}
              required
              name="offer"
              checked={onOffer}
            />
          </label>{" "}
          <label>
            <b>No</b>{" "}
            <input
              type="radio"
              onChange={() => setOnOffer(false)}
              value="offer"
              required
              name="offer"
              checked={!onOffer}
            />
          </label>
        </section>
        <br />
        <br />
        {onOffer && (
          <section className="offer-sec listing-section">
            <div className="input-field">
              <label htmlFor="discount">Discount Price</label>
              <br />
              <input
                type="number"
                name="discount"
                id="discount"
                onChange={handleInput}
                placeholder="Discount"
              />
            </div>
            <div className="input-field">
              <label htmlFor="offer-exp">Offer expiery date</label>
              <br />
              <input
                type="date"
                onChange={handleInput}
                min={minDate}
                name="offer_exp_date"
              />
            </div>
          </section>
        )}
        <section className="description-sec">
          <label htmlFor="">
            Item description <i>(required)</i>
          </label>
          <br />
          <textarea
            className="description-entry"
            name="description"
            id="description"
            rows="5"
            onChange={handleInput}
          ></textarea>
        </section>
        <section>
          <p>Does this item have variants?</p>
          <label>
            <b>Yes</b>{" "}
            <input
              type="radio"
              onChange={() => setHasVariants(true)}
              required
              name="variant"
              checked={hasVariants}
            />
          </label>{" "}
          <label>
            <b>No</b>{" "}
            <input
              type="radio"
              onChange={() => setHasVariants(false)}
              required
              name="variant"
              checked={!hasVariants}
            />
          </label>
        </section>

        {hasVariants && (
          <>
            {" "}
            <h3>Variants</h3>
            <section className="listing-section">
              {variants.map((v, i) => {
                const variantImage = variantImages["variant" + "_image_" + i];
                const vImg = () => {
                  if (variantImage) {
                    if (variantImage instanceof File) {
                      const objectUrl = URL.createObjectURL(variantImage);

                      return <img src={objectUrl} className="pr-img" alt="" />;
                    } else {
                      return (
                        <img src={variantImage} className="pr-img" alt="" />
                      );
                    }
                  }
                };
                return (
                  <div
                    className="input-field"
                    key={"variant" + "_" + v.name + "_" + i}
                  >
                    <div>
                      <label htmlFor="">
                        Variant name{" "}
                        <small>
                          <i>(required)</i>
                        </small>
                      </label>
                      <br />
                      <input
                        type="text"
                        name={"variant" + "_" + v.name + "_" + i}
                        onChange={handleInput}
                        placeholder={v.name}
                      />
                    </div>
                    <br />
                    <div>
                      <label htmlFor="">
                        Variant description{" "}
                        <small>
                          <i>(less than 15 words)</i>
                        </small>
                        <small>
                          <i>(required)</i>
                        </small>
                      </label>
                      <br />
                      <input
                        type="text"
                        name={"variant" + "_" + v.description + "_" + i}
                        placeholder={v.description}
                        onChange={handleInput}
                      />
                    </div>
                    <label
                      htmlFor={`variant${i}`}
                      className="itm-img-add"
                      title="Add image"
                      style={v.img !== "" ? { backgroundColor: "white" } : {}}
                    >
                      <span className="material-symbols-outlined">
                        add_a_photo
                      </span>

                      {vImg()}
                      <input
                        onChange={(e) => handleVariantImageChange(e, i)}
                        name={"variant" + "_image_" + i}
                        id={`variant${i}`}
                        type="file"
                        required
                        accept="image/jpeg, image/png, image/gif"
                      />
                    </label>
                  </div>
                );
              })}{" "}
              <div
                className="new-variant-btn"
                onClick={() => setVariantLenth((prev) => prev + 1)}
              >
                New
                <span className="material-symbols-outlined">add_box</span>
              </div>
            </section>
          </>
        )}
        <h3>Item image</h3>
        <small>
          For better appearance pleace chose images with white backgroung
        </small>
        <br />
        <section className="image-entry-sec">
          <div>
            <span>
              Primary image <i>(required)</i>
            </span>

            <label
              htmlFor="primary-img"
              className="itm-img-add"
              title="Add image"
              style={pr_img !== "" ? { backgroundColor: "white" } : {}}
            >
              <span className="material-symbols-outlined">add_a_photo</span>
              <img className="pr-img" src={pr_img} alt="" />
              <input
                onChange={handleImageChange}
                name="primary_image"
                id="primary-img"
                type="file"
                required
                accept="image/jpeg, image/png, image/gif"
              />
            </label>
          </div>
          {secondaryImages.map((img, i) => {
            const secImg = secImgOgjs["secImage_" + i];
            const vImg = () => {
              if (secImg) {
                if (secImg instanceof File) {
                  const objectUrl = URL.createObjectURL(secImg);

                  return <img src={objectUrl} className="pr-img" alt="" />;
                } else {
                  return <img src={secImg} className="pr-img" alt="" />;
                }
              }
            };
            return (
              <div>
                <span>
                  Secondary image {i + 1} <i>(optional)</i>
                </span>
                <label
                  htmlFor={img.name}
                  className="itm-img-add"
                  title="Add image"
                  style={
                    !secImages["img_1"] ? {} : { backgroundColor: "white" }
                  }
                >
                  <span className="material-symbols-outlined">add_a_photo</span>
                  {vImg()}
                  <input
                    onChange={(e) => handleImageChange(e, i)}
                    name={img.name}
                    id={img.name}
                    type="file"
                    accept="image/jpeg, image/png, image/gif"
                  />
                </label>
              </div>
            );
          })}
        </section>
        <br />
        <section>
          <button
            className="uploaf-form-btn secondary-btn
        "
          >
            Upload
          </button>
          <br />
          <br />
        </section>
      </form>
    </div>
  );
}

export default ListingForm;
