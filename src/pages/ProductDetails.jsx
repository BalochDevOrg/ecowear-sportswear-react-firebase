import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../services/products";
import { useCart } from "../context/CartContext";
import { categoryLabel } from "../utils/catalogDisplay";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [toast, setToast] = useState("");
  const toastTimerRef = useRef(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductById(id);
        setProduct(data);

        if (Array.isArray(data.sizes) && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }

        if (Array.isArray(data.colors) && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) return <h1 style={{ padding: "24px" }}>Loading...</h1>;
  if (!product) return <h1 style={{ padding: "24px" }}>No product found</h1>;

  const sizes =
    Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes
      : ["S", "M", "L"];

  const colors =
    Array.isArray(product.colors) && product.colors.length > 0
      ? product.colors
      : ["Black", "Green"];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: Number(product.price),
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
      imageUrl: product.imageUrl,
    });

    const message = `${product.title} — ${selectedSize} / ${selectedColor} confirmed in basket.`;
    setToast(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(""), 3200);
  };

  return (
    <div className="product-details-page">
      <div className="product-details-grid">
        <div className="product-details-image-card">
          <img src={product.imageUrl} alt={product.title} className="product-details-image" />
        </div>

        <div className="product-details-card">
          <p className="product-details-category">{categoryLabel(product)}</p>
          <h1 className="product-details-title">{product.title}</h1>
          <p className="product-details-description">{product.description}</p>
          <h2 className="product-details-price">£{Number(product.price).toFixed(2)}</h2>

          <p style={{ marginBottom: "10px", color: "#a8b3ad" }}>Select Size:</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #1dbf8b",
                  background: selectedSize === size ? "#1dbf8b" : "transparent",
                  color: selectedSize === size ? "#071411" : "#fff",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                {size}
              </button>
            ))}
          </div>

          <p style={{ marginBottom: "10px", color: "#a8b3ad" }}>Select Color:</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #1dbf8b",
                  background: selectedColor === color ? "#1dbf8b" : "transparent",
                  color: selectedColor === color ? "#071411" : "#fff",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                {color}
              </button>
            ))}
          </div>

          <button type="button" onClick={handleAddToCart} className="product-details-btn">
            Add to Cart
          </button>

          {toast && (
            <p className="product-toast" role="status">
              {toast}
            </p>
          )}

          <p style={{ marginTop: "22px", color: "#a8b3ad" }}>
            <Link to="/shop" style={{ color: "#1dbf8b", fontWeight: 700 }}>
              ← Continue browsing
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
