import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../../services/products";
import { categoryLabel } from "../../utils/catalogDisplay";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function refreshCatalog() {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      setLoading(true);
      try {
        const data = await getProducts();
        if (!cancelled) {
          setProducts(data);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(id) {
    const ok = confirm("Delete this product permanently?");
    if (!ok) return;

    await deleteProduct(id);
    await refreshCatalog();
  }

  return (
    <div className="admin-page-shell">
      <div className="shop-header admin-products-header">
        <div>
          <p className="shop-badge">Products</p>
          <h1 className="shop-title">Product list</h1>
          <p className="shop-text">
            Each row is saved as a Firestore document. Categories link products to Shop filters when set.
          </p>
        </div>

        <Link to="/admin/products/new" className="shop-seed-btn">
          + Add Product
        </Link>
      </div>

      {loading ? (
        <p className="admin-muted-copy">Loading products...</p>
      ) : (
        <div className="shop-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <div className="product-image-wrap">
                <img src={p.imageUrl} alt={p.title} className="product-image" />
              </div>

              <div className="product-body">
                <p className="product-category">{categoryLabel(p)}</p>
                <h2 className="product-title">{p.title}</h2>
                <p className="product-price">£{Number(p.price).toFixed(2)}</p>
                <small className="admin-stock-tag">{p.inStock ? "In stock" : "Out of stock"}</small>
              </div>

              <div className="product-footer admin-product-actions">
                <Link className="product-cart-btn quiet" to={`/admin/products/${p.id}/edit`}>
                  Edit
                </Link>
                <button type="button" className="admin-outline-danger" onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
