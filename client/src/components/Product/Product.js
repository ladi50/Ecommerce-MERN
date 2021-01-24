import React, { useContext, useEffect, useState } from "react";
import { Rating } from "@material-ui/lab";
import { useParams } from "react-router-dom";

import FlashMsg from "../UI/FlashMsg/FlashMsg";
import Loading from "../UI/Loading/Loading";
import { useFetch } from "../../hooks/fetch/fetch";
import { AppContext } from "../../utils/context";

import whishListIcon from "./wishlist.png";
import "./Product.css";

const Product = () => {
  const [stars, setStars] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [product, setProduct] = useState({});
  const [showMsg, setShowMsg] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const {
    getProduct,
    isLoading,
    addToCart,
    addToWishlist,
    calculateRating
  } = useFetch();
  const { token, userId } = useContext(AppContext);
  const prodId = useParams().prodId;

  useEffect(() => {
    getProduct(prodId)
      .then((res) => {
        if (res) {
          setProduct(res.product);
          if (res.product.rating.averageRating > 0) {
            setStars(res.product.rating.averageRating);
          }
        }
      })
      .catch((err) => console.log(err));
  }, [getProduct, prodId]);

  useEffect(() => {
    return () => setWishlist(false);
  }, []);

  const addToWishlistHandler = () => {
    addToWishlist(prodId)
      .then((res) => {
        if (res) {
          setShowMsg(true);
          setWishlist(true);
        }
      })
      .then(() => setQuantity(0))
      .catch((err) => console.log(err));
  };

  const addProductToCartHandler = () => {
    addToCart({ prodId, quantity })
      .then((res) => {
        if (res) {
          setShowMsg(true);

          const cartAmount = document.querySelector(
            ".navlinks__cartLogo-amount"
          );
          cartAmount.innerHTML = parseInt(cartAmount.innerHTML) + quantity;
        }
      })
      .then(() => setQuantity(0))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    calculateRating(prodId, stars)
      .then((res) => res && console.log("Rating changed!"))
      .catch((err) => console.log(err));
  }, [calculateRating, prodId, stars]);

  return (
    <div className="productPage">
      <FlashMsg
        message={
          wishlist ? "Product added to wishlist!" : "Product added to cart!"
        }
        show={showMsg}
        onClick={() => {
          setShowMsg(false);
          setTimeout(() => {
            setWishlist(false);
          }, 300);
        }}
      />
      {!product || isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="productPage_image">
            <img src={product.imageUrl} alt={product.title} />
          </div>

          <div className="productPage__details">
            <h2>{product.title}</h2>
            <p className="productPage__price">${product.price}</p>

            <div className="productPage__stars">
              <Rating
                name="starts_rating"
                id="stars"
                value={stars && stars}
                precision={0.5}
                onChange={(e) => setStars(parseFloat(e.target.value))}
                style={{ color: "#fd2e73" }}
                readOnly={!token || product.user === userId}
              />
            </div>

            <p className="productPage__description">{product.description}</p>

            {token && product.user !== userId && (
              <>
                <div className="quantity">
                  <button
                    onClick={() =>
                      quantity > 0 && setQuantity((prevState) => prevState - 1)
                    }
                  >
                    -
                  </button>
                  <p>{quantity}</p>
                  <button
                    onClick={() => setQuantity((prevState) => prevState + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={addToWishlistHandler}
                  className="productPage__wishlist"
                >
                  <img src={whishListIcon} alt="wishlist_icon" /> ADD TO
                  WISHLIST
                </button>
              </>
            )}

            {token && quantity > 0 && (
              <button
                onClick={addProductToCartHandler}
                className="productPage__addToCart"
              >
                ADD TO CART
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
