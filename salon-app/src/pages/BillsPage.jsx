import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Send, Download, Eye, Plus, Loader2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../components/ui/Toast';
import { useSettings } from '../context/SettingsContext';
import { invoices as invoicesApi } from '../services/api';
import { formatMoney, formatDate } from '../lib/format';
import { sendBillToCustomer, downloadBill, previewBill } from '../lib/shareBill';

const STATUS_STYLES = {
  PAID: 'bg-success-50 text-success-700',
  PARTIAL: 'bg-warning-50 text-warning-600',
  DUE: 'bg-danger-50 text-danger-600',
};

export default function BillsPage() {
  const toast = useToast();
  const salon = useSettings();
  const currency = salon.currency || 'INR';

  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (from) params.from = from;
      if (to) params.to = to;
      const res = await invoicesApi.list(params);
      setBills(res.data || []);
    } catch {
      toast.error('Could not load bills');
    } finally { setLoading(false); }
  }, [from, to, toast]);

  useEffect(() => { load(); }, [load]);

  const totalShown = bills.reduce((s, b) => s + (b.totalAmount || 0), 0);

  const handleSend = async (inv) => {
    setBusyId(inv.id);
    try {
      const result = await sendBillToCustomer(inv, salon, salon.invoiceTemplate);
      if (result === 'shared') toast.success('Shared with customer');
      else if (result === 'downloaded+whatsapp') toast.info('PDF downloaded — attach it in the WhatsApp chat');
      else if (result === 'downloaded') toast.info('PDF downloaded');
    } catch {
      toast.error('Could not share the bill');
    } finally { setBusyId(null); }
  };

  return (
    <>
      <PageHeader
        title="Bills"
        description="All invoices and sales history"
        actions={<Link to="/bill"><Button><Plus size={16} /> New Bill</Button></Link>}
      />

      {/* Filters */}
      <Card className="mb-4">
        <CardBody className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs font-medium text-surface-500">From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              className="block mt-1 text-sm border border-surface-200 py-2 px-3" />
          </div>
          <div>
            <label className="text-xs font-medium text-surface-500">To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              className="block mt-1 text-sm border border-surface-200 py-2 px-3" />
          </div>
          {(from || to) && (
            <Button variant="ghost" onClick={() => { setFrom(''); setTo(''); }}>Clear</Button>
          )}
          <div className="ml-auto text-right">
            <p className="text-xs text-surface-400">{bills.length} bills</p>
            <p className="text-base font-bold text-surface-800">{formatMoney(totalShown, currency)}</p>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <LoadingSpinner message="Loading bills..." />
      ) : bills.length === 0 ? (
        <Card><CardBody>
          <EmptyState
            icon={FileText}
            title="No bills found"
            description="Create a bill to start tracking your sales."
            action={<Link to="/bill"><Button><Plus size={16} /> New Bill</Button></Link>}
          />
        </CardBody></Card>
      ) : (
        <Card>
          <CardBody className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-surface-400 border-b border-surface-100">
                  <th className="px-4 py-3 font-medium">Bill</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Payment</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {bills.map((inv) => (
                  <tr key={inv.id} className="hover:bg-surface-50">
                    <td className="px-4 py-3 font-mono text-xs text-surface-500">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-surface-700">{inv.customer?.name || 'Walk-in'}</p>
                      <p className="text-xs text-surface-400 sm:hidden">{formatDate(inv.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3 text-surface-500 hidden sm:table-cell">{formatDate(inv.createdAt)}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-surface-600">{inv.paymentMode}</span>
                      <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${STATUS_STYLES[inv.paymentStatus] || ''}`}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-surface-800">{formatMoney(inv.totalAmount, currency)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => previewBill(inv, salon, salon.invoiceTemplate)}
                          className="p-1.5 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg" title="Preview">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => downloadBill(inv, salon, salon.invoiceTemplate)}
                          className="p-1.5 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg" title="Download">
                          <Download size={16} />
                        </button>
                        <button onClick={() => handleSend(inv)} disabled={busyId === inv.id}
                          className="p-1.5 text-surface-400 hover:text-success-600 hover:bg-success-50 rounded-lg" title="Send to customer">
                          {busyId === inv.id ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}
    </>
  );
}
