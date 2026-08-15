"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Toast from "@/components/Toast";
import { adminFetch } from "@/lib/adminFetch";

export default function HomepageSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const desktopRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" }).then((r) => r.json()).then(setSettings);
  }, []);

  const handleUpload = async (key: string, file: File) => {
    setUploading(key);
    const formData = new FormData();
    formData.append("file", file);
    const res = await adminFetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) {
      setSettings((prev) => ({ ...prev, [key]: data.url }));
    }
    setUploading(null);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-fg mb-2">Homepage Images</h1>
          <p className="text-sm text-muted">Update the hero background images for desktop and mobile</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-xs cursor-pointer disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h3 className="text-sm font-semibold text-fg mb-4">Desktop Hero Image</h3>
          <input ref={desktopRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload("homeImage", file);
          }} />
          <div className="relative aspect-video rounded-xl overflow-hidden bg-surface-muted mb-4">
            {settings.homeImage ? (
              <Image src={settings.homeImage} alt="Desktop hero" fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-muted text-sm">No image</div>
            )}
            {uploading === "homeImage" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-sm">Uploading...</span>
              </div>
            )}
          </div>
          <button onClick={() => desktopRef.current?.click()} className="btn-upload text-xs w-full" disabled={uploading !== null}>
            Upload New Image
          </button>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6">
          <h3 className="text-sm font-semibold text-fg mb-4">Mobile Hero Image</h3>
          <input ref={mobileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload("homeMobileImage", file);
          }} />
          <div className="relative aspect-[9/16] max-h-[300px] rounded-xl overflow-hidden bg-surface-muted mb-4">
            {settings.homeMobileImage ? (
              <Image src={settings.homeMobileImage} alt="Mobile hero" fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-muted text-sm">No image</div>
            )}
            {uploading === "homeMobileImage" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-sm">Uploading...</span>
              </div>
            )}
          </div>
          <button onClick={() => mobileRef.current?.click()} className="btn-upload text-xs w-full" disabled={uploading !== null}>
            Upload New Image
          </button>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
