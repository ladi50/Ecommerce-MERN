import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import "./FlashMsg.css";

const FlashMsg = ({ message, onClick, show, error }) => {
  return ReactDOM.createPortal(
    <CSSTransition
      in={show}
      timeout={200}
      classNames="flashMsg__animation"
      mountOnEnter
      unmountOnExit
    >
      <div className="flashMsg" style={{ backgroundColor: error && "red" }}>
        <p>{message}</p>
        <span onClick={onClick}>&#10006;</span>
      </div>
    </CSSTransition>,
    document.getElementById("flashMsg")
  );
};

export default FlashMsg;
