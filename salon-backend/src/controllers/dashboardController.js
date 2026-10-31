const prisma = require('../config/db');
const { WEEKDAYS, zonedParts, zonedTime, salesPeriods } = require('../utils/businessTime');

// Sales = bills that are paid (pending/DUE bills are excluded), matching Reports.
const SALE_FILTER = { paymentStatus: { not: 'DUE' } };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PAYMENT_MODES = ['CASH', 'UPI', 'CARD', 'WALLET'];

const round2 = (n) => Math.round(n * 100) / 100;

function totalsIn(invoices, start, end) {
  let sales = 0;
  let bills = 0;
  for (const inv of invoices) {
    if (inv.createdAt >= start && inv.createdAt < end) {
      sales += inv.totalAmount;
      bills += 1;
    }
  }
  return { sales: round2(sales), bills };
}

function hourLabel(h) {
  return `${h % 12 || 12} ${h < 12 ? 'AM' : 'PM'}`;
}

// Chart buckets for a period, in the salon's timezone.
function bucketsFor(period, now) {
  const p = zonedParts(now);
  const buckets = [];

  if (period === 'today') {
    for (let h = 0; h < 24; h++) {
      buckets.push({
        label: hourLabel(h),
        start: zonedTime(p.year, p.month, p.day, h),
        end: zonedTime(p.year, p.month, p.day, h + 1),
      });
    }
  } else if (period === 'week') {
    const monday = p.day - ((p.weekday + 6) % 7);
    for (let i = 0; i < 7; i++) {
      const start = zonedTime(p.year, p.month, monday + i);
      const d = zonedParts(start);
      buckets.push({
        label: `${WEEKDAYS[d.weekday]} ${d.day}`,
        start,
        end: zonedTime(p.year, p.month, monday + i + 1),
      });
    }
  } else if (period === 'month') {
    const daysInMonth = new Date(Date.UTC(p.year, p.month + 1, 0)).getUTCDate();
    for (let d = 1; d <= daysInMonth; d++) {
      buckets.push({
        label: `${d} ${MONTHS[p.month]}`,
        start: zonedTime(p.year, p.month, d),
        end: zonedTime(p.year, p.month, d + 1),
      });
    }
  } else {
    // Last 6 months, including the current one.
    for (let i = 5; i >= 0; i--) {
      const start = zonedTime(p.year, p.month - i, 1);
      const d = zonedParts(start);
      buckets.push({
        label: `${MONTHS[d.month]} ${d.year}`,
        start,
        end: zonedTime(p.year, p.month - i + 1, 1),
      });
    }
  }
  return buckets;
}

const dashboardController = {
  async summary(req, res, next) {
    try {
      const now = new Date();
      const periods = salesPeriods(now);
      const today = periods.today.start;
      const tomorrow = periods.today.end;
      const startOfMonth = periods.month.start;
      const earliest = new Date(Math.min(periods.week.prevStart, periods.month.prevStart));

      const [
        invoices,
        todaysAppointments,
        newCustomersThisMonth,
        totalCustomers,
        noShowCount,
        totalAppointmentsThisMonth,
      ] = await Promise.all([
        prisma.invoice.findMany({
          where: { ...SALE_FILTER, createdAt: { gte: earliest, lt: tomorrow } },
          select: { createdAt: true, totalAmount: true },
        }),
        prisma.appointment.count({
          where: { date: { gte: today, lt: tomorrow }, status: { not: 'CANCELLED' } },
        }),
        prisma.customer.count({
          where: { createdAt: { gte: startOfMonth } },
        }),
        prisma.customer.count(),
        prisma.appointment.count({
          where: { date: { gte: startOfMonth }, status: 'NO_SHOW' },
        }),
        prisma.appointment.count({
          where: { date: { gte: startOfMonth }, status: { not: 'CANCELLED' } },
        }),
      ]);

      const sales = {};
      for (const [key, range] of Object.entries(periods)) {
        const current = totalsIn(invoices, range.start, range.end);
        const previous = totalsIn(invoices, range.prevStart, range.prevEnd);
        sales[key] = {
          ...current,
          avgBill: current.bills ? round2(current.sales / current.bills) : 0,
          // Same elapsed time in the previous period (e.g. yesterday up to now).
          previous: previous.sales,
          changePercent: previous.sales > 0
            ? round2(((current.sales - previous.sales) / previous.sales) * 100)
            : null,
          from: range.start,
          to: range.end,
        };
      }

      res.json({
        sales,
        todaysAppointments,
        todaysRevenue: sales.today.sales,
        newCustomersThisMonth,
        totalCustomers,
        noShowRate: totalAppointmentsThisMonth > 0
          ? ((noShowCount / totalAppointmentsThisMonth) * 100).toFixed(1)
          : 0,
      });
    } catch (err) { next(err); }
  },

  // Sales breakdown for one period: chart buckets plus payment-mode split.
  // period = today (hourly) | week (daily, Mon-Sun) | month (daily) | 6m (monthly)
  async sales(req, res, next) {
    try {
      const period = String(req.query.period || 'week');
      if (!['today', 'week', 'month', '6m'].includes(period)) {
        return res.status(400).json({ error: 'period must be one of today, week, month, 6m' });
      }

      const buckets = bucketsFor(period, new Date());
      const from = buckets[0].start;
      const to = buckets[buckets.length - 1].end;

      const invoices = await prisma.invoice.findMany({
        where: { ...SALE_FILTER, createdAt: { gte: from, lt: to } },
        select: { createdAt: true, totalAmount: true, paymentMode: true },
      });

      const data = buckets.map((b) => ({ label: b.label, sales: 0, bills: 0 }));
      const byMode = {};
      let total = 0;

      for (const inv of invoices) {
        const i = buckets.findIndex((b) => inv.createdAt >= b.start && inv.createdAt < b.end);
        if (i === -1) continue;
        data[i].sales += inv.totalAmount;
        data[i].bills += 1;
        total += inv.totalAmount;
        const mode = byMode[inv.paymentMode] || (byMode[inv.paymentMode] = { amount: 0, bills: 0 });
        mode.amount += inv.totalAmount;
        mode.bills += 1;
      }
      data.forEach((d) => { d.sales = round2(d.sales); });

      // For today, show business hours (9 AM - 9 PM) widened to any hour with sales.
      let chart = data;
      if (period === 'today') {
        const withSales = data.map((d, h) => (d.bills ? h : -1)).filter((h) => h >= 0);
        const first = Math.min(9, ...withSales);
        const last = Math.max(21, ...withSales);
        chart = data.slice(first, last + 1);
      }

      const modes = [...PAYMENT_MODES, ...Object.keys(byMode).filter((m) => !PAYMENT_MODES.includes(m))];

      res.json({
        period,
        from,
        to,
        totals: {
          sales: round2(total),
          bills: invoices.length,
          avgBill: invoices.length ? round2(total / invoices.length) : 0,
        },
        byMode: modes.map((m) => ({
          mode: m,
          amount: round2(byMode[m]?.amount || 0),
          bills: byMode[m]?.bills || 0,
        })),
        data: chart,
      });
    } catch (err) { next(err); }
  },

  async revenueChart(req, res, next) {
    try {
      const { months = 6 } = req.query;
      const data = [];
      const now = new Date();

      for (let i = parseInt(months) - 1; i >= 0; i--) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

        const result = await prisma.invoice.aggregate({
          _sum: { totalAmount: true },
          where: { createdAt: { gte: start, lte: end }, paymentStatus: { not: 'DUE' } },
        });

        data.push({
          month: start.toLocaleString('default', { month: 'short', year: 'numeric' }),
          revenue: result._sum.totalAmount || 0,
        });
      }

      res.json({ data });
    } catch (err) { next(err); }
  },

  async topServices(req, res, next) {
    try {
      const { limit = 5 } = req.query;
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

      const results = await prisma.appointmentService.groupBy({
        by: ['serviceId'],
        _count: { serviceId: true },
        where: {
          appointment: { date: { gte: startOfMonth }, status: 'COMPLETED' },
        },
        orderBy: { _count: { serviceId: 'desc' } },
        take: parseInt(limit),
      });

      const serviceIds = results.map((r) => r.serviceId);
      const services = await prisma.service.findMany({ where: { id: { in: serviceIds } } });

      const data = results.map((r) => {
        const service = services.find((s) => s.id === r.serviceId);
        return {
          serviceId: r.serviceId,
          name: service?.name || 'Unknown',
          bookings: r._count.serviceId,
          revenue: (service?.price || 0) * r._count.serviceId,
        };
      });

      res.json({ data });
    } catch (err) { next(err); }
  },

  async stylistPerformance(req, res, next) {
    try {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

      const stylists = await prisma.user.findMany({
        where: { role: 'STYLIST', isActive: true },
        select: { id: true, name: true },
      });

      const data = await Promise.all(
        stylists.map(async (stylist) => {
          const [appointmentCount, revenue] = await Promise.all([
            prisma.appointment.count({
              where: { stylistId: stylist.id, date: { gte: startOfMonth }, status: 'COMPLETED' },
            }),
            prisma.invoice.aggregate({
              _sum: { totalAmount: true },
              where: {
                appointment: { stylistId: stylist.id, date: { gte: startOfMonth }, status: 'COMPLETED' },
                paymentStatus: 'PAID',
              },
            }),
          ]);
          return {
            stylistId: stylist.id,
            name: stylist.name,
            appointments: appointmentCount,
            revenue: revenue._sum.totalAmount || 0,
          };
        })
      );

      res.json({ data: data.sort((a, b) => b.revenue - a.revenue) });
    } catch (err) { next(err); }
  },

  async customerBreakdown(req, res, next) {
    try {
      const [newCustomers, returningCustomers, total] = await Promise.all([
        prisma.customer.count({ where: { totalVisits: { lte: 1 } } }),
        prisma.customer.count({ where: { totalVisits: { gt: 1 } } }),
        prisma.customer.count(),
      ]);

      res.json({
        data: {
          new: newCustomers,
          returning: returningCustomers,
          total,
          newPercent: total > 0 ? ((newCustomers / total) * 100).toFixed(1) : 0,
          returningPercent: total > 0 ? ((returningCustomers / total) * 100).toFixed(1) : 0,
        },
      });
    } catch (err) { next(err); }
  },
};

module.exports = dashboardController;
