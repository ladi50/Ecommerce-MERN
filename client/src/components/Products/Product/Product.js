import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";

import Loading from "../../UI/Loading/Loading";
import { Backdrop } from "./Backdrop/Backdrop";
import { AppContext } from "../../../utils/context";
import { useFetch } from "../../../hooks/fetch/fetch";

import "./Product.css";

const Product = ({
  title,
  price,
  imageUrl,
  productId,
  user,
  setProducts,
  setError,
  setMessage,
  setShow
}) => {
  const { userId } = useContext(AppContext);
  const { deleteProduct, isLoading } = useFetch();

  const deleteProductHandler = () => {
    setShow(false);
    setError(false);

    deleteProduct(productId)
      .then((res) => {
        if (res) {
          setProducts((prevState) => {
            return prevState.filter((p) => {
              return p._id !== productId;
            });
          });

          setMessage("Product deleted successfully!");
          setShow(true);
        } else {
          setMessage("Product delete failed!");
          setError(true);
          setShow(true);
          throw new Error("Could not delete product!");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="product">
      {isLoading && <Loading />}

      {user === userId && !isLoading && (
        <div className="product__userProducts">
          <Link to={`/products/${userId}/edit/${productId}`}>
            <IconButton id="editIcon">
              <Edit />
            </IconButton>
          </Link>

          <IconButton id="deleteIcon" onClick={deleteProductHandler}>
            <Delete />
          </IconButton>
        </div>
      )}

      <Link to={`/product/${productId}`}>
        <div className="product__card">
          <img src={imageUrl} alt={title} />

          <Backdrop />

          <div className="product__viewBar">
            <p>View Product</p>
          </div>
        </div>
      </Link>
      <div className="product__details">
        <h3>{title}</h3>
        <p>${price}</p>
      </div>
    </div>
  );
};

export default Product;
