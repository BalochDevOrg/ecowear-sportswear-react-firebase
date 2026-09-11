 import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(29,191,139,0.12), transparent 35%), #071411",
        color: "#f5f7f6",
        padding: "clamp(20px, 4vw, 40px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          background: "#0d1c18",
          border: "1px solid rgba(95, 255, 180, 0.16)",
          borderRadius: "clamp(18px, 3vw, 28px)",
          padding: "clamp(22px, 4vw, 40px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "rgba(29,191,139,0.14)",
            border: "1px solid rgba(95, 255, 180, 0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            marginBottom: "18px",
          }}
        >
          ✅
        </div>

        <p
          style={{
            display: "inline-block",
            margin: "0 0 14px 0",
            padding: "8px 14px",
            borderRadius: "999px",
            border: "1px solid rgba(95, 255, 180, 0.18)",
            color: "#b8f3dc",
            fontSize: "14px",
          }}
        >
          Order placed successfully
        </p>

        <h1
          style={{
            margin: "0 0 12px 0",
            fontSize: "clamp(32px, 6vw, 56px)",
            lineHeight: 1.05,
          }}
        >
          Thank you for your order
        </h1>

        <p
          style={{
            margin: "0 0 24px 0",
            color: "#a8b3ad",
            fontSize: "clamp(16px, 2.2vw, 20px)",
            lineHeight: 1.7,
            maxWidth: "720px",
          }}
        >
          Your order has been received and is now being processed. You can
          continue shopping or go back to your profile to review your account.
        </p>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(95, 255, 180, 0.12)",
            borderRadius: "20px",
            padding: "18px",
            marginBottom: "24px",
            wordBreak: "break-word",
          }}
        >
          <p style={{ margin: "0 0 8px 0", color: "#8fa19a", fontSize: "14px" }}>
            Order reference
          </p>
          <p
            style={{
              margin: 0,
              fontWeight: "700",
              fontSize: "clamp(16px, 2vw, 20px)",
            }}
          >
            {orderId}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
          }}
        >
          <Link to="/shop" style={primaryBtn}>
            Continue Shopping
          </Link>

          <Link to="/profile" style={secondaryBtn}>
            Go to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

const primaryBtn = {
  display: "block",
  textAlign: "center",
  textDecoration: "none",
  background: "#1dbf8b",
  color: "#071411",
  padding: "14px 18px",
  borderRadius: "14px",
  fontWeight: "700",
};

const secondaryBtn = {
  display: "block",
  textAlign: "center",
  textDecoration: "none",
  background: "transparent",
  color: "#f5f7f6",
  padding: "14px 18px",
  borderRadius: "14px",
  fontWeight: "700",
  border: "1px solid rgba(95, 255, 180, 0.18)",
};