import React from "react";
import { Link } from "react-router-dom";
import { Delete } from "@material-ui/icons";

import Loading from "../../UI/Loading/Loading";
import { useFetch } from "../../../hooks/fetch/fetch";

import "./CartItem.css";

const CartItem = ({
  title,
  price,
  imageUrl,
  itemQuantity,
  prodId,
  setCartProducts,
  cartProducts,
  setWishlistProducts,
  cartItem,
  setMessage
}) => {
  const { removeCartItem, removeWishListItem, isLoading } = useFetch();

  const removeCartItemHandler = () => {
    if (cartItem) {
      removeCartItem(prodId)
        .then((res) => {
          if (res) {
            setCartProducts((prevState) =>
              prevState.filter((p) => {
                return p.product._id !== prodId;
              })
            );
          }

          setMessage("Product deleted from cart successfully!");
        })
        .then(() => {
          const currentItems = cartProducts.filter(
            (p) => p.product._id !== prodId
          );

          let totalItems = 0;

          for (const item of currentItems) {
            totalItems += item.quantity;
          }

          document.querySelector(
            ".navlinks__cartLogo-amount"
          ).innerHTML = totalItems;
        })
        .catch((err) => console.log(err));
    } else {
      removeWishListItem(prodId)
        .then((res) => {
          if (res) {
            setWishlistProducts((prevState) =>
              prevState.filter((p) => {
                return p._id !== prodId;
              })
            );

            setMessage("Product deleted from wishlist successfully!");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="cartItem">
      {isLoading && <Loading />}
      <Link to={`/product/${prodId}`}>
        <div className="cartItem__image">
          <img src={imageUrl} alt={title} />
        </div>
      </Link>

      <Link to={`/product/${prodId}`} style={{ color: "black" }}>
        <div className="cartItem__details">
          <h3>{title}</h3>
        </div>
      </Link>

      {cartItem && (
        <>
          <div className="cartItem__quantity">
            <p>Quantity:</p>
            <p>{itemQuantity}</p>
          </div>

          <div className="cartItem__price">
            <p>
              ${price} X {itemQuantity} = ${price * itemQuantity}
            </p>
          </div>
        </>
      )}

      <div className="cartItem__remove">
        <button onClick={removeCartItemHandler}>
          <Delete /> Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
