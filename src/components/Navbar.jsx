import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout, loading } = useAuth();

  return (
    <nav className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <span style={{ color: "#1dbf8b", fontSize: "22px" }} aria-hidden="true">
            🌿
          </span>
          <Link to="/">EcoWear Sports</Link>
        </div>

        <div className="nav-links">
          <NavBtn to="/">Home</NavBtn>
          <NavBtn to="/shop">Shop</NavBtn>
          <NavBtn to="/cart">
            Cart {cartCount > 0 ? `(${cartCount})` : ""}
          </NavBtn>

          {!loading && !isAuthenticated && (
            <>
              <NavBtn to="/login">Login</NavBtn>
              <NavBtn to="/register">Register</NavBtn>
            </>
          )}
          {!loading && isAuthenticated && <NavBtn to="/profile">Account</NavBtn>}
          {!loading && isAdmin && (
            <Link to="/admin" className="nav-pill nav-pill-accent">
              Admin
            </Link>
          )}

          {!loading && isAuthenticated && (
            <>
              <span className="nav-user">
                Hi, {user?.name || user?.email || "EcoWear shopper"}
              </span>
              <button type="button" onClick={logout} className="nav-logout">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavBtn({ to, children }) {
  return (
    <Link to={to} className="nav-pill">
      {children}
    </Link>
  );
}
