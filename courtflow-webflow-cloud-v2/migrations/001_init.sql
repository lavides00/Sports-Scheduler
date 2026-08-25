CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  booking_date TEXT NOT NULL,
  court_id TEXT NOT NULL,
  sport TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(booking_date, court_id, start_time)
);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
