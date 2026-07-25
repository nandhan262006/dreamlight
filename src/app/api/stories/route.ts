import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { stories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const allStories = await db.select().from(stories).orderBy(stories.order);
  return NextResponse.json(allStories);
}

export async function POST(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;

  const body = await request.json();
  const maxOrder = await db.select({ max: stories.order }).from(stories);
  const nextOrder = (maxOrder[0]?.max ?? -1) + 1;
  const result = await db.insert(stories).values({
    date: body.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    location: body.location || "",
    title: body.title || "",
    excerpt: body.excerpt || "",
    category: body.category || "Wedding",
    featured: body.featured || false,
    images: body.images || "[]",
    order: nextOrder,
  }).returning();
  return NextResponse.json(result[0]);
}

export async function PUT(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;

  const body = await request.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const existing = await db.select({ id: stories.id }).from(stories).where(eq(stories.id, id)).limit(1);
  if (existing.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.update(stories).set(fields).where(eq(stories.id, id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const existing = await db.select({ id: stories.id }).from(stories).where(eq(stories.id, id)).limit(1);
  if (existing.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.delete(stories).where(eq(stories.id, id));
  return NextResponse.json({ ok: true });
}
