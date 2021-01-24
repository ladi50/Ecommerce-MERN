import React, { useContext, useState } from "react";

import AuthForm from "../AuthForm/AuthForm";
import { useFetch } from "../../../hooks/fetch/fetch";
import { AppContext } from "../../../utils/context";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState();

  const { createUser } = useFetch();
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

  const signupUser = (e) => {
    e.preventDefault();

    createUser(input)
      .then((res) => {
        if (res) {
          if (res.user) {
            login(res.user._id.toString(), res.user.username, res.token);
          } else {
            window.scroll({ top: 0, behavior: "smooth" });
            setErrorMessage(res.message);
          }
        }
      })
      .catch((err) => {
        console.log(err)
      });
  };

  return (
    <AuthForm onSubmit={signupUser} title="Sign Up" buttonName="SIGN UP">
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
      <label>Username</label>
      <input
        onChange={changeInputHandler}
        value={input.username}
        name="username"
        type="text"
        placeholder="Enter your username"
        autoFocus
        autoComplete="off"
      />
      <label>Email</label>
      <input
        onChange={changeInputHandler}
        value={input.email}
        name="email"
        type="email"
        placeholder="Enter your email"
        autoComplete="new-email"
      />
      <label>Password</label>
      <input
        onChange={changeInputHandler}
        value={input.password}
        name="password"
        type="password"
        placeholder="Enter your password"
      />
    </AuthForm>
  );
};

export default Signup;
