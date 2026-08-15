"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Toast from "@/components/Toast";
import { adminFetch } from "@/lib/adminFetch";

interface StoryImage {
  src: string;
  alt: string;
}

interface Story {
  id: number;
  date: string;
  location: string;
  title: string;
  excerpt: string;
  category: string;
  featured: boolean;
  images: string;
  order: number;
}

interface Category {
  id: number;
  name: string;
  type: string;
  order: number;
}

export default function StoriesAdmin() {
  const [storiesList, setStoriesList] = useState<Story[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [edits, setEdits] = useState<Record<number, Partial<Story>>>({});
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const triggerFileInput = (id: string) => (document.getElementById(id) as HTMLInputElement)?.click();
  const [form, setForm] = useState({
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    location: "",
    title: "",
    excerpt: "",
    category: "Wedding",
    featured: false,
    images: [] as StoryImage[],
  });
  const [showCatManager, setShowCatManager] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [editingCat, setEditingCat] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchStories = () => {
    fetch("/api/stories", { cache: "no-store" }).then((r) => r.json()).then((data) => {
      setStoriesList(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  const fetchCategories = () => {
    fetch("/api/categories?type=stories", { cache: "no-store" }).then((r) => r.json()).then((data) => {
      setCategories(Array.isArray(data) ? data : []);
    });
  };

  useEffect(() => { fetchStories(); fetchCategories(); }, []);

  const handleMultiUpload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setToast(`Skipped "${file.name}" — not an image`);
        continue;
      }
      if (file.size > 20 * 1024 * 1024) {
        setToast(`"${file.name}" is too large (max 20MB)`);
        continue;
      }
      const formData = new FormData();
      formData.append("file", file);
      const res = await adminFetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        setForm((prev) => ({ ...prev, images: [...prev.images, { src: data.url, alt: "" }] }));
      } else {
        setToast(data.error || `Failed to upload "${file.name}"`);
      }
    }
    setUploading(false);
  };

  const handleEditUpload = async (storyId: number, files: FileList) => {
    const story = storiesList.find((s) => s.id === storyId);
    if (!story) return;
    const currentImages = parseImages(String(getField(story, "images") ?? "[]"));
    const newImages = [...currentImages];
    setUploading(true);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setToast(`Skipped "${file.name}" — not an image`);
        continue;
      }
      if (file.size > 20 * 1024 * 1024) {
        setToast(`"${file.name}" is too large (max 20MB)`);
        continue;
      }
      const formData = new FormData();
      formData.append("file", file);
      const res = await adminFetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        newImages.push({ src: data.url, alt: "" });
      } else {
        setToast(data.error || `Failed to upload "${file.name}"`);
      }
    }
    updateField(storyId, "images", JSON.stringify(newImages));
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleAdd = async () => {
    await adminFetch("/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, images: JSON.stringify(form.images) }),
    });
    setForm({ date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), location: "", title: "", excerpt: "", category: "Wedding", featured: false, images: [] });
    setShowAdd(false);
    fetchStories();
    setToast("Story added successfully!");
  };

  const updateField = (id: number, field: string, value: unknown) => {
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const getField = (story: Story, field: string) => {
    return (edits[story.id] as Record<string, unknown>)?.[field] ?? (story as unknown as Record<string, unknown>)[field];
  };

  const saveStory = async (id: number) => {
    const fields = edits[id];
    if (!fields || Object.keys(fields).length === 0) {
      setEditing(null);
      return;
    }
    await adminFetch("/api/stories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...fields }),
    });
    setEdits((prev) => { const next = { ...prev }; delete next[id]; return next; });
    fetchStories();
    setEditing(null);
    setToast("Story updated successfully!");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this story?")) return;
    await adminFetch(`/api/stories?id=${id}`, { method: "DELETE" });
    fetchStories();
    setToast("Story deleted successfully!");
  };

  const parseImages = (imagesStr: string): StoryImage[] => {
    try { return JSON.parse(imagesStr); } catch { return []; }
  };

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    await adminFetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCatName.trim(), type: "stories" }),
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
          <h1 className="font-serif text-3xl text-fg mb-2">Stories</h1>
          <p className="text-sm text-muted">Manage stories. Toggle featured to show on homepage.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCatManager(!showCatManager)} className="btn-outline text-xs cursor-pointer">
            {showCatManager ? "Hide Categories" : "Manage Categories"}
          </button>
          <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-xs cursor-pointer">
            {showAdd ? "Cancel" : "+ Add Story"}
          </button>
        </div>
      </div>

      {showCatManager && (
        <div className="bg-surface rounded-2xl border border-border p-6 mb-6">
          <h3 className="text-sm font-semibold text-fg mb-4">Story Categories</h3>
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
          <h3 className="text-sm font-semibold text-fg mb-4">Add New Story</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="px-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent" />
            <input type="text" placeholder="Location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} className="px-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent" />
            <input type="text" placeholder="Date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="px-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent" />
            <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="px-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent">
              {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              {categories.length === 0 && <option value="Wedding">Wedding</option>}
            </select>
          </div>
          <textarea placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} rows={3} className="w-full px-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent resize-y mb-3" />

          <div className="flex items-center gap-3 mb-3">
            <label className="flex items-center gap-2 text-sm text-fg cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} className="accent-accent" />
              Featured on homepage
            </label>
          </div>

          <div className="mb-3">
            <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-2">Story Images</p>
            <div className="flex flex-wrap gap-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative w-20 aspect-[3/4] rounded-lg overflow-hidden">
                  <Image src={img.src} alt={img.alt} fill className="object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] cursor-pointer">&times;</button>
                </div>
              ))}
              <button onClick={() => fileRef.current?.click()} className="btn-upload w-20 aspect-[3/4] rounded-lg text-[10px]" disabled={uploading}>
                {uploading ? "..." : "+ Add"}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) handleMultiUpload(e.target.files);
              if (fileRef.current) fileRef.current.value = "";
            }} />
          </div>

          <button onClick={handleAdd} disabled={!form.title} className="btn-primary text-xs cursor-pointer disabled:opacity-50">Add Story</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted text-sm">Loading...</div>
      ) : (
        <div className="space-y-4">
          {storiesList.map((story) => {
            const images = parseImages(story.images);
            return (
              <div key={story.id} className="bg-surface rounded-2xl border border-border p-4 group">
                <div className="flex items-start gap-4">
                  {images.length > 0 && (
                    <div className="relative w-20 aspect-[3/4] rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={images[0].src} alt={images[0].alt} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {editing === story.id ? (
                      <div className="space-y-2">
                        <input type="text" value={String(getField(story, "title") ?? "")} onChange={(e) => updateField(story.id, "title", e.target.value)} className="w-full px-3 py-1.5 bg-bg border border-border rounded text-sm text-fg focus:outline-none focus:border-accent" />
                        <div className="grid grid-cols-3 gap-2">
                          <input type="text" value={String(getField(story, "location") ?? "")} onChange={(e) => updateField(story.id, "location", e.target.value)} className="px-3 py-1.5 bg-bg border border-border rounded text-xs text-fg focus:outline-none focus:border-accent" placeholder="Location" />
                          <select value={String(getField(story, "category") ?? "Wedding")} onChange={(e) => updateField(story.id, "category", e.target.value)} className="px-3 py-1.5 bg-bg border border-border rounded text-xs text-fg focus:outline-none focus:border-accent">
                            {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                            {categories.length === 0 && <option value="Wedding">Wedding</option>}
                          </select>
                          <label className="flex items-center gap-2 text-xs text-fg cursor-pointer">
                            <input type="checkbox" checked={Boolean(getField(story, "featured"))} onChange={(e) => updateField(story.id, "featured", e.target.checked)} className="accent-accent" />
                            Featured
                          </label>
                        </div>
                        <textarea value={String(getField(story, "excerpt") ?? "")} onChange={(e) => updateField(story.id, "excerpt", e.target.value)} rows={2} className="w-full px-3 py-1.5 bg-bg border border-border rounded text-xs text-fg focus:outline-none focus:border-accent resize-y" />
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">Images</p>
                          <div className="flex flex-wrap gap-2">
                            {parseImages(String(getField(story, "images") ?? "[]")).map((img, i) => (
                              <div key={i} className="relative w-14 aspect-[3/4] rounded overflow-hidden">
                                <Image src={img.src} alt={img.alt} fill className="object-cover" />
                                <button onClick={() => {
                                  const current = parseImages(String(getField(story, "images") ?? "[]"));
                                  updateField(story.id, "images", JSON.stringify(current.filter((_, j) => j !== i)));
                                }} className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] cursor-pointer">&times;</button>
                              </div>
                            ))}
                            <button onClick={() => triggerFileInput(`edit-file-${story.id}`)} className="btn-upload w-14 aspect-[3/4] rounded text-[8px]" disabled={uploading}>
                              {uploading ? "..." : "+"}
                            </button>
                          </div>
                          <input id={`edit-file-${story.id}`} type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) handleEditUpload(story.id, e.target.files);
                            e.target.value = "";
                          }} />
                        </div>
                        <button onClick={() => saveStory(story.id)} className="text-xs text-accent hover:underline cursor-pointer mr-3">Save</button>
                        <button onClick={() => { setEdits((prev) => { const next = { ...prev }; delete next[story.id]; return next; }); setEditing(null); }} className="text-xs text-muted hover:underline cursor-pointer">Cancel</button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          {story.featured && <span className="bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">Featured</span>}
                          <span className="text-[10px] uppercase tracking-wider text-muted">{story.category}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-fg mb-1">{story.title}</h3>
                        <p className="text-xs text-muted mb-1">{story.location} / {story.date}</p>
                        <p className="text-xs text-muted line-clamp-2">{story.excerpt}</p>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => editing === story.id ? saveStory(story.id) : setEditing(story.id)} className="w-7 h-7 bg-bg border border-border rounded-full flex items-center justify-center hover:border-accent cursor-pointer">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(story.id)} className="w-7 h-7 bg-bg border border-border rounded-full flex items-center justify-center hover:border-red-500 cursor-pointer">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3,6 5,6 21,6" /><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" /></svg>
                    </button>
                  </div>
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
