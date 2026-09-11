import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById, updateOrderStatus, markOrderAdminRead } from "../../services/orders";
import { shippingAddressEntries } from "../../utils/shippingDisplay";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

function statusLabel(code) {
  if (!code) return "Pending";
  return code.charAt(0).toUpperCase() + code.slice(1);
}

export default function AdminOrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const hydrate = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getOrderById(orderId);
      if (!data) {
        setError("Order not found.");
        setOrder(null);
        return;
      }
      setOrder(data);
      await markOrderAdminRead(orderId);
    } catch {
      setError("Could not load this order.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  async function handleStatus(next) {
    if (!next || !order) return;

    try {
      setBusy(true);
      await updateOrderStatus(orderId, next);
      await hydrate();
    } catch {
      alert("Could not update order status. Check Firestore rules and that your account has admin role.");
    } finally {
      setBusy(false);
    }
  }

  const addressLines = order ? shippingAddressEntries(order.shippingAddress) : [];

  if (loading) {
    return (
      <div className="admin-page-shell">
        <p className="admin-muted-copy">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="admin-page-shell">
        <div className="panel-card admin-empty-card">
          <h2>Unable to load order</h2>
          <p>{error}</p>
          <Link className="admin-primary-btn shrink" to="/admin/orders">
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-shell order-detail-shell">
      <div className="order-detail-actions">
        <Link className="admin-back-inline" to="/admin/orders">
          ← Back to orders
        </Link>

        <div className="order-status-toolbar">
          <label className="order-status-dropdown">
            <span>Order status</span>
            <select value={order.status || "pending"} disabled={busy} onChange={(e) => handleStatus(e.target.value)}>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="order-detail-heading">
        <div>
          <p className="orders-id">
            Customer: {order.customerName}
          </p>
          <h1>Order #{order.id}</h1>
          <p className="admin-muted-copy" style={{ maxWidth: 720 }}>
            Review totals, delivery details, and line items. Changing the status here updates Firestore — the customer
            sees the same status on their orders page.
          </p>
        </div>
      </div>

      <section className="order-detail-columns">
        <div className="panel-card tall-card">
          <h2>Payment summary</h2>
          <DetailRow label="Subtotal" value={`£${Number(order.subtotal ?? 0).toFixed(2)}`} />
          <DetailRow label="Shipping" value={`£${Number(order.shipping ?? 0).toFixed(2)}`} />
          <DetailRow label="Total" highlight value={`£${Number(order.total ?? 0).toFixed(2)}`} />

          <h3>Contact</h3>
          <p style={{ marginTop: "4px", color: "#dfe7e2" }}>
            <strong>Name:</strong> {order.customerName}
            <br />
            <strong>Email:</strong>{" "}
            <a href={`mailto:${order.email}`} style={{ color: "#1dbf8b" }}>
              {order.email}
            </a>
            <br />
            <strong>User ID:</strong>{" "}
            <span style={{ fontFamily: "ui-monospace", color: "#a8b3ad" }}>{order.userId}</span>
          </p>

          <h3>Shipping address</h3>
          {addressLines.length > 0 ? (
            <div className="shipping-address-block">
              {addressLines.map(({ label, value }, i) => (
                <p key={`${label}-${i}`} className="shipping-address-line">
                  <strong>{label}:</strong> {value}
                </p>
              ))}
            </div>
          ) : (
            <div className="shipping-address-block">
              <p className="shipping-address-muted">No delivery details were saved with this order.</p>
            </div>
          )}
        </div>

        <div className="panel-card tall-card">
          <h2>Items</h2>

          <ul className="order-detail-items">
            {order.items?.map((item, index) => (
              <li key={index}>
                <div>
                  <p>{item.title}</p>
                  <small>
                    {item.size || "—"} • {item.color || "—"}
                  </small>
                </div>
                <div className="order-qty-meta">
                  <span>
                    ×{item.quantity} @ £{Number(item.price ?? 0).toFixed(2)}
                  </span>
                  <strong>£{(Number(item.price ?? 0) * Number(item.quantity ?? 1)).toFixed(2)}</strong>
                </div>
              </li>
            ))}
          </ul>
          <p className="admin-muted-copy" style={{ marginTop: 18 }}>
            Check that sizes and quantities match what the customer chose at checkout.
          </p>
        </div>
      </section>
    </div>
  );
}

function DetailRow({ label, value, highlight }) {
  return (
    <div className={`order-detail-row ${highlight ? "emphasis" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
