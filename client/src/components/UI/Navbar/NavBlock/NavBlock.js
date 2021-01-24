import React from "react";
import ReactDOM from "react-dom";

import "./NavBlock.css";

const NavBlock = () => {
  return ReactDOM.createPortal(
    <div className="navBlock"></div>,
    document.getElementById("navBlock")
  );
};

export default NavBlock;
