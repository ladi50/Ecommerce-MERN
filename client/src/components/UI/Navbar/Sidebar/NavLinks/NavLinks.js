import React, { useContext, useEffect, useState } from "react";
import { IconButton } from "@material-ui/core";
import { ExitToApp } from "@material-ui/icons";

import NavLink from "../../NavHeader/NavLinks/NavLink/NavLink";
import { AppContext } from "../../../../../utils/context";
import { useFetch } from "../../../../../hooks/fetch/fetch";

import cart from "./cart.png";
import "./NavLinks.css";

const NavLinks = ({ onClick }) => {
  const [cartAmount, setCartAmount] = useState(0);
  const { token, userId, logout } = useContext(AppContext);

  const { getUserCart } = useFetch();

  useEffect(() => {
    if (token && userId) {
      getUserCart()
        .then((res) => {
          if (res) {
            let totalItems = 0;

            for (const item of res.cart.products) {
              totalItems += item.quantity;
            }

            setCartAmount(totalItems);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [cartAmount, token, userId, getUserCart]);

  return (
    <div className="mobileLinks">
      {token && (
        <IconButton
          onClick={() => logout()}
          style={{
            position: "absolute",
            top: "9px",
            left: "30px",
            backgroundColor: "#fd2e73"
          }}
        >
          <ExitToApp style={{ color: "white", fontSize: "1.6rem" }} />
        </IconButton>
      )}
      {!token ? (
        <>
          <NavLink title="Sign Up" href="/signup" onClick={onClick} />
          <NavLink title="Log In" href="/login" onClick={onClick} />
        </>
      ) : (
        <>
          <NavLink title="Profile" href={`/profile/${userId}`} onClick={onClick} />

          <NavLink title="Cart" href={`/cart/${userId}`} onClick={onClick}>
            <span className="mobileLinks__cartLogo-amount">{cartAmount}</span>
            <img className="mobileLinks__cartLogo" src={cart} alt="cart-logo" />
          </NavLink>

          <NavLink
            title="My products"
            href={`/products/${userId}`}
            onClick={onClick}
          />
          <NavLink title="Add Product" href="/add-product" onClick={onClick} />
          <NavLink
            title="Orders"
            href={`/orders/${userId}`}
            onClick={onClick}
          />
          <NavLink
            title="Wishlist"
            href={`/wishlist/${userId}`}
            onClick={onClick}
          />
        </>
      )}
    </div>
  );
};

export default NavLinks;
