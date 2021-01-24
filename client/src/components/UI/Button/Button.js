import React from "react";

import "./Button.css";

const Button = ({ buttonName, type, onClick }) => {
  return <button type={type} className="button" onClick={onClick}>{buttonName}</button>;
};

export default Button;
