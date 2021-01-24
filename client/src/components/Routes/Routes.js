import React, { lazy, Suspense, useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Loading from "../UI/Loading/Loading";

import { AppContext } from "../../utils/context";

const Products = lazy(() => import("../Products/Products"));
const Product = lazy(() => import("../Product/Product"));
const AddProduct = lazy(() => import("../AddProduct/AddProduct"));
const UpdateProduct = lazy(() => import("../UpdateProduct/UpdateProduct"));
const UserProducts = lazy(() => import("../UserProducts/UserProducts"));
const Cart = lazy(() => import("../Cart/Cart"));
const Orders = lazy(() => import("../Orders/Order"));
const Wishlist = lazy(() => import("../Wishlist/Wishlist"));
const Profile = lazy(() => import("../Profile/Profile"));
const Login = lazy(() => import("../Auth/Login/Login"));
const Signup = lazy(() => import("../Auth/Signup/Signup"));

const Routes = ({ setAvatar }) => {
  const localToken =
    localStorage.getItem("userData") &&
    JSON.parse(localStorage.getItem("userData"));
  const { token } = useContext(AppContext);

  let routes;

  if (!token && !localToken) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Products />
        </Route>
        <Route path="/product/:prodId" exact>
          <Product />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/signup" exact>
          <Signup />
        </Route>
        <Redirect to="/" exact>
          <Products />
        </Redirect>
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Products />
        </Route>
        <Route path="/product/:prodId" exact>
          <Product />
        </Route>
        <Route path="/add-product" exact>
          <AddProduct />
        </Route>
        <Route path="/products/:userId/edit/:prodId" exact>
          <UpdateProduct />
        </Route>
        <Route path="/products/:userId" exact>
          <UserProducts />
        </Route>
        <Route path="/cart/:userId" exact>
          <Cart />
        </Route>
        <Route path="/orders/:userId" exact>
          <Orders />
        </Route>
        <Route path="/wishlist/:userId" exact>
          <Wishlist />
        </Route>
        <Route path="/profile/:userId" exact>
          <Profile setNavAvatar={setAvatar} />
        </Route>
        <Redirect to="/" exact>
          <Products />
        </Redirect>
      </Switch>
    );
  }

  return <Suspense fallback={<Loading />}>{routes}</Suspense>;
};

export default Routes;
