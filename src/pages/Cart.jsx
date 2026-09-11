import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart } = useCart();
  const shipping = cartSubtotal > 80 ? 0 : 4.99;
  const total = cartSubtotal + shipping;

  return (
    <div className="page-dark">
      <div className="page-dark-inner">
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "52px", marginBottom: "10px" }}>Your Cart</h1>
          <p style={{ color: "#a8b3ad", fontSize: "18px", margin: 0 }}>
            Review your items before checkout.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="panel-card" style={{ maxWidth: "760px" }}>
            <h2 style={{ marginTop: 0 }}>Your cart is empty</h2>
            <p style={{ color: "#a8b3ad", lineHeight: 1.7 }}>
              Explore our eco-friendly collection and add products to your cart.
            </p>

            <Link to="/shop" style={primaryBtn}>
              Go to Shop
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div style={{ display: "grid", gap: "18px" }}>
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size || ""}-${item.color || ""}`} className="panel-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h3 style={{ marginTop: 0, marginBottom: "10px", fontSize: "30px" }}>{item.title}</h3>

                      <p style={{ margin: "0 0 8px 0", color: "#a8b3ad" }}>
                        Size: {item.size || "—"} • Color: {item.color || "—"}
                      </p>

                      <p style={{ margin: "0 0 8px 0", color: "#a8b3ad" }}>
                        Price: £{Number(item.price).toFixed(2)}
                      </p>

                      <p style={{ margin: 0, color: "#a8b3ad" }}>Quantity: {item.quantity}</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1,
                            item.size || "",
                            item.color || ""
                          )
                        }
                        style={smallBtn}
                      >
                        −
                      </button>

                      <span
                        style={{
                          minWidth: "42px",
                          textAlign: "center",
                          fontWeight: "700",
                          color: "#f5f7f6",
                        }}
                      >
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1,
                            item.size || "",
                            item.color || ""
                          )
                        }
                        style={smallBtn}
                      >
                        +
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id, item.size || "", item.color || "")}
                        style={dangerBtn}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="panel-card sticky-summary">
              <h2 style={{ marginTop: 0, marginBottom: "18px" }}>Order Summary</h2>

              <div style={summaryRow}>
                <span>Subtotal</span>
                <span>£{cartSubtotal.toFixed(2)}</span>
              </div>

              <div style={summaryRow}>
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `£${shipping.toFixed(2)}`}</span>
              </div>

              <div
                style={{
                  ...summaryRow,
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  marginTop: "14px",
                  paddingTop: "16px",
                  fontSize: "22px",
                  fontWeight: "700",
                }}
              >
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                style={{ ...primaryBtn, width: "100%", textAlign: "center", marginTop: "18px" }}
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/shop"
                style={{ ...secondaryBtn, width: "100%", textAlign: "center", marginTop: "12px" }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "12px",
  color: "#dfe7e2",
};

const primaryBtn = {
  display: "inline-block",
  textDecoration: "none",
  background: "#1dbf8b",
  color: "#071411",
  padding: "14px 18px",
  borderRadius: "14px",
  fontWeight: "700",
  border: "none",
};

const secondaryBtn = {
  display: "inline-block",
  textDecoration: "none",
  background: "transparent",
  color: "#f5f7f6",
  padding: "14px 18px",
  borderRadius: "14px",
  fontWeight: "700",
  border: "1px solid rgba(95, 255, 180, 0.18)",
};

const smallBtn = {
  background: "rgba(255,255,255,0.04)",
  color: "#f5f7f6",
  border: "1px solid rgba(95, 255, 180, 0.14)",
  padding: "10px 14px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
};

const dangerBtn = {
  background: "rgba(255,255,255,0.04)",
  color: "#ffb3b3",
  border: "1px solid rgba(255, 120, 120, 0.22)",
  padding: "10px 14px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
};
