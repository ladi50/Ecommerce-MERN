import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import NavLinks from "./NavLinks/NavLinks";
import Burger from "./NavLinks/Burger/Burger";
import Sidebar from "../Sidebar/Sidebar";

import logo from "./logo.png";
import "./NavHeader.css";

const NavHeader = ({ avatar, setAvatar }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="navheader">
      <div className="navheader__logo">
        <Link to="/">
          <img src={logo} alt="logo" />
          <h1>Shop</h1>
        </Link>
      </div>
      <NavLinks avatar={avatar} setAvatar={setAvatar} />
      <Burger show={show} onClick={() => setShow((prevState) => !prevState)} />

      <CSSTransition
        in={show}
        timeout={300}
        classNames="showSidebar"
        mountOnEnter
        unmountOnExit
      >
        <Sidebar
          show={show}
          onClick={() => setShow((prevState) => !prevState)}
        />
      </CSSTransition>
    </div>
  );
};

export default NavHeader;
