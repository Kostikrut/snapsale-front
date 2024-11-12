import React, { useContext } from "react";

import { CartContext } from "../contexts/CartContext";
import { LoginContext } from "../contexts/LoginContext";
import { config } from "../config";
import renderToast from "../utils/renderToast";

import "react-toastify/dist/ReactToastify.css";
import "./styles/Cart.css";

const apiUrl = config.API_URL;

const Cart = () => {
  const { bearerToken } = useContext(LoginContext);
  const { cart, removeFromCart, updateAmount, clearCart } =
    useContext(CartContext);

  const createInvoiceAndRedirect = async (e) => {
    e.preventDefault();

    if (!bearerToken) {
      window.location.href = "/guest-checkout";
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/v1/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${bearerToken}` || "",
        },
        body: JSON.stringify({ cart }),
      });

      const data = await res.json();
      if (!res.ok) throw data;

      window.location.href = `/shippingAndCheckout/${data.data.invoice._id}`;
    } catch (err) {
      renderToast(
        "error",
        err.message || "Couldnt create invoice, please try again later."
      );
    }
  };

  const calcSummary = () => {
    let sum = 0,
      amount = 0;

    cart.forEach((product) => {
      sum += product.price * product.amount;
      amount += product.amount;
    });

    return (
      <p className="summary">
        Total pay of {`${sum.toFixed(2)}`} $ for {`${amount}`} items
      </p>
    );
  };

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p className="cart-empty-message">Your cart is empty</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item, i) => (
              <li key={item._id + i}>
                <img
                  className="cart-item-img"
                  src={item.image.url}
                  alt={item.title}
                />
                <span className="cart-item-name">{`${
                  item.title +
                  " " +
                  item.variants.map((variant) => variant.type).join(", ")
                }`}</span>
                <span className="cart-item-price">
                  ${item.price.toFixed(2)}
                </span>
                <div className="amount-container">
                  <button onClick={() => updateAmount(item, "+")}>+</button>{" "}
                  <span className="cart-item-amount">{item.amount}</span>
                  <button
                    onClick={() => updateAmount(item, "-")}
                    disabled={item.amount <= 1}
                  >
                    -
                  </button>
                </div>
                <button
                  className="cart-remove-button"
                  onClick={() => removeFromCart(item)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            {cart.length > 0 ? calcSummary() : ""}
          </div>
        </>
      )}

      {cart.length > 0 && (
        <>
          <button
            className="cart-order-button"
            onClick={createInvoiceAndRedirect}
          >
            Proceed To Checkout
          </button>
          <button className="cart-clear-button" onClick={clearCart}>
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
