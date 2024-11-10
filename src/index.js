import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";

import { CartProvider } from "./contexts/CartContext";
import { LoginProvider } from "./contexts/LoginContext";
import { LoadingProvider } from "./contexts/LoadingContext";

import App from "./App";
import { FavoritesProvider } from "./contexts/FavoritesContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LoadingProvider>
      <LoginProvider>
        <CartProvider>
          <FavoritesProvider>
            <ToastContainer />
            <App />
          </FavoritesProvider>
        </CartProvider>
      </LoginProvider>
    </LoadingProvider>
  </React.StrictMode>
);
