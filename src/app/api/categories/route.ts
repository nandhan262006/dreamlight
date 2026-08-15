import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const where = type ? eq(categories.type, type) : undefined;
  const all = await db.select().from(categories).where(where).orderBy(categories.order);
  return NextResponse.json(all, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    if (!body.name || !body.type) {
      return NextResponse.json({ error: "name and type are required" }, { status: 400 });
    }
    const maxOrder = await db
      .select({ max: categories.order })
      .from(categories)
      .where(eq(categories.type, body.type));
    const nextOrder = (maxOrder[0]?.max ?? -1) + 1;
    const result = await db
      .insert(categories)
      .values({
        name: body.name,
        type: body.type,
        order: nextOrder,
      })
      .returning();
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
    const { id, name, type, order } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const existing = await db.select({ id: categories.id }).from(categories).where(eq(categories.id, id)).limit(1);
    if (existing.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const allowed: Record<string, unknown> = {};
    if (name !== undefined) allowed.name = name;
    if (type !== undefined) allowed.type = type;
    if (order !== undefined) allowed.order = order;
    await db.update(categories).set(allowed).where(eq(categories.id, id));
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
  const existing = await db.select({ id: categories.id }).from(categories).where(eq(categories.id, id)).limit(1);
  if (existing.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.delete(categories).where(eq(categories.id, id));
  return NextResponse.json({ ok: true });
}
