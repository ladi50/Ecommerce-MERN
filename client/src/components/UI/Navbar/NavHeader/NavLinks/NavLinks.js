import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { CSSTransition } from "react-transition-group";

import NavLink from "./NavLink/NavLink";
import { AppContext } from "../../../../../utils/context";
import { useFetch } from "../../../../../hooks/fetch/fetch";

import cart from "./cart.png";
import "./NavLinks.css";

const NavLinks = ({ avatar, setAvatar }) => {
  const [cartAmount, setCartAmount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const history = useHistory();
  const { token, logout, userId } = useContext(AppContext);
  const { getUserCart, getUser } = useFetch();

  useEffect(() => {
    if (token && userId) {
      getUserCart()
        .then((res) => {
          if (res && res.cart) {
            let totalItems = 0;

            for (const item of res.cart.products) {
              totalItems += item.quantity;
            }

            setCartAmount(totalItems);
          }
        })
        .catch((err) => console.log(err));

      getUser()
        .then((res) => res && setAvatar(res.user.avatar))
        .catch((err) => console.log(err));
    }
  }, [cartAmount, token, userId, getUserCart, getUser, setAvatar]);

  useEffect(() => {
    history.listen(() => {
      const arrow = document.getElementById("arrow");

      if (arrow) {
        arrow.classList.remove("navlinks__profileHeader-rotateArrow");
        arrow.classList.add("navlinks__profileHeader-rotateArrowBack");
      }

      setShowProfileMenu(false);
    });
  }, [history]);

  const profileMenuHandler = () => {
    setShowProfileMenu((prevState) => !prevState);

    const arrow = document.getElementById("arrow");

    if (
      arrow &&
      arrow.classList.contains("navlinks__profileHeader-rotateArrow")
    ) {
      arrow.classList.remove("navlinks__profileHeader-rotateArrow");
      arrow.classList.add("navlinks__profileHeader-rotateArrowBack");
    } else {
      arrow.classList.remove("navlinks__profileHeader-rotateArrowBack");
      arrow.classList.add("navlinks__profileHeader-rotateArrow");
    }
  };

  return (
    <div className="navlinks">
      <div className="navlinks__links">
        {!token ? (
          <>
            <NavLink title="Sign Up" href="/signup" />
            <NavLink title="Log In" href="/login" />
          </>
        ) : (
          <>
            <NavLink title="Cart" href={`/cart/${userId}`}>
              <img className="navlinks__cartLogo" src={cart} alt="cart-logo" />
              <span className="navlinks__cartLogo-amount">{cartAmount}</span>
            </NavLink>
            <div className="navlinks__profileDiv">
              <div className="navlinks__profileHeader">
                <button onClick={profileMenuHandler}>
                  <Avatar src={avatar} alt="profile_picture" />
                  <ExpandMore style={{ color: "white" }} id="arrow" />
                </button>
              </div>

              <CSSTransition
                in={showProfileMenu}
                timeout={200}
                classNames="navlinks__showProfileMenu"
                mountOnEnter
                unmountOnExit
              >
                <div className="navlinks__profileMenu">
                  <NavLink title="Profile" href={`/profile/${userId}`} />
                  <NavLink title="My Products" href={`/products/${userId}`} />
                  <NavLink title="Add Product" href="/add-product" />
                  <NavLink title="Orders" href={`/orders/${userId}`} />
                  <NavLink title="Wishlist" href={`/wishlist/${userId}`} />
                  <button onClick={() => logout()}>LOGOUT</button>
                </div>
              </CSSTransition>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NavLinks;
