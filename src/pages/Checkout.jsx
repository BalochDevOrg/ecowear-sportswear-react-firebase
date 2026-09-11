import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/orders";

export default function Checkout() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    country: "UK",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shipping = cartSubtotal > 80 ? 0 : 4.99;
  const total = cartSubtotal + shipping;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user?.uid) {
      navigate("/login", { replace: false, state: { from: "/checkout" } });
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!form.fullName || !form.phone || !form.address || !form.city || !form.postcode) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const orderId = await createOrder({
        userId: user.uid,
        customerName: form.fullName,
        email: user.email,
        items: cartItems,
        subtotal: cartSubtotal,
        shipping,
        total,
        shippingAddress: form,
      });

      clearCart();
      navigate(`/success/${orderId}`);
    } catch {
      setError("Failed to place order. Check Firebase rules/indexes & network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-dark">
      <div className="page-dark-inner">
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "52px", marginBottom: "10px" }}>Checkout</h1>
          <p style={{ color: "#a8b3ad", fontSize: "18px", margin: 0 }}>
            Enter your delivery details and review your order.
          </p>
        </div>

        <div className="checkout-grid">
          <form className="panel-card checkout-form-grid" onSubmit={handleSubmit}>
            <h2 style={{ marginTop: 0, marginBottom: "8px" }}>Delivery Details</h2>

            <Input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} />
            <Input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
            <Input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
            <Input name="city" placeholder="City" value={form.city} onChange={handleChange} />
            <Input name="postcode" placeholder="Postcode" value={form.postcode} onChange={handleChange} />
            <Input name="country" placeholder="Country" value={form.country} onChange={handleChange} />

            {error && <p style={{ color: "#ff8f8f", margin: 0 }}>{error}</p>}

            <button type="submit" disabled={loading} className="btn-solid-wide">
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          <div className="panel-card sticky-summary">
            <h2 style={{ marginTop: 0, marginBottom: "18px" }}>Order Summary</h2>

            <div style={{ display: "grid", gap: "14px", marginBottom: "18px" }}>
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size || ""}-${item.color || ""}`}
                  style={{
                    paddingBottom: "12px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <p style={{ margin: "0 0 6px 0", fontWeight: "700" }}>{item.title}</p>
                      <p style={{ margin: 0, color: "#a8b3ad", fontSize: "14px" }}>
                        Size: {item.size} • Color: {item.color ?? "—"} • Qty: {item.quantity}
                      </p>
                    </div>

                    <p style={{ margin: 0, fontWeight: "700" }}>£{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

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

            <p style={{ color: "#8fa19a", fontSize: "14px", marginTop: "16px", marginBottom: 0 }}>
              Free shipping on orders over £80.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ name, placeholder, value, onChange }) {
  return (
    <input
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="field-input"
    />
  );
}

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "12px",
  color: "#dfe7e2",
};
