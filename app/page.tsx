"use client";

import { useEffect, useMemo, useState } from "react";

const courts = [
  { id: "court-1", name: "Court 1", sport: "Basketball", surface: "Hardwood", accent: "orange" },
  { id: "court-2", name: "Court 2", sport: "Basketball", surface: "Hardwood", accent: "blue" },
  { id: "court-3", name: "Court 3", sport: "Badminton", surface: "Synthetic", accent: "green" },
  { id: "court-4", name: "Court 4", sport: "Volleyball", surface: "Turf", accent: "purple" }
];
const times = Array.from({ length: 17 }, (_, i) => `${String(i + 6).padStart(2, "0")}:00`);
const sports = ["All sports", "Basketball", "Badminton", "Volleyball"];

// Matches the `bookings` table / GET /api/bookings response (snake_case).
type Booking = {
  id: string;
  booking_date: string;
  court_id: string;
  sport: string;
  start_time: string;
  end_time: string;
  customer_name: string;
  created_at: string;
};

// Matches the POST /api/bookings success response, which the route builds
// as `{ id, ...booking }` from its camelCase BookingInput type.
type BookingPostResponse = {
  id: string;
  bookingDate: string;
  courtId: string;
  sport: string;
  startTime: string;
  endTime: string;
  customerName: string;
};

type BookingErrorResponse = { error: string };

function prettyDate(date: Date) { return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); }
function iso(date: Date) { return date.toISOString().slice(0, 10); }

export default function Home() {
  const [date, setDate] = useState(() => new Date());
  const [sport, setSport] = useState("All sports");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selected, setSelected] = useState<{ court: typeof courts[number], time: string } | null>(null);
  const [name, setName] = useState("");
  const [notice, setNotice] = useState("");
  const dateKey = iso(date);

  const visibleCourts = useMemo(() => sport === "All sports" ? courts : courts.filter(c => c.sport === sport), [sport]);

  async function loadBookings() {
    try {
      const r = await fetch(`/api/bookings?date=${dateKey}`, { cache: "no-store" });
      if (r.ok) setBookings((await r.json()) as Booking[]);
    } catch { /* UI still works in preview mode */ }
  }
  useEffect(() => { loadBookings(); }, [dateKey]);

  function isBooked(courtId: string, time: string) { return bookings.some(b => b.court_id === courtId && b.start_time === time); }

  async function book() {
    if (!selected || !name.trim()) return;
    setNotice("");
    const hour = Number(selected.time.slice(0, 2));
    const end = `${String(hour + 1).padStart(2, "0")}:00`;
    const r = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingDate: dateKey,
        courtId: selected.court.id,
        sport: selected.court.sport,
        startTime: selected.time,
        endTime: end,
        customerName: name
      })
    });
    const data = (await r.json()) as BookingPostResponse | BookingErrorResponse;
    if (!r.ok) { setNotice("error" in data ? data.error : "Could not book this slot."); return; }

    const booked = data as BookingPostResponse;
    const newBooking: Booking = {
      id: booked.id,
      booking_date: booked.bookingDate,
      court_id: booked.courtId,
      sport: booked.sport,
      start_time: booked.startTime,
      end_time: booked.endTime,
      customer_name: booked.customerName,
      created_at: new Date().toISOString()
    };
    setBookings(prev => [...prev, newBooking]);
    setSelected(null); setName(""); setNotice("Booking confirmed.");
  }

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark">C</div><div><strong>CourtFlow</strong><span>Sports Center Scheduler</span></div></div>
      <div className="top-actions"><span className="live-dot" /> Live availability <button className="admin">Admin</button></div>
    </header>

    <section className="hero">
      <div><p className="eyebrow">BOOK A COURT</p><h1>Find your next game.</h1><p className="sub">Check live court availability and reserve a one-hour slot.</p></div>
      <div className="stats"><div><b>{visibleCourts.length}</b><span>Courts</span></div><div><b>{times.length}</b><span>Daily slots</span></div><div><b>{bookings.length}</b><span>Booked today</span></div></div>
    </section>

    <section className="controls">
      <button className="date-arrow" onClick={() => setDate(d => new Date(d.getTime() - 86400000))}>‹</button>
      <div className="date-box"><span>SELECT DATE</span><strong>{prettyDate(date)}</strong></div>
      <button className="date-arrow" onClick={() => setDate(d => new Date(d.getTime() + 86400000))}>›</button>
      <button className="today" onClick={() => setDate(new Date())}>Today</button>
      <div className="spacer" />
      <select value={sport} onChange={e => setSport(e.target.value)}>{sports.map(s => <option key={s}>{s}</option>)}</select>
    </section>

    {notice && <div className="notice">{notice}</div>}

    <section className="scheduler">
      <div className="time-column"><div className="time-head">TIME</div>{times.map(t => <div className="time" key={t}>{t}</div>)}</div>
      {visibleCourts.map(court => <div className="court" key={court.id}>
        <div className={`court-head ${court.accent}`}><div><strong>{court.name}</strong><span>{court.sport} · {court.surface}</span></div><i>●</i></div>
        {times.map(time => {
          const booked = isBooked(court.id, time);
          return <button disabled={booked} key={time} className={`slot ${booked ? "booked" : "available"}`} onClick={() => setSelected({ court, time })}>{booked ? "Booked" : "Available"}</button>;
        })}
      </div>)}
    </section>

    <footer><span>© 2026 CourtFlow</span><span>Availability updates automatically after each reservation.</span></footer>

    {selected && <div className="overlay" onMouseDown={e => e.currentTarget === e.target && setSelected(null)}><div className="modal">
      <button className="close" onClick={() => setSelected(null)}>×</button><p className="eyebrow">RESERVE SLOT</p><h2>{selected.court.name}</h2><p className="modal-time">{prettyDate(date)} · {selected.time}–{String(Number(selected.time.slice(0, 2)) + 1).padStart(2, "0")}:00</p>
      <label>Your name<input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Jose Lavides" onKeyDown={e => e.key === "Enter" && book()} /></label>
      <button className="confirm" disabled={!name.trim()} onClick={book}>Confirm reservation</button>
    </div></div>}
  </main>;
}
