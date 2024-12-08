import "../pages/styles/InvoicesStats.css";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function InvoicesStats({ invoices }) {
  const [invoicesPerDay, setInvoicesPerDay] = useState({});
  const [invoicesByStatus, setInvoicesByStatus] = useState({});
  const [avgInvoicePrice, setAvgInvoicePrice] = useState(0);
  const [avgListingsPerInvoice, setAvgListingsPerInvoice] = useState(0);
  const [invoicesByShipping, setInvoicesByShipping] = useState({});

  const data = {
    labels: ["January", "February", "March"],
    datasets: [
      {
        label: "Invoices",
        data: [5, 10, 7],
        backgroundColor: "#124e66",
        borderColor: "#124e66",
        fill: false,
      },
    ],
  };

  useEffect(() => {
    if (invoices.length === 0) return;

    const dailyInvoices = {};
    invoices.forEach((invoice) => {
      const date = new Date(invoice.createdAt).toLocaleDateString();
      dailyInvoices[date] = (dailyInvoices[date] || 0) + 1;
    });
    setInvoicesPerDay(dailyInvoices);

    const statusCounts = {};
    invoices.forEach((invoice) => {
      statusCounts[invoice.status] = (statusCounts[invoice.status] || 0) + 1;
    });
    setInvoicesByStatus(statusCounts);

    const totalPriceSum = invoices.reduce(
      (sum, invoice) => sum + invoice.totalPrice,
      0
    );
    setAvgInvoicePrice((totalPriceSum / invoices.length).toFixed(2));

    const totalListings = invoices.reduce(
      (sum, invoice) => sum + invoice.listings.length,
      0
    );
    setAvgListingsPerInvoice((totalListings / invoices.length).toFixed(2));

    const shippingCounts = {};
    invoices.forEach((invoice) => {
      const type = invoice.shippingOpt?.shippingType || "N/A";
      shippingCounts[type] = (shippingCounts[type] || 0) + 1;
    });
    setInvoicesByShipping(shippingCounts);
  }, [invoices]);

  return (
    <div className="invoices-stats-container">
      <h2>Invoices Statistics</h2>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Average Invoice Price</h3>
          <p>${avgInvoicePrice}</p>
        </div>

        <div className="stat-card">
          <h3>Average Listings Per Invoice</h3>
          <p>{avgListingsPerInvoice}</p>
        </div>

        <div className="stat-card">
          <h3>Invoices Per Day</h3>
          <div className="stat-card">
            <h3>Invoices Per Day</h3>
            <Line
              data={{
                labels: Object.keys(invoicesPerDay),
                datasets: [
                  {
                    label: "Invoices",
                    data: Object.values(invoicesPerDay),
                    backgroundColor: "#124e66",
                    borderColor: "#124e66",
                    fill: false,
                  },
                ],
              }}
            />
          </div>
        </div>

        <div className="stat-card">
          <h3>Invoices by Status</h3>
          <Bar
            data={{
              labels: Object.keys(invoicesByStatus),
              datasets: [
                {
                  label: "Count",
                  data: Object.values(invoicesByStatus),
                  backgroundColor: "#124e66",
                },
              ],
            }}
          />
        </div>

        <div className="stat-card">
          <h3>Invoices by Shipping Type</h3>
          <Bar
            data={{
              labels: Object.keys(invoicesByShipping),
              datasets: [
                {
                  label: "Count",
                  data: Object.values(invoicesByShipping),
                  backgroundColor: "#124e66",
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default InvoicesStats;
