import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";


export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date is required" }, { status: 400 });
  const db = getDB();
  const { results } = await db.prepare("SELECT * FROM bookings WHERE booking_date = ? ORDER BY start_time, court_id").bind(date).all();
  return NextResponse.json(results);
}

type BookingInput = {
  bookingDate: string;
  courtId: string;
  sport: string;
  startTime: string;
  endTime: string;
  customerName: string;
};

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid booking details" }, { status: 400 });
  }

  const input = body as Partial<BookingInput>;
  const required: Array<keyof BookingInput> = [
    "bookingDate",
    "courtId",
    "sport",
    "startTime",
    "endTime",
    "customerName"
  ];

  if (required.some((key) => typeof input[key] !== "string" || !input[key]?.trim())) {
    return NextResponse.json({ error: "Missing booking details" }, { status: 400 });
  }

  const booking: BookingInput = {
    bookingDate: input.bookingDate!,
    courtId: input.courtId!,
    sport: input.sport!,
    startTime: input.startTime!,
    endTime: input.endTime!,
    customerName: input.customerName!.trim()
  };

  const id = crypto.randomUUID();
  const db = getDB();
  try {
    await db.prepare(
      `INSERT INTO bookings (id, booking_date, court_id, sport, start_time, end_time, customer_name) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      booking.bookingDate,
      booking.courtId,
      booking.sport,
      booking.startTime,
      booking.endTime,
      booking.customerName
    ).run();

    return NextResponse.json({ id, ...booking }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "That court and time was just booked. Please choose another slot." },
      { status: 409 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  await getDB().prepare("DELETE FROM bookings WHERE id = ?").bind(id).run();
  return NextResponse.json({ ok: true });
}
