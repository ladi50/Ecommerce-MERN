import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import OrderItem from "./OrderItem/OrderItem";
import Loading from "../UI/Loading/Loading";
import { useFetch } from "../../hooks/fetch/fetch";

import "../Cart/Cart.css";
import "./Order.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { getOrders, isLoading } = useFetch();

  useEffect(() => {
    getOrders()
      .then((res) => res && setOrders(res.orders))
      .catch((err) => console.log(err));
  }, [getOrders]);

  return (
    <div className={orders.length === 0 ? "cart__empty" : "order"}>
      {isLoading && !orders ? (
        <Loading />
      ) : (
        <>
          {orders.length === 0 ? (
            <>
              <h3>Your Have No Orders!</h3>
              <Link to="/">Buy Products</Link>
            </>
          ) : (
            orders.map((order) => {
              return (
                <OrderItem key={order._id} orderProducts={order.products} />
              );
            })
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
