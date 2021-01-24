import React from "react";
import { NavLink as Link } from "react-router-dom";

import "./NavLink.css";

const NavLink = ({ title, children, href, onClick }) => {
  return (
    <div className="navlink">
      <Link to={href} onClick={onClick}>
        {children}
        {title}
      </Link>
    </div>
  );
};

export default NavLink;
