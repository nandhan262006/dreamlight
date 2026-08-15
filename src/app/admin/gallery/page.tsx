"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Toast from "@/components/Toast";
import { adminFetch } from "@/lib/adminFetch";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  title: string;
  featured: boolean;
  order: number;
}

interface Category {
  id: number;
  name: string;
  type: string;
  order: number;
}

export default function GalleryAdmin() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ src: "", alt: "", category: "Wedding", title: "", featured: false });
  const [showCatManager, setShowCatManager] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [editingCat, setEditingCat] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [edits, setEdits] = useState<Record<number, Partial<GalleryImage>>>({});

  const fetchImages = () => {
    fetch("/api/gallery", { cache: "no-store" }).then((r) => r.json()).then((data) => {
      setImages(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  const fetchCategories = () => {
    fetch("/api/categories?type=gallery", { cache: "no-store" }).then((r) => r.json()).then((data) => {
      setCategories(Array.isArray(data) ? data : []);
    });
  };

  useEffect(() => { fetchImages(); fetchCategories(); }, []);

  const hasChanges = Object.keys(edits).length > 0;

  const updateField = (id: number, field: string, value: unknown) => {
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const getField = (img: GalleryImage, field: keyof GalleryImage) => {
    return (edits[img.id]?.[field] as GalleryImage[typeof field]) ?? img[field];
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setToast("Only image files are allowed");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setToast("File too large (max 20MB)");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await adminFetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.url) {
      setForm((prev) => ({ ...prev, src: data.url }));
    } else {
      setToast(data.error || "Upload failed");
    }
    setUploading(false);
  };

  const handleAdd = async () => {
    await adminFetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ src: "", alt: "", category: "Wedding", title: "", featured: false });
    setShowAdd(false);
    fetchImages();
    setToast("Image added successfully!");
  };

  const handleSave = async () => {
    setSaving(true);
    await Promise.all(
      Object.entries(edits).map(([id, fields]) =>
        adminFetch("/api/gallery", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: Number(id), ...fields }),
        })
      )
    );
    setEdits({});
    fetchImages();
    setSaving(false);
    setToast("Changes saved successfully!");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this image?")) return;
    await adminFetch(`/api/gallery?id=${id}`, { method: "DELETE" });
    setEdits((prev) => { const next = { ...prev }; delete next[id]; return next; });
    fetchImages();
    setToast("Image deleted successfully!");
  };

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    await adminFetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCatName.trim(), type: "gallery" }),
    });
    setNewCatName("");
    fetchCategories();
    setToast("Category added successfully!");
  };

  const updateCategory = async (id: number, name: string) => {
    await adminFetch("/api/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name }),
    });
    fetchCategories();
    setToast("Category updated successfully!");
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    await adminFetch(`/api/categories?id=${id}`, { method: "DELETE" });
    fetchCategories();
    setToast("Category deleted successfully!");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-fg mb-2">Gallery</h1>
          <p className="text-sm text-muted">Manage gallery images. Toggle featured to show on homepage grid.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCatManager(!showCatManager)} className="btn-outline text-xs cursor-pointer">
            {showCatManager ? "Hide Categories" : "Manage Categories"}
          </button>
          <button onClick={() => setShowAdd(!showAdd)} className="btn-outline text-xs cursor-pointer">
            {showAdd ? "Cancel" : "+ Add Image"}
          </button>
          <button onClick={handleSave} disabled={!hasChanges || saving} className="btn-primary text-xs cursor-pointer disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {showCatManager && (
        <div className="bg-surface rounded-2xl border border-border p-6 mb-6">
          <h3 className="text-sm font-semibold text-fg mb-4">Gallery Categories</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              placeholder="New category name"
              className="flex-1 px-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent"
            />
            <button onClick={addCategory} disabled={!newCatName.trim()} className="btn-primary text-xs cursor-pointer disabled:opacity-50">
              Add
            </button>
          </div>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2 group">
                {editingCat === cat.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      defaultValue={cat.name}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateCategory(cat.id, (e.target as HTMLInputElement).value);
                          setEditingCat(null);
                        }
                      }}
                      className="flex-1 px-3 py-1.5 bg-bg border border-border rounded text-sm text-fg focus:outline-none focus:border-accent"
                      autoFocus
                    />
                    <button onClick={() => setEditingCat(null)} className="text-xs text-accent hover:underline cursor-pointer">Done</button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-fg">{cat.name}</span>
                    <button onClick={() => setEditingCat(cat.id)} className="w-6 h-6 bg-bg border border-border rounded-full items-center justify-center hover:border-accent cursor-pointer hidden group-hover:flex">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <button onClick={() => deleteCategory(cat.id)} className="w-6 h-6 bg-bg border border-border rounded-full items-center justify-center hover:border-red-500 cursor-pointer hidden group-hover:flex">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3,6 5,6 21,6" /><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" /></svg>
                    </button>
                  </>
                )}
              </div>
            ))}
            {categories.length === 0 && <p className="text-xs text-muted">No categories yet</p>}
          </div>
        </div>
      )}

      {showAdd && (
        <div className="bg-surface rounded-2xl border border-border p-6 mb-6">
          <h3 className="text-sm font-semibold text-fg mb-4">Add New Image</h3>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }} />

          {form.src ? (
            <div className="relative w-40 aspect-[3/4] rounded-lg overflow-hidden mb-4">
              <Image src={form.src} alt="Preview" fill className="object-cover" />
              <button onClick={() => setForm((p) => ({ ...p, src: "" }))} className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white text-xs cursor-pointer">&times;</button>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()} className="btn-upload w-40 aspect-[3/4] rounded-lg text-sm mb-4" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="px-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent" />
            <input type="text" placeholder="Alt text" value={form.alt} onChange={(e) => setForm((p) => ({ ...p, alt: e.target.value }))} className="px-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent" />
            <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="px-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent">
              {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              {categories.length === 0 && <option value="Wedding">Wedding</option>}
            </select>
            <label className="flex items-center gap-2 px-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-fg cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} className="accent-accent" />
              Featured on homepage
            </label>
          </div>
          <button onClick={handleAdd} disabled={!form.src} className="mt-4 btn-primary text-xs cursor-pointer disabled:opacity-50">Add Image</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted text-sm">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => {
            const title = getField(img, "title") as string;
            const alt = getField(img, "alt") as string;
            const category = getField(img, "category") as string;
            const featured = getField(img, "featured") as boolean;
            const isDirty = !!edits[img.id];

            return (
              <div key={img.id} className={`bg-surface rounded-2xl border overflow-hidden group ${isDirty ? "border-accent" : "border-border"}`}>
                <div className="relative aspect-[3/4]">
                  <Image src={img.src} alt={alt} fill className="object-cover" />
                  {featured && (
                    <div className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Featured</div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDelete(img.id)} className="w-7 h-7 bg-red-500/90 rounded-full flex items-center justify-center hover:bg-red-500 cursor-pointer">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="3,6 5,6 21,6" /><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" /></svg>
                    </button>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <input type="text" value={title} onChange={(e) => updateField(img.id, "title", e.target.value)} className="w-full px-3 py-1.5 bg-bg border border-border rounded text-xs text-fg focus:outline-none focus:border-accent" placeholder="Title" />
                  <input type="text" value={alt} onChange={(e) => updateField(img.id, "alt", e.target.value)} className="w-full px-3 py-1.5 bg-bg border border-border rounded text-xs text-fg focus:outline-none focus:border-accent" placeholder="Alt text" />
                  <select value={category} onChange={(e) => updateField(img.id, "category", e.target.value)} className="w-full px-3 py-1.5 bg-bg border border-border rounded text-xs text-fg focus:outline-none focus:border-accent">
                    {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    {categories.length === 0 && <option value="Wedding">Wedding</option>}
                  </select>
                  <label className="flex items-center gap-2 text-xs text-fg cursor-pointer">
                    <input type="checkbox" checked={featured} onChange={(e) => updateField(img.id, "featured", e.target.checked)} className="accent-accent" />
                    Featured
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
