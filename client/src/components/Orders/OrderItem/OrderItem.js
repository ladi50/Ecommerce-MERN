import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

import ProductDetails from "./ProductDetails/ProductDetails";

import "./OrderItem.css";

const OrderItem = ({ orderProducts }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="orderItem">
      <div className="orderItem__header">
        <h3>Order #76926474</h3>
        <span onClick={() => setShow((prevState) => !prevState)}>+</span>
      </div>

      <CSSTransition
        in={show}
        timeout={200}
        classNames="orderItem__showDetails"
        mountOnEnter
        unmountOnExit
      >
        <div className="orderItem__products">
          {orderProducts &&
            orderProducts.map((orderProduct) => {
              return (
                <ProductDetails
                  key={orderProduct._id}
                  title={orderProduct.product.title}
                  quantity={orderProduct.quantity}
                  price={orderProduct.product.price}
                />
              );
            })}

          <div className="orderItem__totalPrice">
            <p>Total Price: $120</p>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default OrderItem;
