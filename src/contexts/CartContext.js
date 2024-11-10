import { createContext, useState, useEffect } from "react";

import renderToast from "../utils/renderToast";
import useFetchUrls from "../hooks/useFetchUrls";

export const CartContext = createContext();

const calcVariantsTotal = (item) => {
  item.price =
    item.price +
    item?.variants.reduce((acc, variant) => acc + Number(variant.price), 0);

  return item;
};

const isSameItem = (cartItem, itemObj) => {
  if (cartItem._id !== itemObj._id) return false;

  return (
    cartItem.variants.length === itemObj.variants.length &&
    cartItem.variants.every((cartVariant, index) => {
      const itemVariant = itemObj.variants[index];
      return (
        cartVariant.name === itemVariant.name &&
        cartVariant.type === itemVariant.type
      );
    })
  );
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  useFetchUrls(cart, "cart");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const addToCart = (itemObj) => {
    const itemIndexInCart = cart.find((cartItem) =>
      isSameItem(cartItem, itemObj)
    );

    if (itemIndexInCart) return renderToast("info", "Product already in cart");

    const updatedItem = calcVariantsTotal(itemObj);
    const updatedCart = [...cart, { ...updatedItem, amount: 1 }];

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    renderToast("success", "Product added to cart");
  };

  const updateAmount = (itemObj, action) => {
    const updatedCart = cart.map((cartItem) => {
      if (isSameItem(cartItem, itemObj)) {
        const newAmount =
          action === "+" ? cartItem.amount + 1 : cartItem.amount - 1;

        if (newAmount < 1) {
          renderToast("warning", "Quantity must be at least 1");
          return cartItem;
        }

        return { ...cartItem, amount: newAmount };
      }

      return cartItem;
    });

    if (updatedCart !== cart) {
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (itemObj) => {
    const updatedCart = cart.filter(
      (cartItem) => !isSameItem(cartItem, itemObj)
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    renderToast("info", "Product removed from cart");
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateAmount, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// useEffect(() => {
//   const getImages = async () => {
//     const storedCart = JSON.parse(localStorage.getItem("cart"));
//     if (!storedCart) return;

//     const imagesName = storedCart.map((listing) => listing.image.filename);

//     try {
//       const urls = await fetchImagesUrls(imagesName);
//       urls.forEach((url, i) => (storedCart[i].image.url = url));
//     } catch (err) {
//       console.error(
//         err.message || "Couldn't get images, please try again later."
//       );
//     }

//     setCart(storedCart);
//   };

//   getImages();
// }, []);
