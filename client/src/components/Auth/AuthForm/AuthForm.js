import React from "react";

import Button from "../../UI/Button/Button";
import Loading from "../../UI/Loading/Loading";
import { useFetch } from "../../../hooks/fetch/fetch";

import "./AuthForm.css";

const AuthForm = ({ title, children, onSubmit, buttonName }) => {
  const { isLoading } = useFetch();

  return (
    <form className="authForm" onSubmit={onSubmit}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <h2>{title}</h2>
          {children}
          <Button type="submit" buttonName={buttonName} />
        </>
      )}
    </form>
  );
};

export default AuthForm;
