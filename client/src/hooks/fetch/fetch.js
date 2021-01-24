import { useCallback, useContext, useState } from "react";

import { AppContext } from "../../utils/context";

export const useFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { token, userId } = useContext(AppContext);

  const createUser = useCallback(async (userData) => {
    setIsLoading(true);

    let resData;

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message);
      }

      setIsLoading(false);

      if (resData) {
        return resData;
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message);
    }
  }, []);

  const loginUser = useCallback(async (userData) => {
    setIsLoading(true);

    let resData;

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      resData = await res.json();

      if (resData) {
        if (!res.ok) {
          throw new Error(resData.message);
        }

        setIsLoading(false);

        return resData;
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message);
    }
  }, []);

  const getUser = useCallback(async () => {
    setIsLoading(true);

    let resData;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      resData = await res.json();

      if (resData) {
        if (!res.ok) {
          throw new Error(resData.message);
        }

        setIsLoading(false);

        return resData;
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message);
    }
  }, [userId, token]);

  const updateProfile = useCallback(
    async (userData) => {
      setIsLoading(true);
      setErrorMessage("");

      let resData;

      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/profile/${userId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: userData
          }
        );

        resData = await res.json();

        if (resData) {
          if (!res.ok) {
            throw new Error(resData.message);
          }

          setIsLoading(false);

          return resData;
        }
      } catch (err) {
        setIsLoading(false);
        setErrorMessage(err.message);
      }
    },
    [userId, token]
  );

  const createProduct = useCallback(
    async (productData) => {
      setIsLoading(true);

      let resData;

      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/add-product`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: productData
          }
        );

        resData = await res.json();

        if (!res.ok) {
          throw new Error(resData);
        }

        setIsLoading(false);

        if (resData) {
          return resData;
        }
      } catch (err) {
        setIsLoading(false);
        setErrorMessage(err.message);
      }
    },
    [token]
  );

  const updateProduct = useCallback(
    async (prodId, productData) => {
      setIsLoading(true);

      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/products/${userId}/product/${prodId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: productData
          }
        );

        const resData = await res.json();

        if (!res.ok) {
          throw new Error(resData);
        }

        setIsLoading(false);

        if (resData) {
          return resData;
        }
      } catch (err) {
        setIsLoading(false);
        setErrorMessage(err.message);
      }
    },
    [token, userId]
  );

  const deleteProduct = useCallback(
    async (prodId) => {
      setIsLoading(true);

      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/products/${userId}/product/${prodId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const resData = await res.json();

        if (!res.ok) {
          throw new Error(resData);
        }

        setIsLoading(false);

        if (resData) {
          return resData;
        }
      } catch (err) {
        setIsLoading(false);
        setErrorMessage(err.message);
      }
    },
    [token, userId]
  );

  const getProducts = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/products`);

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData);
      }

      setIsLoading(false);

      if (resData) {
        return resData;
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message);
    }
  }, []);

  const getProduct = useCallback(async (prodId) => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/product/${prodId}`
      );

      const resData = await res.json();

      if (resData) {
        if (!res.ok) {
          throw new Error(resData);
        }

        setIsLoading(false);

        return resData;
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message);
    }
  }, []);

  const getUserProducts = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/products/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const resData = await res.json();

      if (resData) {
        if (!res.ok) {
          throw new Error(resData);
        }

        setIsLoading(false);

        return resData;
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message);
    }
  }, [token, userId]);

  const addToCart = useCallback(
    async (productData) => {
      setIsLoading(true);

      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/add-to-cart/${userId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
          }
        );

        const resData = await res.json();

        if (resData) {
          if (!res.ok) {
            throw new Error(resData.message);
          }

          setIsLoading(false);

          return resData;
        }
      } catch (err) {
        setIsLoading(false);
        setErrorMessage(err.message);
      }
    },
    [token, userId]
  );

  const getUserCart = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/cart/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const resData = await res.json();

      if (resData) {
        if (!res.ok) {
          throw new Error(resData);
        }

        setIsLoading(false);

        return resData;
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message);
    }
  }, [token, userId]);

  const removeCartItem = useCallback(
    async (prodId) => {
      setIsLoading(true);

      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/cart/${userId}/product/${prodId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const resData = await res.json();

        if (resData) {
          if (!res.ok) {
            throw new Error(resData);
          }

          setIsLoading(false);

          return resData;
        }
      } catch (err) {
        setIsLoading(false);
        setErrorMessage(err.message);
      }
    },
    [token, userId]
  );

  const addToWishlist = useCallback(
    async (prodId) => {
      setIsLoading(true);

      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/product/${prodId}/wishlist/${userId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const resData = await res.json();

        if (resData) {
          if (!res.ok) {
            throw new Error(resData);
          }

          setIsLoading(false);

          return resData;
        }
      } catch (err) {}
    },
    [token, userId]
  );

  const getWishlist = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/wishlist/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const resData = await res.json();

      if (resData) {
        if (!res.ok) {
          throw new Error(resData);
        }

        setIsLoading(false);

        return resData;
      }
    } catch (err) {}
  }, [token, userId]);

  const removeWishListItem = useCallback(
    async (prodId) => {
      setIsLoading(true);

      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/wishlist/${userId}/product/${prodId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const resData = await res.json();

        if (resData) {
          if (!res.ok) {
            throw new Error(resData);
          }

          setIsLoading(false);

          return resData;
        }
      } catch (err) {}
    },
    [token, userId]
  );

  const getOrders = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/orders/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const resData = await res.json();

      if (resData) {
        if (!res.ok) {
          throw new Error(resData.message);
        }

        setIsLoading(false);

        return resData;
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message);
    }
  }, [token, userId]);

  const calculateRating = useCallback(
    async (prodId, rating) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/product/${prodId}/rating/${userId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ userRating: rating })
          }
        );

        const resData = await res.json();

        if (resData) {
          if (!res.ok) {
            throw new Error(resData.message);
          }

          setIsLoading(false);

          return resData;
        }
      } catch (err) {
        setIsLoading(false);
        setErrorMessage(err.message);
      }
    },
    [token, userId]
  );

  return {
    createUser,
    loginUser,
    getUser,
    updateProfile,
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProduct,
    getUserProducts,
    addToCart,
    getUserCart,
    removeCartItem,
    addToWishlist,
    getWishlist,
    removeWishListItem,
    getOrders,
    calculateRating,
    isLoading,
    errorMessage
  };
};
