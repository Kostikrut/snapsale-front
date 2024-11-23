import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";
import { useLoading } from "../contexts/LoadingContext";

import InvoiceDetails from "../components/InvoiceDetails";
import Loading from "../components/Loading";
import renderToast from "../utils/renderToast";
import { config } from "../config";

import "./styles/PurchaseHistory.css";

function PurchaseHistory() {
  const { bearerToken } = useContext(LoginContext);
  const [invoicesList, setInvoicesList] = useState([]);
  const { loading, showLoading, hideLoading } = useLoading();

  const apiUrl = config.API_URL;

  useEffect(() => {
    showLoading();
    const getInvoices = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/api/v1/invoices/getPurchaseHistory`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );

        const invoices = await res.json();

        if (!res.ok) throw invoices;

        if (invoices.data) {
          setInvoicesList(invoices.data);
        } else {
          renderToast("info", "No invoices found.");
        }
      } catch (err) {
        renderToast(
          "error",
          err.message || "An error occurred while getting invoices."
        );
      } finally {
        hideLoading();
      }
    };

    getInvoices();
  }, [apiUrl, bearerToken, showLoading, hideLoading]);

  return (
    <div className="invoice-list">
      {loading ? (
        <Loading />
      ) : invoicesList.length > 0 ? (
        invoicesList.map((invoice) => (
          <InvoiceDetails key={invoice._id} invoice={invoice} />
        ))
      ) : (
        <div className="no-purchase-history">
          <div className="message">
            <h2>No Purchase History</h2>
            <p>
              Looks like you haven’t made any purchases yet. Start shopping to
              see your order history here!
            </p>
            <Link to="/">
              <button className="shop-now-button">Shop Now</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchaseHistory;
