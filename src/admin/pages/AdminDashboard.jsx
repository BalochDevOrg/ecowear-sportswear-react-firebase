import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { subscribeUnreadOrdersCount, getAllOrders } from "../../services/orders";
import { getProducts, seedProducts } from "../../services/products";
import { getCategories, seedDefaultCategories } from "../../services/categories";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ categories: 0, products: 0, orders: 0 });
  const [busyKey, setBusyKey] = useState("");
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    async function loadCounts() {
      try {
        const [cats, prods, orders] = await Promise.all([
          getCategories(),
          getProducts(),
          getAllOrders(),
        ]);

        setStats({
          categories: cats.length,
          products: prods.length,
          orders: orders.length,
        });
      } catch (err) {
        console.error("Dashboard stats unavailable", err);
      }
    }
    loadCounts();
  }, [busyKey]);

  useEffect(() => {
    const unsub = subscribeUnreadOrdersCount(setUnread);
    return () => unsub?.();
  }, []);

  async function runSeed(key, fn) {
    try {
      setBusyKey(key);
      await fn();
    } catch (err) {
      console.error(err);
      alert("Sample data failed to load — check Firestore permissions or whether those items already exist.");
    } finally {
      setBusyKey("");
    }
  }

  return (
    <div className="admin-page-shell">
      <div className="admin-page-intro">
        <span className="admin-pill-heading">Admin</span>
        <div className="admin-page-head-grid">
          <div>
            <h1>Dashboard</h1>
            <p>
              Manage products and categories here. Orders appear when customers complete checkout.
              {unread > 0 ? (
                <span className="admin-inline-alert">
                  {unread} new or unopened{" "}
                  <Link to="/admin/orders">order(s)</Link> — open Orders to review.
                </span>
              ) : (
                <span style={{ marginLeft: 8 }}>
                  No unread orders — you can still open <Link to="/admin/orders">Orders</Link> anytime.
                </span>
              )}
            </p>
          </div>
          <span className="admin-unread-chip">
            Unread&nbsp;
            <strong>{unread}</strong>
          </span>
        </div>

        <div className="admin-seed-strip">
          <button
            type="button"
            className="admin-ghost-btn"
            disabled={!!busyKey}
            onClick={() => runSeed("cats", seedDefaultCategories)}
          >
            {busyKey === "cats" ? "Adding sample categories..." : "Add sample categories"}
          </button>
          <button
            type="button"
            className="admin-ghost-btn"
            disabled={!!busyKey}
            onClick={() => runSeed("prods", seedProducts)}
          >
            {busyKey === "prods" ? "Adding sample products..." : "Add sample products"}
          </button>
          <p className="admin-seed-hint">
            Useful for demos. Skips categories that already exist with the same name.
          </p>
        </div>
      </div>

      <div className="admin-summary-grid">
        <SummaryMetric label="Categories" value={stats.categories} hint="Used as filters on the Shop page." />
        <SummaryMetric label="Products" value={stats.products} hint="Shown to customers on the Shop page." />
        <SummaryMetric label="Orders" value={stats.orders} hint="Open Orders for details and statuses." />
      </div>

      <div className="admin-link-grid">
        <AdminShortcut
          to="/admin/orders"
          title="Orders"
          text="See every placed order, change status, and view shipping details."
          accent="Orders"
        />
        <AdminShortcut
          to="/admin/products"
          title="Products"
          text="Edit titles, prices, images, sizes, colors, and stock."
          accent="Products"
        />
        <AdminShortcut
          to="/admin/categories"
          title="Categories"
          text="Manage category names used in filters and admin forms."
          accent="Categories"
        />
      </div>
    </div>
  );
}

function SummaryMetric({ label, value, hint }) {
  return (
    <div className="panel-card admin-metric-card">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      <p className="metric-hint">{hint}</p>
    </div>
  );
}

function AdminShortcut({ to, title, text, accent }) {
  return (
    <Link to={to} className="panel-card admin-shortcut-card">
      <span className="accent-tag">{accent}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </Link>
  );
}
