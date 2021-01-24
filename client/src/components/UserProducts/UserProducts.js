import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Loading from "../UI/Loading/Loading";
import Product from "../Products/Product/Product";
import { useFetch } from "../../hooks/fetch/fetch";

import "../Cart/Cart.css";
import "../Products/Products.css";

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const { getUserProducts, isLoading } = useFetch();

  useEffect(() => {
    getUserProducts()
      .then((res) => res && setProducts(res.products))
      .catch((err) => console.log(err));

    return () => {
      setProducts([]);
    };
  }, [getUserProducts]);

  if (products.length === 0 && !isLoading) {
    return (
      <div className="cart__empty">
        <h3>You haven't uploaded products yet!</h3>
        <Link to="/add-product">Add Product</Link>
      </div>
    );
  } else {
    return (
      <div className="products">
        {isLoading || !products ? (
          <Loading />
        ) : (
          products.map(({ title, price, _id, imageUrl, user }) => {
            return (
              <Product
                key={_id}
                productId={_id}
                title={title}
                imageUrl={imageUrl}
                price={price}
                userProds={true}
                user={user}
              />
            );
          })
        )}
      </div>
    );
  }
};

export default UserProducts;
