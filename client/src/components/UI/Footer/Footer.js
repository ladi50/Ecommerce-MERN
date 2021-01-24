import React from "react";
import ReactDOM from "react-dom";

import "./Footer.css";

const Footer = () => {
  return ReactDOM.createPortal(
    <div className="footer__div">
      <div className="footer">
        <p>&copy; 2021 Adi Leviim, All Rights Reserved.</p>
      </div>
    </div>,
    document.getElementById("footer")
  );
};

export default Footer;
