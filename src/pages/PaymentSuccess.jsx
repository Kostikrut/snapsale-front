import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { CartContext } from "../contexts/CartContext";
import { config } from "../config";

import "./styles/PaymentSuccess.css";

const apiUrl = config.API_URL;

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get("invoice");
  const [invoiceData, setInvoiceData] = useState(null);
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    const getSession = async () => {
      const checkout = await fetch(
        `${apiUrl}/api/v1/invoices/${invoiceId}/retrieveCheckoutAndUpdateInvoice`
      );

      const checkoutSession = await checkout.json();

      if (
        checkoutSession.isPaid === "Yes" &&
        checkoutSession.status !== "complete"
      )
        return (window.location.href = "/");

      setInvoiceData(checkoutSession.data);
      clearCart();
    };

    getSession();
  }, [invoiceId, clearCart]);

  if (!invoiceData) return <div>Loading...</div>;

  const { listings, totalPrice, currency, status, createdAt } = invoiceData;

  return (
    <div className="payment-success">
      <h1>Payment Successful!</h1>
      <p>Invoice ID: {invoiceId}</p>
      <p>Status: {status}</p>
      <p>Payment Date: {new Date(createdAt).toLocaleDateString()}</p>
      <p>
        Total Paid: {totalPrice.toFixed(2)} {currency}
      </p>
      <div className="listings">
        <h2>Purchased Items</h2>
        <ul>
          {listings.map((item, index) => (
            <li key={index}>
              <strong>Item #{index + 1}: </strong>
              {item.brand +
                " " +
                item.title +
                " " +
                item?.variants
                  .map((variant) => variant.name + ": " + variant.type)
                  .join(", ")}
              , Quatity :{item.amount}
            </li>
          ))}
        </ul>
      </div>
      <p>Thank you for your purchase!</p>
      <p>
        Feel free to rate the items and leave a review. You can access the the
        functionality in you account dashboard under the Purchase History
        section.
      </p>
    </div>
  );
}

export default PaymentSuccess;
