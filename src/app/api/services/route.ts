import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const allServices = await db.select().from(services).orderBy(services.order);
  return NextResponse.json(allServices, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}

export async function POST(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;

  const body = await request.json();
  const maxOrder = await db.select({ max: services.order }).from(services);
  const nextOrder = (maxOrder[0]?.max ?? -1) + 1;
  const result = await db.insert(services).values({
    title: body.title || "",
    description: body.description || "",
    imageUrl: body.imageUrl || "",
    category: body.category || "Photography",
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
  const existing = await db.select({ id: services.id }).from(services).where(eq(services.id, id)).limit(1);
  if (existing.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.update(services).set(fields).where(eq(services.id, id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const existing = await db.select({ id: services.id }).from(services).where(eq(services.id, id)).limit(1);
  if (existing.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.delete(services).where(eq(services.id, id));
  return NextResponse.json({ ok: true });
}
