import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";


export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date is required" }, { status: 400 });
  const db = getDB();
  const { results } = await db.prepare("SELECT * FROM bookings WHERE booking_date = ? ORDER BY start_time, court_id").bind(date).all();
  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const required = ["bookingDate","courtId","sport","startTime","endTime","customerName"];
  if (required.some((key) => !body[key])) return NextResponse.json({ error: "Missing booking details" }, { status: 400 });
  const id = crypto.randomUUID();
  const db = getDB();
  try {
    await db.prepare(`INSERT INTO bookings (id, booking_date, court_id, sport, start_time, end_time, customer_name) VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .bind(id, body.bookingDate, body.courtId, body.sport, body.startTime, body.endTime, body.customerName.trim()).run();
    return NextResponse.json({ id, ...body }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "That court and time was just booked. Please choose another slot." }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  await getDB().prepare("DELETE FROM bookings WHERE id = ?").bind(id).run();
  return NextResponse.json({ ok: true });
}
