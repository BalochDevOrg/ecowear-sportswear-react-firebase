import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/products";
import { getCategories } from "../services/categories";
import { categoryLabel } from "../utils/catalogDisplay";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("all");

  async function load() {
    try {
      setLoading(true);
      const [plist, clist] = await Promise.all([getProducts(), getCategories()]);
      setProducts(plist);
      setCategories(clist);
    } catch (err) {
      const code =
        err && typeof err === "object" && "code" in err ? String(err.code) : "";
      const hint =
        code === "permission-denied"
          ? "Deploy or publish `firestore.rules` (catalogue allows public read)."
          : code === "failed-precondition"
            ? "Firestore may need an index — check the browser console for a setup link."
            : !import.meta.env.VITE_FIREBASE_PROJECT_ID
              ? "Missing VITE_FIREBASE_* in `.env` — copy `.env.example` and fill values."
              : "";
      setError(
        [
          "Failed to load catalogue.",
          code && `Firebase: ${code}.`,
          err instanceof Error ? err.message : "",
          hint,
        ]
          .filter(Boolean)
          .join(" "),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filterCategoryId === "all") return products;
    return products.filter((p) => p.categoryId === filterCategoryId);
  }, [products, filterCategoryId]);

  if (loading) return <h1 style={{ padding: "24px" }}>Loading products...</h1>;
  if (error) return <h1 style={{ padding: "24px" }}>{error}</h1>;

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div>
          <p className="shop-badge">Eco performance collection</p>
          <h1 className="shop-title">Shop</h1>
          <p className="shop-text">
            Explore sustainable activewear built for performance and everyday movement.
          </p>
        </div>

        <label className="shop-filter-wrap">
          <span className="shop-filter-label">Category</span>
          <select
            className="shop-filter-select"
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
          >
            <option value="all">All products</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="panel-card shop-empty-tip">
          <p style={{ marginTop: 0 }}>
            No published products{" "}
            {filterCategoryId === "all" ? "yet." : "match this category."}
          </p>
          <p style={{ color: "#a8b3ad", lineHeight: 1.6 }}>
            Admins populate Firestore collections from{" "}
            <Link style={{ color: "#1dbf8b" }} to="/login">
              the staff dashboard
            </Link>{" "}
            after assigning an admin profile.
          </p>
        </div>
      ) : (
        <div className="shop-grid">
          {filtered.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="product-image-wrap">
                  <img src={product.imageUrl} alt={product.title} className="product-image" />
                </div>

                <div className="product-body">
                  <p className="product-category">{categoryLabel(product)}</p>
                  <h2 className="product-title">{product.title}</h2>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">${Number(product.price).toFixed(2)}</p>
                </div>
              </Link>

              <div className="product-footer">
                <Link
                  to={`/product/${product.id}`}
                  className="product-cart-btn"
                  style={{ textDecoration: "none", textAlign: "center", display: "block" }}
                >
                  Choose Size & Color
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
