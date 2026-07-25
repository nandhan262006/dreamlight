"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Toast from "@/components/Toast";
import { adminFetch } from "@/lib/adminFetch";

interface Service {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  order: number;
}

interface Category {
  id: number;
  name: string;
  type: string;
  order: number;
}

export default function ServicesAdmin() {
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [edits, setEdits] = useState<Record<number, Partial<Service>>>({});
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", category: "Photography" });
  const [showCatManager, setShowCatManager] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [editingCat, setEditingCat] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchServices = () => {
    fetch("/api/services").then((r) => r.json()).then((data) => {
      setServicesList(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  const fetchCategories = () => {
    fetch("/api/categories?type=services").then((r) => r.json()).then((data) => {
      setCategories(Array.isArray(data) ? data : []);
    });
  };

  useEffect(() => { fetchServices(); fetchCategories(); }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
                          const res = await adminFetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) {
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    }
    setUploading(false);
  };

  const handleAdd = async () => {
    await adminFetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", description: "", imageUrl: "", category: "Photography" });
    setShowAdd(false);
    fetchServices();
    setToast("Service added successfully!");
  };

  const updateField = (id: number, field: string, value: unknown) => {
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const getField = (service: Service, field: string) => {
    return (edits[service.id] as Record<string, unknown>)?.[field] ?? (service as unknown as Record<string, unknown>)[field];
  };

  const saveService = async (id: number) => {
    const fields = edits[id];
    if (!fields || Object.keys(fields).length === 0) {
      setEditing(null);
      return;
    }
    await adminFetch("/api/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...fields }),
    });
    setEdits((prev) => { const next = { ...prev }; delete next[id]; return next; });
    fetchServices();
    setEditing(null);
    setToast("Service updated successfully!");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    await adminFetch(`/api/services?id=${id}`, { method: "DELETE" });
    fetchServices();
    setToast("Service deleted successfully!");
  };

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    await adminFetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCatName.trim(), type: "services" }),
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
          <h1 className="font-serif text-3xl text-fg mb-2">Services</h1>
          <p className="text-sm text-muted">Manage service cards shown on the homepage</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCatManager(!showCatManager)} className="btn-outline text-xs cursor-pointer">
            {showCatManager ? "Hide Categories" : "Manage Categories"}
          </button>
          <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-xs cursor-pointer">
            {showAdd ? "Cancel" : "+ Add Service"}
          </button>
        </div>
      </div>

      {showCatManager && (
        <div className="bg-surface rounded-2xl border border-border p-6 mb-6">
          <h3 className="text-sm font-semibold text-fg mb-4">Service Categories</h3>
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
          <h3 className="text-sm font-semibold text-fg mb-4">Add New Service</h3>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }} />

          <div className="flex gap-4 mb-4">
            {form.imageUrl ? (
              <div className="relative w-32 aspect-[3/4] rounded-lg overflow-hidden flex-shrink-0">
                <Image src={form.imageUrl} alt="Preview" fill className="object-cover" />
                <button onClick={() => setForm((p) => ({ ...p, imageUrl: "" }))} className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white text-[10px] cursor-pointer">&times;</button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} className="w-32 aspect-[3/4] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted text-xs hover:border-accent transition-colors cursor-pointer flex-shrink-0" disabled={uploading}>
                {uploading ? "..." : "Upload"}
              </button>
            )}
            <div className="flex-1 space-y-3">
              <input type="text" placeholder="Service title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent" />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent resize-y" />
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full px-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent">
                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                {categories.length === 0 && <option value="Photography">Photography</option>}
              </select>
            </div>
          </div>
          <button onClick={handleAdd} disabled={!form.title} className="btn-primary text-xs cursor-pointer disabled:opacity-50">Add Service</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted text-sm">Loading...</div>
      ) : (
        <div className="space-y-4">
          {servicesList.map((service) => (
            <div key={service.id} className="bg-surface rounded-2xl border border-border p-4 group">
              <div className="flex items-start gap-4">
                <div className="relative w-20 aspect-[3/4] rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={service.imageUrl} alt={service.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  {editing === service.id ? (
                    <div className="space-y-2">
                      <input type="text" value={String(getField(service, "title") ?? "")} onChange={(e) => updateField(service.id, "title", e.target.value)} className="w-full px-3 py-1.5 bg-bg border border-border rounded text-sm text-fg focus:outline-none focus:border-accent" />
                      <textarea value={String(getField(service, "description") ?? "")} onChange={(e) => updateField(service.id, "description", e.target.value)} rows={2} className="w-full px-3 py-1.5 bg-bg border border-border rounded text-xs text-fg focus:outline-none focus:border-accent resize-y" />
                      <select value={String(getField(service, "category") ?? "Photography")} onChange={(e) => updateField(service.id, "category", e.target.value)} className="w-full px-3 py-1.5 bg-bg border border-border rounded text-xs text-fg focus:outline-none focus:border-accent">
                        {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                        {categories.length === 0 && <option value="Photography">Photography</option>}
                      </select>
                      <input type="file" accept="image/*" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append("file", file);
    const res = await adminFetch("/api/upload", { method: "POST", body: formData });
                          const data = await res.json();
                          if (data.url) updateField(service.id, "imageUrl", data.url);
                        }
                      }} className="text-xs text-muted" />
                      <button onClick={() => saveService(service.id)} className="text-xs text-accent hover:underline cursor-pointer mr-3">Save</button>
                      <button onClick={() => { setEdits((prev) => { const next = { ...prev }; delete next[service.id]; return next; }); setEditing(null); }} className="text-xs text-muted hover:underline cursor-pointer">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-sm font-semibold text-fg mb-1">{service.title}</h3>
                      <p className="text-xs text-muted mb-1">{service.category}</p>
                      <p className="text-xs text-muted line-clamp-2">{service.description}</p>
                    </>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => editing === service.id ? saveService(service.id) : setEditing(service.id)} className="w-7 h-7 bg-bg border border-border rounded-full flex items-center justify-center hover:border-accent cursor-pointer">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="w-7 h-7 bg-bg border border-border rounded-full flex items-center justify-center hover:border-red-500 cursor-pointer">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3,6 5,6 21,6" /><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
