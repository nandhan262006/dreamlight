"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Toast from "@/components/Toast";
import { adminFetch } from "@/lib/adminFetch";

export default function AboutSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await adminFetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) {
      setSettings((prev) => ({ ...prev, aboutImage: data.url }));
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await adminFetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setToast("Changes saved successfully!");
  };

  const updateField = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const aboutParagraphs = (() => {
    try {
      const parsed = JSON.parse(settings.aboutDescription || "[]");
      return Array.isArray(parsed) ? parsed.join("\n\n") : settings.aboutDescription || "";
    } catch {
      return settings.aboutDescription || "";
    }
  })();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-fg mb-2">About Section</h1>
          <p className="text-sm text-muted">Edit the about section content and image</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-xs cursor-pointer disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h3 className="text-sm font-semibold text-fg mb-4">About Image</h3>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }} />
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-muted mb-4">
            {settings.aboutImage ? (
              <Image src={settings.aboutImage} alt="About" fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-muted text-sm">No image</div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-sm">Uploading...</span>
              </div>
            )}
          </div>
          <button onClick={() => fileRef.current?.click()} className="btn-outline text-xs w-full cursor-pointer" disabled={uploading}>
            Upload Image
          </button>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted font-semibold mb-2">Title</label>
              <input
                type="text"
                value={settings.aboutTitle || ""}
                onChange={(e) => updateField("aboutTitle", e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted font-semibold mb-2">Name</label>
              <input
                type="text"
                value={settings.aboutName || ""}
                onChange={(e) => updateField("aboutName", e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted font-semibold mb-2">Role</label>
              <input
                type="text"
                value={settings.aboutRole || ""}
                onChange={(e) => updateField("aboutRole", e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted font-semibold mb-2">Location</label>
              <input
                type="text"
                value={settings.aboutLocation || ""}
                onChange={(e) => updateField("aboutLocation", e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted font-semibold mb-2">
                Description (paragraphs separated by blank lines)
              </label>
              <textarea
                value={aboutParagraphs}
                onChange={(e) => {
                  const paragraphs = e.target.value.split("\n\n").filter(Boolean);
                  updateField("aboutDescription", JSON.stringify(paragraphs));
                }}
                rows={8}
                className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent transition-colors resize-y"
              />
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
