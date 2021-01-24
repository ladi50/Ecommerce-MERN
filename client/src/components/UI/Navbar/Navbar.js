import React from "react";
import ReactDOM from "react-dom";

import NavHeader from "./NavHeader/NavHeader";

import "./Navbar.css";

const Navbar = ({ avatar, setAvatar }) => {
  return ReactDOM.createPortal(
    <div className="navbar">
      <NavHeader avatar={avatar} setAvatar={setAvatar} />
    </div>,
    document.getElementById("navbar")
  );
};

export default Navbar;
