import React from "react";

import "./ProductDetails.css";

const ProductDetails = ({ title, quantity, price }) => {
  return (
    <div className="productDetails">
      <h4>{title}</h4>
      <p>Quantity: {quantity}</p>
      <p>Price: ${quantity * price}</p>
    </div>
  );
};

export default ProductDetails;
