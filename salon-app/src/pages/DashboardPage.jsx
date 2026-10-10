import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee, TrendingUp, Users, UserPlus, Plus, FileText, ArrowRight,
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

export default function DashboardPage() {
  const salon = useSettings();
  const currency = salon.currency || 'INR';

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [chart, setChart] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([
      dashboardApi.summary().catch(() => null),
      dashboardApi.revenueChart(6).catch(() => ({ data: [] })),
      invoicesApi.list({ limit: 8 }).catch(() => ({ data: [] })),
    ]).then(([s, c, inv]) => {
      setSummary(s);
      setChart(c.data || []);
      setRecent(inv.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;

  const thisMonth = chart.length ? chart[chart.length - 1].revenue : 0;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your salon at a glance"
        actions={<Link to="/bill"><Button><Plus size={16} /> New Bill</Button></Link>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <StatCard icon={IndianRupee} label="Today's sales" value={formatMoney(summary?.todaysRevenue || 0, currency)} />
        <StatCard icon={TrendingUp} label="This month" value={formatMoney(thisMonth, currency)} />
        <StatCard icon={Users} label="Total customers" value={summary?.totalCustomers ?? 0} />
        <StatCard icon={UserPlus} label="New this month" value={summary?.newCustomersThisMonth ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <Card className="lg:col-span-2">
          <CardHeader><h3 className="text-sm font-semibold text-surface-700">Revenue (last 6 months)</h3></CardHeader>
          <CardBody>
            {chart.length === 0 ? (
              <p className="text-sm text-surface-400 py-10 text-center">No revenue data yet.</p>
            ) : (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={chart} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={60}
                      tickFormatter={(v) => formatMoney(v, currency)} />
                    <Tooltip
                      formatter={(v) => [formatMoney(v, currency), 'Revenue']}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                    />
                    <Bar dataKey="revenue" fill="#2570e9" radius={[6, 6, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
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
