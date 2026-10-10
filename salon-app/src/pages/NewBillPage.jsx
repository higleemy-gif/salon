import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Search, UserPlus, Plus, Trash2, X, Check, Send, Download, Eye,
  ReceiptText, Loader2, User,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { useSettings } from '../context/SettingsContext';
import { customers as customersApi, services as servicesApi, invoices as invoicesApi } from '../services/api';
import { formatMoney } from '../lib/format';
import { sendBillToCustomer, downloadBill, previewBill } from '../lib/shareBill';

const PAYMENT_MODES = ['CASH', 'UPI', 'CARD', 'PENDING'];

export default function NewBillPage() {
  const toast = useToast();
  const salon = useSettings();
  const currency = salon.currency || 'INR';

  const [catalog, setCatalog] = useState([]);
  const [serviceQuery, setServiceQuery] = useState('');

  const [customer, setCustomer] = useState(null);
  const [custQuery, setCustQuery] = useState('');
  const [custResults, setCustResults] = useState([]);
  const [custSearching, setCustSearching] = useState(false);
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [showQuickService, setShowQuickService] = useState(false);

  const [lines, setLines] = useState([]);
  const [discountType, setDiscountType] = useState('none');
  const [discountValue, setDiscountValue] = useState('');
  const [paymentMode, setPaymentMode] = useState('CASH');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(null);
  const [sending, setSending] = useState(false);

  // ── Load service catalog ──
  useEffect(() => {
    servicesApi.list({ active: true })
      .then((res) => setCatalog(res.data || []))
      .catch(() => toast.error('Could not load services'));
  }, [toast]);

  // ── Debounced customer search ──
  const searchTimer = useRef();
  useEffect(() => {
    if (!custQuery.trim()) { setCustResults([]); return; }
    setCustSearching(true);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await customersApi.search(custQuery.trim());
        setCustResults(res.data || []);
      } catch { /* ignore */ } finally { setCustSearching(false); }
    }, 300);
    return () => clearTimeout(searchTimer.current);
  }, [custQuery]);

  const filteredCatalog = useMemo(() => {
    const q = serviceQuery.trim().toLowerCase();
    const list = q ? catalog.filter((s) => s.name.toLowerCase().includes(q)) : catalog;
    return list.slice(0, 40);
  }, [catalog, serviceQuery]);

  // ── Totals ──
  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + (Number(l.price) || 0) * (Number(l.qty) || 1), 0),
    [lines]
  );
  const discountAmount = useMemo(() => {
    const v = Number(discountValue) || 0;
    if (discountType === 'flat') return Math.min(v, subtotal);
    if (discountType === 'percentage') return (subtotal * Math.min(v, 100)) / 100;
    return 0;
  }, [discountType, discountValue, subtotal]);
  const total = Math.max(0, subtotal - discountAmount);

  // ── Line management ──
  const addService = (svc) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.serviceId === svc.id);
      if (existing) {
        return prev.map((l) => (l.serviceId === svc.id ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, { serviceId: svc.id, name: svc.name, price: svc.price, qty: 1 }];
    });
  };
  const updateLine = (serviceId, patch) =>
    setLines((prev) => prev.map((l) => (l.serviceId === serviceId ? { ...l, ...patch } : l)));
  const removeLine = (serviceId) =>
    setLines((prev) => prev.filter((l) => l.serviceId !== serviceId));

  // ── Save ──
  const canSave = customer && lines.length > 0 && !saving;

  const handleSave = async () => {
    if (!customer) return toast.error('Select a customer first');
    if (lines.length === 0) return toast.error('Add at least one item');
    setSaving(true);
    try {
      const payload = {
        customerId: customer.id,
        items: lines.map((l) => ({ serviceId: l.serviceId, price: Number(l.price) || 0, quantity: Number(l.qty) || 1 })),
        discountType: discountType === 'none' ? null : discountType,
        discountValue: discountType === 'none' ? null : Number(discountValue) || 0,
        paymentMode,
      };
      const inv = await invoicesApi.create(payload);
      // Ensure customer info present for the PDF/share step
      if (!inv.customer) inv.customer = { name: customer.name, phone: customer.phone };
      setSaved(inv);
      toast.success('Bill saved');
    } catch (err) {
      toast.error(err.message || 'Failed to save bill');
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    try {
      const result = await sendBillToCustomer(saved, salon, salon.invoiceTemplate);
      if (result === 'shared') toast.success('Shared with customer');
      else if (result === 'downloaded+whatsapp') toast.info('PDF downloaded — attach it in the WhatsApp chat that opened');
      else if (result === 'downloaded') toast.info('PDF downloaded');
      else if (result === 'cancelled') { /* user cancelled share */ }
    } catch {
      toast.error('Could not share the bill');
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setCustomer(null); setCustQuery(''); setCustResults([]);
    setLines([]); setDiscountType('none'); setDiscountValue('');
    setPaymentMode('CASH'); setSaved(null); setServiceQuery('');
  };

  // ── Success screen ──
  if (saved) {
    return (
      <div className="max-w-xl mx-auto">
        <Card>
          <CardBody className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-success-600" />
            </div>
            <h2 className="text-lg font-bold text-surface-800">Bill {saved.invoiceNumber} created</h2>
            <p className="text-sm text-surface-500 mt-1">
              {saved.customer?.name} · {formatMoney(saved.totalAmount, currency)} · {saved.paymentMode}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={handleSend} disabled={sending} size="lg">
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Send to customer
              </Button>
              <Button variant="outline" size="lg" onClick={() => previewBill(saved, salon, salon.invoiceTemplate)}>
                <Eye size={16} /> Preview
              </Button>
              <Button variant="outline" size="lg" onClick={() => downloadBill(saved, salon, salon.invoiceTemplate)}>
                <Download size={16} /> Download
              </Button>
            </div>

            <p className="text-xs text-surface-400 mt-4 max-w-sm mx-auto">
              On a phone or tablet, "Send to customer" opens WhatsApp with the PDF attached.
              On desktop it downloads the PDF and opens the chat so you can attach it.
            </p>

            <button onClick={resetForm} className="mt-6 text-sm font-medium text-primary-600 hover:text-primary-700">
              + Create another bill
            </button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="New Bill" description="Create a bill and send it to your customer" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── Left: customer + items ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer */}
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-surface-700">Customer</h3>
                <Button variant="outline" size="sm" onClick={() => setShowNewCustomer(true)}>
                  <UserPlus size={14} /> New
                </Button>
              </div>

              {customer ? (
                <div className="flex items-center justify-between bg-primary-50 border border-primary-100 rounded-lg px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                      <User size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-surface-800">{customer.name}</p>
                      <p className="text-xs text-surface-500">{customer.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => setCustomer(null)} className="p-1.5 text-surface-400 hover:text-danger-600 rounded-lg">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input
                    value={custQuery}
                    onChange={(e) => setCustQuery(e.target.value)}
                    placeholder="Search by name or phone..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                  />
                  {(custResults.length > 0 || custSearching) && custQuery.trim() && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-surface-200 rounded-lg shadow-card-hover max-h-56 overflow-y-auto">
                      {custSearching && <div className="px-3 py-2 text-xs text-surface-400">Searching...</div>}
                      {custResults.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => { setCustomer(c); setCustQuery(''); setCustResults([]); }}
                          className="w-full text-left px-3 py-2 hover:bg-surface-50 flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-surface-700">{c.name}</span>
                          <span className="text-xs text-surface-400">{c.phone}</span>
                        </button>
                      ))}
                      {!custSearching && custResults.length === 0 && (
                        <div className="px-3 py-2 text-xs text-surface-400">
                          No match. <button onClick={() => setShowNewCustomer(true)} className="text-primary-600 font-medium">Add new</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Items */}
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-surface-700">Items</h3>
                <Button variant="outline" size="sm" onClick={() => setShowQuickService(true)}>
                  <Plus size={14} /> Quick item
                </Button>
              </div>

              {/* Service search / picker */}
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  value={serviceQuery}
                  onChange={(e) => setServiceQuery(e.target.value)}
                  placeholder="Search services to add..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                />
              </div>
              <div className="flex flex-wrap gap-2 mb-4 max-h-28 overflow-y-auto">
                {filteredCatalog.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => addService(s)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-surface-200 text-surface-600 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    {s.name} · {formatMoney(s.price, currency)}
                  </button>
                ))}
                {filteredCatalog.length === 0 && (
                  <p className="text-xs text-surface-400">No services found. Use "Quick item" to add one.</p>
                )}
              </div>

              {/* Line items */}
              {lines.length === 0 ? (
                <div className="text-center py-6 text-sm text-surface-400 border border-dashed border-surface-200 rounded-lg">
                  No items yet. Tap a service above to add it.
                </div>
              ) : (
                <div className="space-y-2">
                  {lines.map((l) => (
                    <div key={l.serviceId} className="flex items-center gap-2 bg-surface-50 rounded-lg px-2 py-2">
                      <span className="flex-1 text-sm text-surface-700 truncate">{l.name}</span>
                      <input
                        type="number" min="1" value={l.qty}
                        onChange={(e) => updateLine(l.serviceId, { qty: Math.max(1, parseInt(e.target.value) || 1) })}
                        className="w-14 text-center text-sm border border-surface-200 py-1"
                        title="Quantity"
                      />
                      <input
                        type="number" min="0" value={l.price}
                        onChange={(e) => updateLine(l.serviceId, { price: e.target.value })}
                        className="w-24 text-right text-sm border border-surface-200 py-1 px-2"
                        title="Price"
                      />
                      <span className="w-24 text-right text-sm font-medium text-surface-700">
                        {formatMoney((Number(l.price) || 0) * (Number(l.qty) || 1), currency)}
                      </span>
                      <button onClick={() => removeLine(l.serviceId)} className="p-1 text-surface-400 hover:text-danger-600">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* ── Right: summary ── */}
        <div className="space-y-4">
          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold text-surface-700 mb-3">Summary</h3>

              {/* Discount */}
              <label className="text-xs font-medium text-surface-500">Discount</label>
              <div className="flex gap-2 mt-1 mb-3">
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="text-sm border border-surface-200 py-2 px-2 bg-white"
                >
                  <option value="none">None</option>
                  <option value="flat">Flat</option>
                  <option value="percentage">%</option>
                </select>
                <input
                  type="number" min="0" disabled={discountType === 'none'}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="0"
                  className="flex-1 text-sm border border-surface-200 py-2 px-2 disabled:bg-surface-50"
                />
              </div>

              {/* Payment mode */}
              <label className="text-xs font-medium text-surface-500">Payment mode</label>
              <div className="grid grid-cols-2 gap-2 mt-1 mb-4">
                {PAYMENT_MODES.map((m) => (
                  <button
                    key={m}
                    onClick={() => setPaymentMode(m)}
                    className={`text-sm py-2 rounded-lg border transition-colors ${
                      paymentMode === m
                        ? 'bg-primary-50 border-primary-300 text-primary-700 font-medium'
                        : 'border-surface-200 text-surface-600 hover:bg-surface-50'
                    }`}
                  >
                    {m === 'PENDING' ? 'Pay later' : m}
                  </button>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1.5 border-t border-surface-100 pt-3 text-sm">
                <div className="flex justify-between text-surface-500">
                  <span>Subtotal</span><span>{formatMoney(subtotal, currency)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-surface-500">
                    <span>Discount</span><span>- {formatMoney(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-surface-800 pt-1">
                  <span>Total</span><span>{formatMoney(total, currency)}</span>
                </div>
              </div>

              <Button onClick={handleSave} disabled={!canSave} size="lg" className="w-full mt-4">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <ReceiptText size={16} />}
                Save bill
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* New customer modal */}
      <NewCustomerModal
        isOpen={showNewCustomer}
        onClose={() => setShowNewCustomer(false)}
        onCreated={(c) => { setCustomer(c); setShowNewCustomer(false); setCustQuery(''); setCustResults([]); }}
      />

      {/* Quick service modal */}
      <QuickServiceModal
        isOpen={showQuickService}
        onClose={() => setShowQuickService(false)}
        currency={currency}
        onCreated={(svc) => { setCatalog((p) => [svc, ...p]); addService(svc); setShowQuickService(false); }}
      />
    </>
  );
}

// ── New customer modal ──
function NewCustomerModal({ isOpen, onClose, onCreated }) {
  const toast = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (isOpen) { setName(''); setPhone(''); } }, [isOpen]);

  const submit = async () => {
    if (!name.trim() || !phone.trim()) return toast.error('Name and phone are required');
    setSaving(true);
    try {
      const c = await customersApi.create({ name: name.trim(), phone: phone.trim(), tag: 'NEW' });
      toast.success('Customer added');
      onCreated(c);
    } catch (err) {
      toast.error(err.message || 'Could not add customer');
    } finally { setSaving(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New customer" size="sm">
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-surface-500">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 text-sm border border-surface-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-200" />
        </div>
        <div>
          <label className="text-xs font-medium text-surface-500">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full mt-1 text-sm border border-surface-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-200" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Add
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ── Quick service modal (creates a real service so it can be billed) ──
function QuickServiceModal({ isOpen, onClose, onCreated, currency }) {
  const toast = useToast();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (isOpen) { setName(''); setPrice(''); } }, [isOpen]);

  const ensureCategoryId = useCallback(async () => {
    const res = await servicesApi.categories();
    const cats = res.data || [];
    const general = cats.find((c) => c.name.toLowerCase() === 'general');
    if (general) return general.id;
    if (cats.length) return cats[0].id;
    const created = await servicesApi.createCategory({ name: 'General' });
    return created.id;
  }, []);

  const submit = async () => {
    if (!name.trim() || price === '') return toast.error('Name and price are required');
    setSaving(true);
    try {
      const categoryId = await ensureCategoryId();
      const svc = await servicesApi.create({
        name: name.trim(), categoryId, duration: 30, price: Number(price) || 0,
      });
      toast.success('Item added to catalog');
      onCreated(svc);
    } catch (err) {
      toast.error(err.message || 'Could not create item');
    } finally { setSaving(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick item" size="sm">
      <div className="space-y-3">
        <p className="text-xs text-surface-400">
          This adds a billable item to your services catalog so you can reuse it later.
        </p>
        <div>
          <label className="text-xs font-medium text-surface-500">Item name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 text-sm border border-surface-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-200" />
        </div>
        <div>
          <label className="text-xs font-medium text-surface-500">Price ({currency})</label>
          <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)}
            className="w-full mt-1 text-sm border border-surface-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-200" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Add
          </Button>
        </div>
      </div>
    </Modal>
  );
}
