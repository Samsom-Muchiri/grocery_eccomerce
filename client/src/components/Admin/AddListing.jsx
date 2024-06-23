import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../../styles/admin/addlisting.css";
import TextEditor from "../Public/reusables/TextEditor";

function AddListing() {
  const navTo = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState([]);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const uploadImage = () => {
    if (selectedImage) {
      console.log("Image uploaded:", selectedImage);
    } else {
      console.log("No image selected.");
    }
  };

  const categories = {
    vegetables: {
      name: "Vegetables",
      sub_category: [
        "Root Vegetables",
        "Leafy Greens",
        "Cruciferous Vegetables",
        "Podded Vegetables",
        "Bulb and Stem Vegetables",
      ],
    },
    meat: {
      name: "Meat",
      sub_category: ["Beef", "Pork", "Chicken", "Lamb", "Turkey"],
    },
    fruits: {
      name: "Fruits",
      sub_category: [
        "Citrus Fruits",
        "Berry Fruits",
        "Stone Fruits",
        "Tropical Fruits",
        "Melons",
      ],
    },
    fish: {
      name: "Fish",
      sub_category: ["Whitefish", "Salmon", "Tuna", "Trout", "Sardines"],
    },
    drinks: {
      name: "Drinks",
      sub_category: [
        "Soft Drinks",
        "Juices",
        "Tea",
        "Coffee",
        "Alcoholic Beverages",
      ],
    },
    snacks: {
      name: "Snacks",
      sub_category: ["Chips", "Cookies", "Nuts", "Candy", "Popcorn"],
    },
  };

  const KeyWords = () => {
    const [keys, setKeys] = useState([]);
    return (
      <div className="key-words">
        <div className="key-word-head">
          <h1>Key words</h1>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            setKeys((prev) => [...prev, formData.get("key")]);
          }}
          className="key-word-input"
        >
          <input type="text" name="key" /> <button>Add</button>
        </form>
        <ul>
          {keys.length > 1 ? (
            keys.map((key) => <li>{key}</li>)
          ) : (
            <center style={{ color: "gray" }}>No key words</center>
          )}
        </ul>
      </div>
    );
  };

  const addListing = useMutation(
    async (data) => {
      const response = await axios.post(`${base_url}/create-product`, data, {
        headers: {
          "X-CSRFToken": vl.csrfToken,
        },
      });
      return response.data;
    },
    {
      onError: (error) => {
        toast(`Failed to create product, ${error.response.data?.message}`);
      },
    }
  );

  const handleAddListing = () => {
    addListing.mutate({
      image: selectedImage,
      category_name: category,
      subcategory_name: subCategory,
      name: itemName,
      price: itemPrice,
      discount,
      quantity,
      description,
      keywords,
      availability: true,
      organic: true,//// Change this value to get from input
    });
  };

  return (
    <div>
      <section className="a-prod-imagecnt">
        <div className="a-prod-image">
          <label htmlFor="prod-image" className="a-add-photo">
            <span className="material-symbols-outlined">photo_camera</span>
            <input
              type="file"
              accept="image/*"
              id="prod-image"
              onChange={handleImageChange}
            />
          </label>
          {/* Display the selected image */}
          {selectedImage && <img src={selectedImage} alt="Selected" />}
        </div>
      </section>
      <section className="a-product-details">
        <div>
          <div className="a-category-select">
            <label htmlFor="category">Category</label>
            <select
              name="category"
              onChange={(e) => {
                setSubCategories(categories[e.target.value].sub_category);
              }}
            >
              {Object.keys(categories).map((category) => {
                return (
                  <option value={category}>{categories[category].name}</option>
                );
              })}
            </select>
          </div>
          <br />
          <div className="a-category-select">
            <label htmlFor="category">Sub category</label>
            <select name="sub_category" onChange={(e) => {}}>
              {subCategories.map((category) => {
                return <option value={category}>{category}</option>;
              })}
            </select>
          </div>
        </div>
        <div className="a-prd-price">
          <div className="p-input">
            <label>Item name</label>
            <input
            type="text"
            placeholder="name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <div className="p-input">
            <label htmlFor="price">Item price</label>
            <input
            name="price"
            type="number"
            placeholder="name"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)} />
          </div>
          <div className="p-input">
            <label>
              Discount{" "}
              <small style={{ fontSize: "0.8rem", color: "gary" }}>
                <i>Optional</i>
              </small>
            </label>
            <input
            name="discount"
            type="text"
            placeholder="name"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
          <div className="p-input">
            <label htmlFor="name">Quantity</label>
            <input
            name="quantity"
            type="text"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>
        <KeyWords keywords={keywords} setKeywords={setKeywords} />
      </section>
      <section className="a-prd-description">
        <label htmlFor="">Description</label>
        <TextEditor value={description} onChange={setDescription} />
      </section>
      <section>
        <button className="a-submit-btn"
        onClick={ handleAddListing }>Submit</button>
      </section>
    </div>
  );
}

export default AddListing;
