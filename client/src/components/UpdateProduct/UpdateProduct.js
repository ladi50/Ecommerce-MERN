import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import AuthForm from "../Auth/AuthForm/AuthForm";
import Loading from "../UI/Loading/Loading";
import FlashMsg from "../UI/FlashMsg/FlashMsg";
import { useFetch } from "../../hooks/fetch/fetch";
import { AppContext } from "../../utils/context";

const UpdateProduct = () => {
  const inputFile = useRef();
  const [imageUrl, setImageUrl] = useState();
  const [show, setShow] = useState(false);
  const [dbImage, setDbImage] = useState();
  const [input, setInput] = useState({
    title: "",
    imageUrl: null,
    description: "",
    price: 1
  });
  const history = useHistory();
  const prodId = useParams().prodId;
  const { userId } = useContext(AppContext);

  const { updateProduct, errorMessage, isLoading, getProduct } = useFetch();

  useEffect(() => {
    getProduct(prodId)
      .then((res) => {
        if (res) {
          setImageUrl(res.product.imageUrl);
          setInput((prevState) => {
            return {
              ...prevState,
              title: res.product.title,
              description: res.product.description,
              price: res.product.price
            };
          });
          setDbImage(res.product.imageUrl);
        }
      })
      .catch((err) => console.log(err));
  }, [getProduct, prodId]);

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

  const editProductHandler = (e) => {
    e.preventDefault();
    setShow(false);

    const formData = new FormData();
    formData.append("title", input.title);
    formData.append("description", input.description);
    formData.append("price", input.price);
    formData.append("dbImage", dbImage.split(".com/")[1]);
    if (input.imageUrl) {
      formData.append("imageUrl", input.imageUrl);
    }

    updateProduct(prodId, formData)
      .then((res) => {
        if (res) {
          setTimeout(() => {
            history.push(`/products/${userId}`);
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
      onSubmit={editProductHandler}
      title="Edit Product"
      buttonName="EDIT PRODUCT"
      errorMessage={errorMessage}
    >
      {show && !isLoading && (
        <FlashMsg
          show={show}
          message="Product updated successfully! You are redirected to your products page."
          onClick={() => setShow(false)}
        />
      )}
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
      {isLoading ? (
        <Loading />
      ) : (
        <>
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
            value={input.image}
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
        </>
      )}
    </AuthForm>
  );
};

export default UpdateProduct;
