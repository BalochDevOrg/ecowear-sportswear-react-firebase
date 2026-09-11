import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllOrders } from "../../services/orders";

const statusAccent = {
  pending: "#f5c878",
  processing: "#79cfff",
  shipped: "#bdf6dd",
  delivered: "#1dbf8b",
  cancelled: "#ff9696",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch {
      setError("Could not load orders. Check Firebase rules and that your account has admin role.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const highlightIfUnread = (order) => order.adminRead === false || order.adminRead === undefined;

  return (
    <div className="admin-page-shell">
      <header className="admin-page-intro">
        <span className="admin-pill-heading">Orders</span>
        <div className="admin-page-head-grid">
          <div>
            <h1>All orders</h1>
            <p>
              List comes from Firestore. New orders are counted as unread on the dashboard until you open the order detail
              page. Emails are not sent by default (see README if you want to add them).
            </p>
          </div>
          <button type="button" className="admin-ghost-btn compact" onClick={loadOrders} disabled={loading}>
            Refresh list
          </button>
        </div>
      </header>

      {loading ? (
        <p className="admin-muted-copy">Loading orders...</p>
      ) : error ? (
        <p style={{ color: "#ff9b9b" }}>{error}</p>
      ) : orders.length === 0 ? (
        <div className="panel-card admin-empty-card">
          <h2>No orders yet.</h2>
          <p>When a customer completes checkout, their order will show up here.</p>
        </div>
      ) : (
        <div className="orders-board">
          {orders.map((order) => (
            <article
              key={order.id}
              className={["panel-card orders-row", highlightIfUnread(order) ? "orders-row-hot" : ""].join(
                " "
              )}
            >
              <div className="orders-row-meta">
                <div>
                  <p className="orders-id">Order #{order.id}</p>
                  <p style={{ margin: "6px 0 12px", color: "#cfd8d4" }}>
                    {order.customerName} ·{" "}
                    <a className="admin-inline-link" href={`mailto:${order.email}`}>
                      {order.email}
                    </a>
                  </p>
                  <span
                    className="pill-status-solid"
                    style={{ backgroundColor: statusAccent[order.status] ?? "#dfe7e2", color: "#071411" }}
                  >
                    {order.status ?? "UNKNOWN"}
                  </span>
                  {highlightIfUnread(order) ? (
                    <span className="orders-new-chip">New</span>
                  ) : null}
                </div>
                <div className="orders-row-actions">
                  <div>
                    <span className="orders-value-label">Order total</span>
                    <p className="orders-value">£{Number(order.total ?? 0).toFixed(2)}</p>
                  </div>
                  <Link className="admin-primary-btn shrink" to={`/admin/orders/${order.id}`}>
                    View details
                  </Link>
                </div>
              </div>
              <div className="orders-items-preview">
                <p className="orders-preview-label">Items</p>
                <div className="orders-preview-line">
                  {order.items?.map((item, idx) => (
                    <span key={idx}>
                      {item.title} × {item.quantity}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
