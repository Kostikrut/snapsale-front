import { useState } from "react";
import AccountSettings from "./AccountSettings";
import PurchaseHistory from "./PurchaseHistory";
import WebSettings from "./WebSettings";
import "./styles/AccountLayout.css";

function AccountLayout() {
  const [selectAccSettings, setSelectAccSettings] = useState(true);
  const [selectPurchaseHistory, setSelectPurchaseHistory] = useState(false);
  const [selectWebSettings, setSelectWebSettings] = useState(false);

  const switchToAccSettings = () => {
    setSelectAccSettings(true);
    setSelectPurchaseHistory(false);
    setSelectWebSettings(false);
  };

  const switchPurchaseHistory = () => {
    setSelectAccSettings(false);
    setSelectPurchaseHistory(true);
    setSelectWebSettings(false);
  };

  const switchToWebSettings = () => {
    setSelectAccSettings(false);
    setSelectPurchaseHistory(false);
    setSelectWebSettings(true);
  };

  return (
    <div className="account-references">
      <aside className="account-sidebar">
        <ul className="sidebar-links">
          <li className={`sidebar-link ${selectAccSettings ? "active" : ""}`}>
            <button onClick={switchToAccSettings}>Account Settings</button>
          </li>
          <li
            className={`sidebar-link ${selectPurchaseHistory ? "active" : ""}`}
          >
            <button onClick={switchPurchaseHistory}>Purchase History</button>
          </li>
          <li className={`sidebar-link ${selectWebSettings ? "active" : ""}`}>
            <button onClick={switchToWebSettings}>Web Settings</button>
          </li>
        </ul>
      </aside>
      <div className="account-content">
        {selectAccSettings && <AccountSettings />}
        {selectPurchaseHistory && <PurchaseHistory />}
        {selectWebSettings && <WebSettings />}
      </div>
    </div>
  );
}

export default AccountLayout;
