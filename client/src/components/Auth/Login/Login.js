import React, { useContext, useState } from "react";

import AuthForm from "../AuthForm/AuthForm";
import { useFetch } from "../../../hooks/fetch/fetch";
import { AppContext } from "../../../utils/context";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState();

  const { loginUser, errorMessage: error } = useFetch();
  const { login } = useContext(AppContext);

  const changeInputHandler = (e) => {
    const { value, name } = e.target;

    setInput((prevState) => {
      return {
        ...prevState,
        [name]: value
      };
    });
  };

  const loginHandler = (e) => {
    e.preventDefault();

    loginUser(input)
      .then((res) => {
        if (res.user) {
          login(res.user._id.toString(), res.user.username, res.token);
        } else {
          window.scroll({ top: 0, behavior: "smooth" });
          setErrorMessage(res.message);
        }
      })
      .catch((err) => {
        window.scroll({ top: 0, behavior: "smooth" });
        if (err) {
          setErrorMessage(error);

          console.log(error)
        }
      });
  };

  return (
    <AuthForm onSubmit={loginHandler} title="Log In" buttonName="LOG IN">
      {errorMessage || error ? <p className="errorMessage">{errorMessage || error}</p>:null}
      <label>Email</label>
      <input
        onChange={changeInputHandler}
        name="email"
        value={input.email}
        type="email"
        placeholder="Enter your email"
        autoFocus
        autoComplete="off"
      />
      <label>Password</label>
      <input
        onChange={changeInputHandler}
        name="password"
        value={input.password}
        type="password"
        placeholder="Enter your password"
      />
    </AuthForm>
  );
};

export default Login;
