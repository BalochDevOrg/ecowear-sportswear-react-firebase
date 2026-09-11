import { Navigate, Outlet, Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { loading, user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page-loading">
        <div className="page-loading-spinner" aria-hidden />
        <p className="page-loading-text">Loading admin…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark">◇</span>
          <span>EcoWear Admin</span>
        </div>
        <p className="admin-sidebar-sub">
          Manage orders, products, and categories separately from the public store.
        </p>

        <nav className="admin-nav">
          <AdminNavLink to="/admin">Dashboard</AdminNavLink>
          <AdminNavLink to="/admin/orders">Orders</AdminNavLink>
          <AdminNavLink to="/admin/products">Products</AdminNavLink>
          <AdminNavLink to="/admin/categories">Categories</AdminNavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <p className="admin-sidebar-user">{user?.name || user?.email}</p>
          <Link to="/" className="admin-back-store">
            ← Storefront
          </Link>
          <button type="button" onClick={() => logout()} className="admin-logout">
            Log out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

function AdminNavLink({ to, children }) {
  return (
    <NavLink
      to={to}
      end={to === "/admin"}
      className={({ isActive }) =>
        ["admin-nav-link", isActive ? "admin-nav-link-active" : ""].join(" ").trim()
      }
    >
      {children}
    </NavLink>
  );
}
