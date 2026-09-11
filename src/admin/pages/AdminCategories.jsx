import { useEffect, useState } from "react";
import { getCategories, createCategory, deleteCategory, updateCategory } from "../../services/categories";

export default function AdminCategories() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const data = await getCategories();
      setRows(data);
    } catch {
      setError("Could not load categories. Check Firestore admin permissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!draft.name.trim()) return;

    try {
      setBusy(true);
      if (editingId) {
        await updateCategory(editingId, {
          name: draft.name.trim(),
          description: draft.description,
        });
        setEditingId("");
      } else {
        await createCategory({ name: draft.name.trim(), description: draft.description });
      }
      setDraft({ name: "", description: "" });
      await load();
    } catch {
      alert("Could not save category. Check Firestore rules.");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(cat) {
    setEditingId(cat.id);
    setDraft({ name: cat.name ?? "", description: cat.description ?? "" });
  }

  async function remove(id) {
    if (!confirm("Delete this category? Products may still reference the old category id.")) return;
    try {
      setBusy(true);
      await deleteCategory(id);
      if (editingId === id) {
        setEditingId("");
        setDraft({ name: "", description: "" });
      }
      await load();
    } catch {
      alert("Could not delete category. Check Firestore rules.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-page-shell">
      <header className="admin-page-intro">
        <span className="admin-pill-heading">Categories</span>
        <div className="admin-page-head-grid">
          <div>
            <h1>Manage categories</h1>
            <p>
              Categories are stored in Firestore and used on the Shop page for filters — customers can browse without
              signing in.
            </p>
          </div>
        </div>
      </header>

      <div className="category-studio-grid">
        <form className="panel-card taxonomy-form-card" onSubmit={handleCreate}>
          <p className="metric-label">{editingId ? "Edit category" : "Add category"}</p>
          <label className="auth-label taxonomy-label-stack">
            Name
            <input
              className="auth-input"
              placeholder="e.g. Tops"
              value={draft.name}
              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
            />
          </label>
          <label className="auth-label taxonomy-label-stack">
            Description (optional)
            <textarea
              className="auth-textarea"
              rows={3}
              placeholder="Notes for admins only..."
              value={draft.description}
              onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
            />
          </label>
          <div className="taxonomy-form-actions">
            <button disabled={busy} className="admin-primary-btn" type="submit">
              {busy ? "Saving..." : editingId ? "Save changes" : "Add category"}
            </button>
            {editingId ? (
              <button
                type="button"
                disabled={busy}
                className="admin-ghost-btn compact"
                onClick={() => {
                  setEditingId("");
                  setDraft({ name: "", description: "" });
                }}
              >
                Cancel edits
              </button>
            ) : null}
          </div>
        </form>

        <section className="panel-card taxonomy-list-card">
          {loading ? (
            <p className="admin-muted-copy">Loading categories...</p>
          ) : error ? (
            <p style={{ color: "#ff9b9b" }}>{error}</p>
          ) : rows.length === 0 ? (
            <p className="admin-muted-copy">No categories yet. Add one on the left.</p>
          ) : (
            <ul className="taxonomy-ul">
              {rows.map((row) => (
                <li key={row.id}>
                  <div>
                    <h3>{row.name}</h3>
                    {row.slug && <small className="taxonomy-slug">slug · {row.slug}</small>}
                    {row.description && <p>{row.description}</p>}
                  </div>
                  <div className="taxonomy-row-actions">
                    <button type="button" disabled={busy} className="admin-ghost-btn compact" onClick={() => startEdit(row)}>
                      Edit
                    </button>
                    <button type="button" disabled={busy} className="admin-outline-danger" onClick={() => remove(row.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
