import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { useLoading } from "../contexts/LoadingContext";

import InvoiceDetails from "../components/InvoiceDetails";
import renderToast from "../utils/renderToast";
import { config } from "../config";

import "./styles/PurchaseHistory.css";
import Loading from "../components/Loading";

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
        <p>No purchase history available.</p>
      )}
    </div>
  );
}

export default PurchaseHistory;
