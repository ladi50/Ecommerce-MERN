import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

import Button from "../UI/Button/Button";
import CartItem from "./CartItem/CartItem";
import Loading from "../UI/Loading/Loading";
import { useFetch } from "../../hooks/fetch/fetch";
import { AppContext } from "../../utils/context";

import "./Cart.css";
import FlashMsg from "../UI/FlashMsg/FlashMsg";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PB_KEY);

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [message, setMessage] = useState("");
  const { getUserCart, isLoading } = useFetch();
  const { userId, token } = useContext(AppContext);

  useEffect(() => {
    getUserCart()
      .then((res) => res && res.cart && setCartProducts(res.cart.products))
      .catch((err) => console.log(err));
  }, [getUserCart]);

  const checkoutHandler = async () => {
    const stripe = await stripePromise;

    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/order/${userId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const session = await res.json();

    const result = await stripe.redirectToCheckout({ sessionId: session.id });

    if (result.error) {
      console.log(result.error.message);
    }
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <FlashMsg
            show={message && message.length > 0}
            onClick={() => setMessage(false)}
            message={message}
          />
          <div className={cartProducts.length === 0 ? "cart__empty" : "cart"}>
            {cartProducts.length === 0 && (
              <>
                <h3>Your Cart Is Empty!</h3>
                <Link to="/">Buy Products</Link>
              </>
            )}
            {cartProducts.length > 0 &&
              cartProducts.map(({ product, quantity }) => {
                return (
                  <CartItem
                    key={product._id}
                    prodId={product._id}
                    title={product.title}
                    imageUrl={product.imageUrl}
                    price={product.price}
                    itemQuantity={quantity}
                    cartProducts={cartProducts}
                    setCartProducts={setCartProducts}
                    cartItem={true}
                    setMessage={setMessage}
                  />
                );
              })}
          </div>

          {cartProducts.length > 0 && (
            <div className="cart__button">
              <Button
                buttonName="Proceed to Checkout"
                type="button"
                onClick={checkoutHandler}
              />
            </div>
          )}
        </>
      )}
    </React.Fragment>
  );
};

export default Cart;
