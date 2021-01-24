import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import CartItem from "../Cart/CartItem/CartItem";
import Loading from "../UI/Loading/Loading";
import FlashMsg from "../UI/FlashMsg/FlashMsg";
import { useFetch } from "../../hooks/fetch/fetch";

import "../Cart/Cart.css";

const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [message, setMessage] = useState("");
  const { getWishlist, isLoading } = useFetch();

  useEffect(() => {
    getWishlist()
      .then((res) => res && res.wishlist && setWishlistProducts(res.wishlist))
      .catch((err) => console.log(err));
  }, [getWishlist]);

  return (
    <React.Fragment>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <FlashMsg
            show={message.length > 0}
            onClick={() => setMessage(false)}
            message={message}
          />
          <div
            className={wishlistProducts.length === 0 ? "cart__empty" : "cart"}
          >
            {wishlistProducts.length === 0 && (
              <>
                <h3>Your Wishlist Is Empty!</h3>
                <Link to="/">View Products</Link>
              </>
            )}
            {wishlistProducts &&
              wishlistProducts.map(({ title, imageUrl, _id }) => {
                return (
                  <CartItem
                    key={_id}
                    prodId={_id}
                    title={title}
                    imageUrl={imageUrl}
                    wishlistProducts={wishlistProducts}
                    setWishlistProducts={setWishlistProducts}
                    setMessage={setMessage}
                  />
                );
              })}
          </div>
          <div className="wishlist__emptyDiv"></div>
        </>
      )}
    </React.Fragment>
  );
};

export default Wishlist;
