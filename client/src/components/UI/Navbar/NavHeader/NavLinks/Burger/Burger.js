import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import "./Burger.css";

const Burger = ({ onClick, show }) => {
  useEffect(() => {
    const burgerChilds = document.getElementsByClassName("burger__child");

    if (show) {
      for (const burgerChild of burgerChilds) {
        burgerChild.classList.add("active");
      }
    } else {
      for (const burgerChild of burgerChilds) {
        burgerChild.classList.remove("active");
      }
    }
  }, [show]);

  return ReactDOM.createPortal(
    <div className="burger" onClick={onClick}>
      <div className="burger__child"></div>
      <div className="burger__child"></div>
      <div className="burger__child"></div>
    </div>,
    document.getElementById("burger")
  );
};

export default Burger;
