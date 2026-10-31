// Calendar helpers for the salon's local timezone.
//
// The server usually runs in UTC, but "today", "this week" and "this month"
// must follow the salon's wall clock (IST by default). Otherwise bills made
// between 00:00 and 05:30 IST land on the wrong day.

const BUSINESS_TZ = process.env.BUSINESS_TIMEZONE || 'Asia/Kolkata';
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatters = new Map();
function formatter(tz) {
  if (!formatters.has(tz)) {
    formatters.set(tz, new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hourCycle: 'h23',
      weekday: 'short',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }));
  }
  return formatters.get(tz);
}

// Wall-clock fields of an instant in the business timezone (month is 0-based).
function zonedParts(date, tz = BUSINESS_TZ) {
  const out = {};
  for (const p of formatter(tz).formatToParts(date)) out[p.type] = p.value;
  return {
    year: Number(out.year),
    month: Number(out.month) - 1,
    day: Number(out.day),
    hour: Number(out.hour),
    minute: Number(out.minute),
    second: Number(out.second),
    weekday: WEEKDAYS.indexOf(out.weekday), // 0 = Sunday
  };
}

function offsetMs(date, tz) {
  const p = zonedParts(date, tz);
  const asUtc = Date.UTC(p.year, p.month, p.day, p.hour, p.minute, p.second);
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

// The instant at which the wall clock in `tz` reads the given time.
// Out-of-range fields roll over like Date.UTC (day 0 = last day of prev month).
function zonedTime(year, month, day, hour = 0, tz = BUSINESS_TZ) {
  const wall = Date.UTC(year, month, day, hour);
  const first = wall - offsetMs(new Date(wall), tz);
  // Re-check once in case the offset differs at the target instant (DST zones).
  return new Date(wall - offsetMs(new Date(first), tz));
}

// Today / this week (Monday start) / this month, each with a like-for-like
// previous window: the same amount of elapsed time in the previous period.
function salesPeriods(now = new Date(), tz = BUSINESS_TZ) {
  const p = zonedParts(now, tz);
  const sinceMonday = (p.weekday + 6) % 7;

  const build = (start, end, prevStart) => ({
    start,
    end,
    prevStart,
    prevEnd: new Date(Math.min(prevStart.getTime() + (now - start), start.getTime())),
  });

  return {
    today: build(
      zonedTime(p.year, p.month, p.day, 0, tz),
      zonedTime(p.year, p.month, p.day + 1, 0, tz),
      zonedTime(p.year, p.month, p.day - 1, 0, tz),
    ),
    week: build(
      zonedTime(p.year, p.month, p.day - sinceMonday, 0, tz),
      zonedTime(p.year, p.month, p.day - sinceMonday + 7, 0, tz),
      zonedTime(p.year, p.month, p.day - sinceMonday - 7, 0, tz),
    ),
    month: build(
      zonedTime(p.year, p.month, 1, 0, tz),
      zonedTime(p.year, p.month + 1, 1, 0, tz),
      zonedTime(p.year, p.month - 1, 1, 0, tz),
    ),
  };
}

module.exports = { BUSINESS_TZ, WEEKDAYS, zonedParts, zonedTime, salesPeriods };
