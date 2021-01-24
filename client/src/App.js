import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";

import Navbar from "./components/UI/Navbar/Navbar";
import Footer from "./components/UI/Footer/Footer";
import Routes from "./components/Routes/Routes";
import NavBlock from "./components/UI/Navbar/NavBlock/NavBlock";
import { AppContext } from "./utils/context";
import { useAuth } from "./hooks/auth";

import "./App.css";

const App = () => {
  const [avatar, setAvatar] = useState("");
  const { login, logout, userId, username, token } = useAuth();

  return (
    <AppContext.Provider value={{ token, username, userId, logout, login }}>
      <BrowserRouter>
        <Navbar avatar={avatar} setAvatar={setAvatar} />
        <NavBlock />
        <Routes setAvatar={setAvatar} />
        <Footer />
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
