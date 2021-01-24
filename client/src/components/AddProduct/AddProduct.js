import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import AuthForm from "../Auth/AuthForm/AuthForm";
import { useFetch } from "../../hooks/fetch/fetch";
import FlashMsg from "../UI/FlashMsg/FlashMsg";

const AddProduct = () => {
  const inputFile = useRef();
  const [imageUrl, setImageUrl] = useState();
  const [show, setShow] = useState(false);
  const [input, setInput] = useState({
    title: "",
    imageUrl: null,
    description: "",
    price: 1
  });
  const history = useHistory();

  const { createProduct, errorMessage, isLoading } = useFetch();

  useEffect(() => {
    const fileReader = new FileReader();

    if (input.imageUrl) {
      fileReader.readAsDataURL(input.imageUrl);

      fileReader.onloadend = () => {
        fileReader.onerror = (err) => {
          if (err) {
            return console.log(err);
          }
        };

        setImageUrl(fileReader.result);
      };
    }

    return () => {
      fileReader.abort();
      setShow(false);
    };
  }, [input.imageUrl]);

  const inputChangeHandler = (e) => {
    const { value, name } = e.target;

    setInput((prevState) => {
      return {
        ...prevState,
        [name]: value
      };
    });
  };

  const fileChangeHandler = (e) => {
    if (e.target.files && e.target.files.length === 1) {
      setInput((prevState) => {
        return { ...prevState, imageUrl: e.target.files[0] };
      });
    }
    if (!e.target.files || e.target.files.length === 0) {
      setInput((prevState) => {
        return { ...prevState, imageUrl: null };
      });
      setImageUrl(null);
    }
  };

  const addProductHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", input.title);
    formData.append("imageUrl", input.imageUrl);
    formData.append("description", input.description);
    formData.append("price", input.price);

    createProduct(formData)
      .then((res) => {
        if (res) {
          setTimeout(() => {
            history.push("/");
          }, 3000);

          setShow(true);
        } else {
          window.scroll({ top: 0, behavior: "smooth" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <AuthForm
      onSubmit={addProductHandler}
      title="New Product"
      buttonName="ADD PRODUCT"
      errorMessage={errorMessage}
    >
      {show && !isLoading && (
        <FlashMsg
          show={show}
          message="Product added successfully! You are redirected to home page."
          onClick={() => setShow(false)}
        />
      )}
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
      <div className="addProduct__imageDiv">
        {imageUrl ? (
          <img src={imageUrl} alt="product__image" />
        ) : (
          <p>Upload Image</p>
        )}
      </div>
      <input
        ref={inputFile}
        type="file"
        hidden
        name="imageUrl"
        onChange={fileChangeHandler}
      />
      <button
        className="imageButton"
        type="button"
        onClick={() => inputFile.current.click()}
      >
        Upload Image
      </button>
      <label>Title</label>
      <input
        type="text"
        name="title"
        placeholder="Enter product title"
        value={input.title}
        onChange={inputChangeHandler}
      />
      <label>Price</label>
      <input
        type="number"
        name="price"
        value={input.price}
        onChange={inputChangeHandler}
        min="1"
        step="0.1"
      />
      <label>Description</label>
      <textarea
        name="description"
        placeholder="Enter description"
        value={input.description}
        onChange={inputChangeHandler}
        rows="5"
      />
    </AuthForm>
  );
};

export default AddProduct;
