import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import Category from "./pages/Category";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import ShippingAndCheckout from "./components/ShippingAndCheckout";
import PaymentSuccess from "./pages/PaymentSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import NotFoundPage from "./pages/NotFoundPage";

import "./App.css";
import FavoritesPage from "./pages/FavoritesPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import GuestCheckoutPage from "./pages/GuestCheckoutPage";
import FAQPage from "./pages/FAQ";
import ReturnsPage from "./pages/Returns";
import ShippingAndDelivery from "./pages/ShippingAndDelivery";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/category/:category" element={<Category />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/guest-checkout" element={<GuestCheckoutPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/account" element={<Account />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/shipping" element={<ShippingAndDelivery />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route
              path="/resetPassword/:token"
              element={<ResetPasswordPage />}
            />
            <Route
              path="/shippingAndCheckout/:invoiceId"
              element={<ShippingAndCheckout />}
            />
            <Route path="/paymentSuccess" element={<PaymentSuccess />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
