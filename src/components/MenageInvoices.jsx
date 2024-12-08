import React, { useState, useEffect, useContext } from "react";

import renderToast from "../utils/renderToast";
import { config } from "../config";
import { LoginContext } from "../contexts/LoginContext";
import InvoicesStats from "./InvoicesStats";

import "react-toastify/dist/ReactToastify.css";
import "../pages/styles/MenageInvoices.css";

const apiUrl = config.API_URL;

function MenageInvoices() {
  const { bearerToken } = useContext(LoginContext);
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    invoiceId: "",
    date: "",
    totalPrice: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/invoices`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${bearerToken}`,
          },
        });

        const { data } = await res.json();
        setInvoices(data.docs);
        setFilteredInvoices(data.docs);
      } catch (error) {
        renderToast("Error fetching invoices.", "error");
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, [bearerToken]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    const filtered = invoices.filter((invoice) => {
      return (
        (filters.status ? invoice.status.includes(filters.status) : true) &&
        (filters.invoiceId ? invoice._id.includes(filters.invoiceId) : true) &&
        (filters.date ? invoice.createdAt.includes(filters.date) : true) &&
        (filters.totalPrice
          ? invoice.totalPrice >= Number(filters.totalPrice)
          : true)
      );
    });
    setFilteredInvoices(filtered);
    setCurrentPage(1);
  };

  // pagination
  const indexOfLastInvoice = currentPage * itemsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="menage-invoices-container">
      <InvoicesStats invoices={invoices} />

      <div className="filter-invoices-box">
        <input
          type="text"
          name="invoiceId"
          placeholder="Invoice ID"
          value={filters.invoiceId}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="status"
          placeholder="Status (pending, canceled, complete)"
          value={filters.status}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="totalPrice"
          placeholder="Min Total Price"
          value={filters.totalPrice}
          onChange={handleFilterChange}
        />
        <select
          className="items-per-page-select"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>

      {/* Table Section */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Invoice Id</th>
            <th>User/Guest Id</th>
            <th>Listings</th>
            <th>Shipping Type</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {currentInvoices.map((invoice) => (
            <tr key={invoice._id}>
              <td>{invoice._id}</td>
              <td>
                {invoice.user
                  ? `${invoice.user}`
                  : `${invoice.guestInfo?.fullName} (${invoice.guestInfo?.email})`}
              </td>
              <td>
                {invoice.listings.map((item, index) => (
                  <div key={index}>
                    {item.title} (x{item.amount})
                  </div>
                ))}
              </td>
              <td>{invoice.shippingOpt?.shippingType || "N/A"}</td>
              <td>${invoice.totalPrice.toFixed(2)}</td>
              <td>{invoice.status}</td>
              <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination-container">
        {Array.from(
          { length: Math.ceil(filteredInvoices.length / itemsPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              className={`pagination-btn ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default MenageInvoices;
