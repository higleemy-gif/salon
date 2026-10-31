import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee, CalendarDays, CalendarRange, Users, Plus, FileText, ArrowRight,
  ArrowUpRight, ArrowDownRight, Banknote, Smartphone, CreditCard, Wallet,
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useSettings } from '../context/SettingsContext';
import { dashboard as dashboardApi, invoices as invoicesApi } from '../services/api';
import { formatMoney, formatDate } from '../lib/format';

const PERIODS = [
  { key: 'today', label: 'Today', card: "Today's sales", compare: 'yesterday', icon: IndianRupee, chartTitle: 'Hourly sales today' },
  { key: 'week', label: 'This week', card: 'This week', compare: 'last week', icon: CalendarDays, chartTitle: 'Daily sales this week' },
  { key: 'month', label: 'This month', card: 'This month', compare: 'last month', icon: CalendarRange, chartTitle: 'Daily sales this month' },
  { key: '6m', label: '6 months', chartTitle: 'Monthly sales (last 6 months)' },
];

const MODE_META = {
  CASH: { label: 'Cash', icon: Banknote },
  UPI: { label: 'UPI', icon: Smartphone },
  CARD: { label: 'Card', icon: CreditCard },
  WALLET: { label: 'Wallet', icon: Wallet },
};

function SalesCard({ period, stats, currency, active, onSelect }) {
  const Icon = period.icon;
  const change = stats?.changePercent;
  const up = change != null && change >= 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`text-left bg-white rounded-xl border shadow-card p-3 sm:p-5 hover:shadow-card-hover transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
        active ? 'border-primary-400 ring-1 ring-primary-200' : 'border-surface-100'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-surface-500 font-medium">{period.card}</p>
          <p className="text-lg sm:text-2xl font-bold text-surface-800 mt-1">{formatMoney(stats?.sales || 0, currency)}</p>
          <p className="text-xs text-surface-400 mt-1">
            {stats?.bills || 0} {stats?.bills === 1 ? 'bill' : 'bills'}
            {stats?.bills ? ` · Avg ${formatMoney(stats.avgBill, currency)}` : ''}
          </p>
          {change != null && (
            <p
              className={`text-xs mt-1 flex items-center gap-0.5 ${up ? 'text-success-600' : 'text-danger-600'}`}
              title={`Compared with ${period.compare} up to the same point (${formatMoney(stats.previous, currency)})`}
            >
              {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(change).toFixed(0)}% vs {period.compare}
            </p>
          )}
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-primary-50 flex items-center justify-center">
          <Icon size={20} className="text-primary-500" />
        </div>
      </div>
    </button>
  );
}

export default function DashboardPage() {
  const salon = useSettings();
  const currency = salon.currency || 'INR';

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);

  const [period, setPeriod] = useState('week');
  // Last loaded breakdown; kept on screen (dimmed) while the next period loads.
  const [salesState, setSalesState] = useState({ period: null, data: null });
  const sales = salesState.data;
  const salesLoading = salesState.period !== period;

  useEffect(() => {
    Promise.all([
      dashboardApi.summary().catch(() => null),
      invoicesApi.list({ limit: 8 }).catch(() => ({ data: [] })),
    ]).then(([s, inv]) => {
      setSummary(s);
      setRecent(inv.data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    dashboardApi.sales(period)
      .catch(() => null)
      .then((res) => {
        if (!cancelled) setSalesState({ period, data: res });
      });
    return () => { cancelled = true; };
  }, [period]);

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;

  const current = PERIODS.find((p) => p.key === period);
  const chart = sales?.data || [];
  const hasSales = chart.some((d) => d.sales > 0);
  const modes = (sales?.byMode || []).filter((m) => m.bills > 0 || MODE_META[m.mode]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your salon at a glance"
        actions={<Link to="/bill"><Button><Plus size={16} /> New Bill</Button></Link>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        {PERIODS.filter((p) => p.card).map((p) => (
          <SalesCard
            key={p.key}
            period={p}
            stats={summary?.sales?.[p.key]}
            currency={currency}
            active={period === p.key}
            onSelect={() => setPeriod(p.key)}
          />
        ))}
        <StatCard
          icon={Users}
          label="Total customers"
          value={summary?.totalCustomers ?? 0}
          change={`${summary?.newCustomersThisMonth ?? 0} new this month`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-surface-700">{current.chartTitle}</h3>
              {sales && (
                <p className="text-xs text-surface-400 mt-0.5">
                  {formatMoney(sales.totals.sales, currency)} · {sales.totals.bills} {sales.totals.bills === 1 ? 'bill' : 'bills'}
                  {sales.totals.bills ? ` · Avg ${formatMoney(sales.totals.avgBill, currency)}` : ''}
                </p>
              )}
            </div>
            <div className="inline-flex rounded-lg bg-surface-100 p-0.5" role="tablist">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  role="tab"
                  aria-selected={period === p.key}
                  onClick={() => setPeriod(p.key)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    period === p.key ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-500 hover:text-surface-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardBody className={`transition-opacity ${salesLoading ? 'opacity-50' : ''}`}>
            <div>
              {!sales && !salesLoading ? (
                <p className="text-sm text-surface-400 py-10 text-center">Couldn't load sales. Please refresh.</p>
              ) : !hasSales && !salesLoading ? (
                <p className="text-sm text-surface-400 py-10 text-center">No sales {current.key === '6m' ? 'in the last 6 months' : current.label.toLowerCase()} yet.</p>
              ) : (
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <BarChart data={chart} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false}
                        interval="preserveStartEnd" minTickGap={8} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={60}
                        tickFormatter={(v) => formatMoney(v, currency)} />
                      <Tooltip
                        cursor={{ fill: '#f1f5f9' }}
                        formatter={(v, _name, item) => [
                          `${formatMoney(v, currency)} (${item.payload.bills} ${item.payload.bills === 1 ? 'bill' : 'bills'})`,
                          'Sales',
                        ]}
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                      />
                      <Bar dataKey="sales" fill="#2570e9" radius={[6, 6, 0, 0]} maxBarSize={48} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Payment mode split */}
            {sales && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-surface-100">
                {modes.map((m) => {
                  const meta = MODE_META[m.mode] || { label: m.mode, icon: IndianRupee };
                  const ModeIcon = meta.icon;
                  const share = sales.totals.sales > 0 ? Math.round((m.amount / sales.totals.sales) * 100) : 0;
                  return (
                    <div key={m.mode} className="rounded-lg bg-surface-50 px-3 py-2">
                      <p className="text-xs text-surface-500 flex items-center gap-1">
                        <ModeIcon size={12} /> {meta.label}
                        {share > 0 && <span className="text-surface-400">· {share}%</span>}
                      </p>
                      <p className="text-sm font-semibold text-surface-800 mt-0.5">{formatMoney(m.amount, currency)}</p>
                      <p className="text-[11px] text-surface-400">{m.bills} {m.bills === 1 ? 'bill' : 'bills'}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Recent bills */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-surface-700">Recent bills</h3>
            <Link to="/bills" className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-0.5">
              View all <ArrowRight size={12} />
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            {recent.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center px-4">
                <FileText size={28} className="text-surface-300 mb-2" />
                <p className="text-sm text-surface-400">No bills yet.</p>
                <Link to="/bill" className="text-sm font-medium text-primary-600 mt-2">Create your first bill</Link>
              </div>
            ) : (
              <div className="divide-y divide-surface-100">
                {recent.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between px-5 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-surface-700 truncate">{inv.customer?.name || 'Walk-in'}</p>
                      <p className="text-xs text-surface-400">{formatDate(inv.createdAt)} · {inv.paymentMode}</p>
                    </div>
                    <span className="text-sm font-semibold text-surface-800">{formatMoney(inv.totalAmount, currency)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
