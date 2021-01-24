import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";

import Backdrop from "./Backdrop/Backdrop";
import NavLinks from "./NavLinks/NavLinks";

import logo from "./logo.png";
import "./Sidebar.css";

const Sidebar = ({ onClick, show }) => {
  return ReactDOM.createPortal(
    <div className="sidebar">
      {show && <Backdrop onClick={onClick} />}

      <div className="sidebar__logo" onClick={onClick}>
        <Link to="/">
          <img src={logo} alt="logo" />
          <h1>Shop</h1>
        </Link>
      </div>

      <NavLinks onClick={onClick} />
    </div>,
    document.getElementById("sidebar")
  );
};

export default Sidebar;
