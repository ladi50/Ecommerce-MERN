import React, { useEffect, useState } from "react";

import Product from "./Product/Product";
import Loading from "../UI/Loading/Loading";
import FlashMsg from "../UI/FlashMsg/FlashMsg";
import { useFetch } from "../../hooks/fetch/fetch";

import "./Products.css";

const Products = () => {
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const { getProducts, isLoading } = useFetch();

  useEffect(() => {
    getProducts()
      .then((res) => res && setProducts(res.products))
      .catch((err) => console.log(err));

    return () => {
      setError(false);
      setMessage("");
      setShow(false);
    };
  }, [getProducts]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order succeded! Congratulations on your purchase.");
      setShow(true);
    }

    if (query.get("canceled")) {
      setMessage("Order canceled. Checkout when you're ready.");
      setShow(true);
    }

    return () => {
      setShow(false);
      setMessage("");
    };
  }, []);

  return (
    <div className="products">
      {message && !isLoading && (
        <FlashMsg
          message={message}
          show={show}
          error={error}
          onClick={() => setShow(false)}
        />
      )}
      {isLoading && (!products || products.length === 0) ? (
        <Loading />
      ) : (
        products.map(({ _id, title, imageUrl, price, user }) => {
          return (
            <Product
              key={_id}
              productId={_id}
              title={title}
              imageUrl={imageUrl}
              price={price}
              user={user}
              setProducts={setProducts}
              setError={setError}
              setMessage={setMessage}
              setShow={setShow}
            />
          );
        })
      )}
    </div>
  );
};

export default Products;
