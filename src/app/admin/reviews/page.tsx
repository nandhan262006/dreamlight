"use client";

import { useState, useEffect } from "react";
import Toast from "@/components/Toast";
import { adminFetch } from "@/lib/adminFetch";

interface Review {
  id: number;
  name: string;
  text: string;
  rating: number;
  date: string;
  order: number;
}

export default function ReviewsAdmin() {
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [edits, setEdits] = useState<Record<number, Partial<Review>>>({});
  const [form, setForm] = useState({ name: "", text: "", rating: 5, date: "Just now" });
  const [toast, setToast] = useState<string | null>(null);

  const fetchReviews = () => {
    fetch("/api/reviews").then((r) => r.json()).then((data) => {
      setReviewsList(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleAdd = async () => {
    await adminFetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", text: "", rating: 5, date: "Just now" });
    setShowAdd(false);
    fetchReviews();
    setToast("Review added successfully!");
  };

  const updateField = (id: number, field: string, value: unknown) => {
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const getField = (review: Review, field: string) => {
    return (edits[review.id] as Record<string, unknown>)?.[field] ?? (review as unknown as Record<string, unknown>)[field];
  };

  const saveReview = async (id: number) => {
    const fields = edits[id];
    if (!fields || Object.keys(fields).length === 0) {
      setEditing(null);
      return;
    }
    await adminFetch("/api/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...fields }),
    });
    setEdits((prev) => { const next = { ...prev }; delete next[id]; return next; });
    fetchReviews();
    setEditing(null);
    setToast("Review updated successfully!");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this review?")) return;
    await adminFetch(`/api/reviews?id=${id}`, { method: "DELETE" });
    fetchReviews();
    setToast("Review deleted successfully!");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-fg mb-2">Reviews</h1>
          <p className="text-sm text-muted">Manage customer reviews and testimonials</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-xs cursor-pointer">
          {showAdd ? "Cancel" : "+ Add Review"}
        </button>
      </div>

      {showAdd && (
        <div className="bg-surface rounded-2xl border border-border p-6 mb-6">
          <h3 className="text-sm font-semibold text-fg mb-4">Add New Review</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input type="text" placeholder="Reviewer name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="px-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent" />
            <input type="text" placeholder="Date (e.g. 2 months ago)" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="px-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent" />
          </div>
          <div className="mb-3">
            <label className="block text-xs uppercase tracking-wider text-muted font-semibold mb-1">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setForm((p) => ({ ...p, rating: star }))} className="cursor-pointer">
                  <svg width="24" height="24" viewBox="0 0 20 20" fill={star <= form.rating ? "#b8860b" : "none"} stroke="#b8860b" strokeWidth="1">
                    <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.62l5.34-.78L10 1z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <textarea placeholder="Review text" value={form.text} onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))} rows={3} className="w-full px-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent resize-y mb-3" />
          <button onClick={handleAdd} disabled={!form.name || !form.text} className="btn-primary text-xs cursor-pointer disabled:opacity-50">Add Review</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted text-sm">Loading...</div>
      ) : (
        <div className="space-y-3">
          {reviewsList.map((review) => (
            <div key={review.id} className="bg-surface rounded-2xl border border-border p-4 group">
              {editing === review.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" value={String(getField(review, "name") ?? "")} onChange={(e) => updateField(review.id, "name", e.target.value)} className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent" />
                    <input type="text" value={String(getField(review, "date") ?? "")} onChange={(e) => updateField(review.id, "date", e.target.value)} className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent" />
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => updateField(review.id, "rating", star)} className="cursor-pointer">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill={star <= Number(getField(review, "rating")) ? "#b8860b" : "none"} stroke="#b8860b" strokeWidth="1">
                          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.62l5.34-.78L10 1z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <textarea value={String(getField(review, "text") ?? "")} onChange={(e) => updateField(review.id, "text", e.target.value)} rows={3} className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent resize-y" />
                  <button onClick={() => saveReview(review.id)} className="text-xs text-accent hover:underline cursor-pointer mr-3">Save</button>
                  <button onClick={() => { setEdits((prev) => { const next = { ...prev }; delete next[review.id]; return next; }); setEditing(null); }} className="text-xs text-muted hover:underline cursor-pointer">Cancel</button>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-fg">{review.name}</span>
                      <span className="text-xs text-muted">{review.date}</span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} width="12" height="12" viewBox="0 0 20 20" fill={star <= review.rating ? "#b8860b" : "none"} stroke="#b8860b" strokeWidth="1">
                          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.62l5.34-.78L10 1z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs text-muted line-clamp-2">{review.text}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => editing === review.id ? saveReview(review.id) : setEditing(review.id)} className="w-7 h-7 bg-bg border border-border rounded-full flex items-center justify-center hover:border-accent cursor-pointer">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(review.id)} className="w-7 h-7 bg-bg border border-border rounded-full flex items-center justify-center hover:border-red-500 cursor-pointer">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3,6 5,6 21,6" /><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" /></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
