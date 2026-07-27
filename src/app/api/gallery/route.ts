import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const images = await db.select().from(galleryImages).orderBy(galleryImages.order);
  return NextResponse.json(images, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}

export async function POST(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    if (!body.src) {
      return NextResponse.json({ error: "src is required" }, { status: 400 });
    }
    const maxOrder = await db.select({ max: galleryImages.order }).from(galleryImages);
    const nextOrder = (maxOrder[0]?.max ?? -1) + 1;
    const result = await db.insert(galleryImages).values({
      src: body.src,
      alt: body.alt || "",
      category: body.category || "Wedding",
      title: body.title || "",
      featured: body.featured || false,
      order: nextOrder,
    }).returning();
    return NextResponse.json(result[0]);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const { id, src, alt, category, title, featured, order } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const existing = await db.select({ id: galleryImages.id }).from(galleryImages).where(eq(galleryImages.id, id)).limit(1);
    if (existing.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const allowed: Record<string, unknown> = {};
    if (src !== undefined) allowed.src = src;
    if (alt !== undefined) allowed.alt = alt;
    if (category !== undefined) allowed.category = category;
    if (title !== undefined) allowed.title = title;
    if (featured !== undefined) allowed.featured = featured;
    if (order !== undefined) allowed.order = order;
    await db.update(galleryImages).set(allowed).where(eq(galleryImages.id, id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const existing = await db.select({ id: galleryImages.id }).from(galleryImages).where(eq(galleryImages.id, id)).limit(1);
  if (existing.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.delete(galleryImages).where(eq(galleryImages.id, id));
  return NextResponse.json({ ok: true });
}
