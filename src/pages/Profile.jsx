import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrdersByUser } from "../services/orders";

const statusTone = {
  pending: "#f5c878",
  processing: "#7ec8ff",
  shipped: "#b8f3dc",
  delivered: "#1dbf8b",
  cancelled: "#ffb3b3",
};

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!user?.uid) return;

      try {
        const data = await getOrdersByUser(user.uid);
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user]);

  return (
    <div className="page-dark">
      <div className="page-dark-inner narrow">
        <div style={{ marginBottom: "24px" }}>
          <p className="auth-badge inline-badge">EcoWear shopper</p>
          <h1 style={{ fontSize: "52px", margin: "14px 0 8px 0" }}>Account overview</h1>
          <p style={{ margin: 0, color: "#a8b3ad", fontSize: "17px", lineHeight: 1.6 }}>
            Purchases persist in Firestore. Email/SMS confirmations are optional extensions (see README).
          </p>
        </div>

        <div className="panel-card profile-hero-grid">
          <div>
            <p style={{ color: "#8fa19a", marginTop: 0, marginBottom: "8px" }}>Logged in</p>
            <h2 style={{ margin: "0 0 14px", fontSize: "30px" }}>{user?.name || "EcoWear shopper"}</h2>
            <p style={{ margin: "0 0 6px", color: "#dfe7e2" }}>
              <strong>Email:</strong> {user?.email || "—"}
            </p>
            <p style={{ margin: 0, color: "#dfe7e2" }}>
              <strong>Account type:</strong> {user?.role === "admin" ? "Staff (admin Console)" : "Customer"}
            </p>
          </div>
          <div className="profile-actions-stack">
            <Link to="/shop" className="btn-solid-wide muted-outline">
              Shop products
            </Link>
            <Link to="/cart" className="btn-solid-wide">
              View basket
            </Link>
          </div>
        </div>

        <h2 style={{ marginTop: "36px", fontSize: "32px", marginBottom: "16px" }}>Order timeline</h2>

        {loading ? (
          <p style={{ color: "#a8b3ad" }}>Loading personalised orders...</p>
        ) : orders.length === 0 ? (
          <div className="panel-card">
            <p style={{ marginTop: 0 }}>Your shelf is sparkling — zero orders logged yet.</p>
            <p style={{ marginBottom: "18px", color: "#a8b3ad", lineHeight: 1.6 }}>
              Checkout requires login; once you ship an order through the checkout flow its Firestore timeline
              appears automatically here.
            </p>
            <Link to="/shop" className="btn-solid-wide">
              Discover collection
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {orders.map((order) => (
              <div key={order.id} className="panel-card profile-order-card">
                <div className="profile-order-grid">
                  <div>
                    <p style={{ color: "#8fa19a", marginTop: 0, marginBottom: "10px", fontSize: "14px" }}>
                      EcoWear fulfilment timeline
                    </p>
                    <p style={{ margin: "0 0 6px", wordBreak: "break-all" }}>
                      <strong style={{ fontSize: "16px", color: "#dfe7e2" }}>Confirmation ID</strong>
                      <span style={{ color: "#a8b3ad", marginLeft: "8px", fontFamily: "ui-monospace" }}>
                        {order.id}
                      </span>
                    </p>

                    <p style={{ margin: "0 0 6px" }}>
                      <strong>Spend:</strong> £{Number(order.total).toFixed(2)}{" "}
                      <span style={{ color: "#8fa19a", marginLeft: "8px" }}>
                        (£{Number(order.subtotal).toFixed(2)} merchandise + £
                        {Number(order.shipping ?? 0).toFixed(2)} shipping snapshot)
                      </span>
                    </p>

                    <span
                      className="pill-status"
                      style={{
                        marginTop: "12px",
                        display: "inline-flex",
                        color: "#071411",
                        background: statusTone[order.status] || "#dfe7e2",
                      }}
                    >
                      {order.status?.toUpperCase?.() ?? "PROCESSING"}
                    </span>

                    <p style={{ color: "#8fa19a", marginTop: "16px", fontSize: "14px", marginBottom: 0 }}>
                      Timestamps hydrate after Firestore merges — admins update status from Operations → Orders.
                    </p>
                  </div>

                  <div style={{ alignSelf: "start" }}>
                    <p style={{ color: "#8fa19a", marginTop: 0, marginBottom: "12px", fontWeight: "600" }}>
                      Items
                    </p>
                    <ul className="order-item-list">
                      {order.items?.map((item, index) => (
                        <li key={index}>
                          <span>{item.title}</span>
                          <strong>
                            {item.quantity} × £{Number(item.price ?? 0).toFixed(2)}
                          </strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
