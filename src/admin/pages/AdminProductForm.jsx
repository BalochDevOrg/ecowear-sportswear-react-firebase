import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, getProductById, updateProduct } from "../../services/products";
import { getCategories } from "../../services/categories";

const emptyForm = {
  title: "",
  categoryId: "",
  categoryName: "",
  category: "",
  description: "",
  imageUrl: "",
  price: "",
  inStock: true,
  sizes: "S,M,L",
  colors: "Black,Green",
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        setLoading(true);
        const cats = await getCategories();
        if (cancelled) return;

        setCategories(cats);

        if (id) {
          const data = await getProductById(id);
          if (cancelled) return;

          const catLookup = cats.find((c) => c.id === data.categoryId);

          setForm({
            title: data.title ?? "",
            categoryId: data.categoryId || catLookup?.id || "",
            categoryName: data.categoryName || catLookup?.name || data.category || "",
            category: data.category || data.categoryName || catLookup?.name || "",
            description: data.description ?? "",
            imageUrl: data.imageUrl ?? "",
            price: String(data.price ?? ""),
            inStock: data.inStock !== false,
            sizes: Array.isArray(data.sizes) ? data.sizes.join(",") : "",
            colors: Array.isArray(data.colors) ? data.colors.join(",") : "",
          });
        }
      } catch {
        if (!cancelled) setError("Could not load product or categories.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [id]);
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleCategorySelect(e) {
    const cid = e.target.value;
    const sel = categories.find((c) => c.id === cid);
    setForm((prev) => ({
      ...prev,
      categoryId: cid,
      categoryName: sel?.name || "",
      category: sel?.name || prev.category,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const priceNum = Number(form.price);

    const productPayload = {
      title: form.title.trim(),
      categoryId: form.categoryId || "",
      categoryName: form.categoryName || form.category.trim() || "Uncategorized",
      category: form.category.trim() || form.categoryName.trim() || "Uncategorized",
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      price: priceNum,
      inStock: form.inStock,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
    };

    if (!productPayload.title || !productPayload.imageUrl || Number.isNaN(productPayload.price)) {
      setError("Title, image URL, and numeric price are required.");
      return;
    }

    try {
      setSaving(true);
      if (isEditMode) {
        await updateProduct(id, productPayload);
      } else {
        await createProduct(productPayload);
      }
      navigate("/admin/products");
    } catch {
      setError("Save failed — check Firestore rules and admin role.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="product-details-page">
      <div className="product-details-grid aligned-top">
        <div className="product-details-card">
          <span className="admin-pill-heading">{isEditMode ? "Edit product" : "New product"}</span>

          <h1 className="product-details-title">{isEditMode ? "Edit product" : "Add product"}</h1>

          {error ? <p className="auth-error">{error}</p> : null}

          {loading ? (
            <p className="admin-muted-copy">Loading...</p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "14px" }}>
              <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} />

              <label className="auth-label taxonomy-label-stack">
                Category
                <select className="auth-input" value={form.categoryId} onChange={handleCategorySelect}>
                  <option value="">Uncategorized</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <Input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} />
              <Input name="price" placeholder="Price" value={form.price} onChange={handleChange} />

              <label className="auth-label taxonomy-label-stack">
                Description
                <textarea
                  className="auth-textarea"
                  rows={4}
                  name="description"
                  placeholder="Description, materials, sizing notes..."
                  value={form.description}
                  onChange={handleChange}
                />
              </label>

              <Input
                name="sizes"
                placeholder="Sizes (comma separated)"
                value={form.sizes}
                onChange={handleChange}
              />

              <Input
                name="colors"
                placeholder="Colors (comma separated)"
                value={form.colors}
                onChange={handleChange}
              />

              <label className="taxonomy-inline-check">
                <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} /> In stock
              </label>

              <button className="product-details-btn" disabled={saving}>
                {saving ? "Saving..." : isEditMode ? "Save changes" : "Save product"}
              </button>

              <button type="button" className="admin-ghost-btn compact" disabled={saving} onClick={() => navigate("/admin/products")}>
                Cancel — back to list
              </button>
            </form>
          )}
        </div>

        <div className="product-details-image-card">
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="Product preview" className="product-details-image" />
          ) : (
            <div className="image-placeholder-soft">
              Enter an HTTPS image URL (for example from a CDN or image host).
            </div>
          )}
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
      className="field-input roomy"
    />
  );
}
