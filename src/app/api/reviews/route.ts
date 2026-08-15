import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const allReviews = await db.select().from(reviews).orderBy(reviews.order);
  return NextResponse.json(allReviews, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const maxOrder = await db.select({ max: reviews.order }).from(reviews);
    const nextOrder = (maxOrder[0]?.max ?? -1) + 1;
    const result = await db.insert(reviews).values({
      name: body.name || "",
      text: body.text || "",
      rating: body.rating ?? 5,
      date: body.date || "Just now",
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
    const { id, name, text, rating, date, order } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const existing = await db.select({ id: reviews.id }).from(reviews).where(eq(reviews.id, id)).limit(1);
    if (existing.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const allowed: Record<string, unknown> = {};
    if (name !== undefined) allowed.name = name;
    if (text !== undefined) allowed.text = text;
    if (rating !== undefined) allowed.rating = rating;
    if (date !== undefined) allowed.date = date;
    if (order !== undefined) allowed.order = order;
    await db.update(reviews).set(allowed).where(eq(reviews.id, id));
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
  const existing = await db.select({ id: reviews.id }).from(reviews).where(eq(reviews.id, id)).limit(1);
  if (existing.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.delete(reviews).where(eq(reviews.id, id));
  return NextResponse.json({ ok: true });
}
