import React, { useEffect, useRef, useState } from "react";

import FlashMsg from "../UI/FlashMsg/FlashMsg";
import Button from "../UI/Button/Button";
import Loading from "../UI/Loading/Loading";
import { useFetch } from "../../hooks/fetch/fetch";

import avatarLogo from "./avatar.png";
import "./Profile.css";

const Profile = ({ setNavAvatar }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [avatar, setAvatar] = useState();
  const [oldAvatar, setOldAvatar] = useState();
  const [input, setInput] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    image: ""
  });
  const fileInput = useRef();
  const { getUser, updateProfile, isLoading, errorMessage } = useFetch();

  useEffect(() => {
    getUser()
      .then((res) => {
        if (res) {
          setInput((prevState) => {
            return { ...prevState, email: res.user.email };
          });
          setOldAvatar(res.user.avatar);
          setAvatar(res.user.avatar);
        }
      })
      .catch((err) => console.log(err));

    return () => {
      setMessage("");
      setError(false);
    };
  }, [getUser, setNavAvatar]);

  useEffect(() => {
    if (!input.image) {
      return;
    }

    let fileReader;

    if (input.image) {
      fileReader = new FileReader();

      fileReader.readAsDataURL(input.image);
      fileReader.onloadend = () => {
        fileReader.onerror = (err) => {
          if (err) {
            return console.log(err);
          }
        };

        setAvatar(fileReader.result);
      };
    }

    return () => {
      fileReader.abort();

      setInput({
        email: "",
        newPassword: "",
        oldPassword: "",
        image: ""
      });
    };
  }, [input.image]);

  const changeInputHandler = (e) => {
    const { value, name } = e.target;

    setInput((prevState) => {
      return {
        ...prevState,
        [name]: value
      };
    });
  };

  const fileChangeHandler = (e) => {
    if (e.target.files && e.target.files.length === 1) {
      setInput((prevState) => {
        return { ...prevState, image: e.target.files[0] };
      });
    } else if (!e.target.files || e.target.files.length === 0) {
      setInput((prevState) => {
        return { ...prevState, image: null };
      });
      setAvatar(null);
    }
  };

  const updateProfileHandler = (e) => {
    e.preventDefault();

    setError(null);

    const formData = new FormData();
    formData.append("email", input.email);
    formData.append("oldPassword", input.oldPassword);
    formData.append("newPassword", input.newPassword);
    formData.append("oldAvatar", oldAvatar);
    formData.append("avatar", input.image);

    updateProfile(formData)
      .then((res) => {
        if (!res) {
          throw new Error("Profile update failed!");
        }

        setMessage("Profile updated successfully!");
        setOldAvatar("");
        setInput({
          email: "",
          newPassword: "",
          oldPassword: "",
          image: ""
        });

        setTimeout(() => {
          setNavAvatar(res.user.avatar);
        }, 800);
      })
      .catch((err) => {
        setMessage(err.message);
        setError(true);
      });
  };

  return (
    <form className="profile">
      {isLoading && <Loading />}

      {message && !isLoading && (
        <FlashMsg
          error={error}
          show={message.length > 0}
          message={message + " " + errorMessage}
          onClick={() => setMessage(false)}
        />
      )}

      {!isLoading && (
        <>
          <div className="profile__image">
            <img src={avatar ? avatar : avatarLogo} alt="avatar" />

            <input
              type="file"
              hidden
              name="avatar"
              ref={fileInput}
              onChange={fileChangeHandler}
            />

            <button type="button" onClick={() => fileInput.current.click()}>
              Change Avatar
            </button>
          </div>

          <div className="profile__details">
            <div>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={changeInputHandler}
                placeholder="Enter new email address"
                autoComplete="off"
              />
            </div>

            <div>
              <label>Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={input.oldPassword}
                onChange={changeInputHandler}
                placeholder="Enter old password"
              />
            </div>

            <div>
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={input.newPassword}
                onChange={changeInputHandler}
                placeholder="Enter new password"
              />
            </div>
          </div>

          <Button
            type="submit"
            onClick={updateProfileHandler}
            buttonName="UPDATE PROFILE"
          />
        </>
      )}
    </form>
  );
};

export default Profile;
