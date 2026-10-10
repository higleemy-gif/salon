import { useState, useEffect, useMemo, useCallback } from 'react';
import { Users, Search, UserPlus, Pencil, Loader2, Check } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../components/ui/Toast';
import { useSettings } from '../context/SettingsContext';
import { customers as customersApi } from '../services/api';
import { formatMoney, formatDate } from '../lib/format';

const TAG_STYLES = {
  NEW: 'bg-info-50 text-info-600',
  REGULAR: 'bg-primary-50 text-primary-700',
  VIP: 'bg-warning-50 text-warning-600',
  INACTIVE: 'bg-surface-100 text-surface-500',
};

export default function CustomersPage() {
  const toast = useToast();
  const salon = useSettings();
  const currency = salon.currency || 'INR';

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null); // customer object or {} for new
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await customersApi.list({ limit: 200, sortBy: 'name', order: 'asc' });
      setList(res.data || []);
    } catch { toast.error('Could not load customers'); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => c.name.toLowerCase().includes(q) || (c.phone || '').includes(q));
  }, [list, query]);

  const openNew = () => { setEditing({}); setModalOpen(true); };
  const openEdit = (c) => { setEditing(c); setModalOpen(true); };

  return (
    <>
      <PageHeader
        title="Customers"
        description="Your customer directory"
        actions={<Button onClick={openNew}><UserPlus size={16} /> Add customer</Button>}
      />

      <Card className="mb-4">
        <CardBody>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or phone..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <LoadingSpinner message="Loading customers..." />
      ) : filtered.length === 0 ? (
        <Card><CardBody>
          <EmptyState icon={Users} title="No customers"
            description={query ? 'No customers match your search.' : 'Add your first customer to get started.'}
            action={!query && <Button onClick={openNew}><UserPlus size={16} /> Add customer</Button>} />
        </CardBody></Card>
      ) : (
        <Card>
          <CardBody className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-surface-400 border-b border-surface-100">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Phone</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Visits</th>
                  <th className="px-4 py-3 font-medium text-right">Spent</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Last visit</th>
                  <th className="px-4 py-3 font-medium text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-surface-700">{c.name}</span>
                        {c.tag && <span className={`text-[10px] px-1.5 py-0.5 rounded ${TAG_STYLES[c.tag] || ''}`}>{c.tag}</span>}
                      </div>
                      <p className="text-xs text-surface-400 sm:hidden">{c.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-surface-500 hidden sm:table-cell">{c.phone}</td>
                    <td className="px-4 py-3 text-surface-500 hidden md:table-cell">{c.totalVisits || 0}</td>
                    <td className="px-4 py-3 text-right font-medium text-surface-700">{formatMoney(c.totalSpent || 0, currency)}</td>
                    <td className="px-4 py-3 text-surface-500 hidden lg:table-cell">{c.lastVisitAt ? formatDate(c.lastVisitAt) : '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(c)} className="p-1.5 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                        <Pencil size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}

      <CustomerModal
        isOpen={modalOpen}
        customer={editing}
        onClose={() => setModalOpen(false)}
        onSaved={() => { setModalOpen(false); load(); }}
      />
    </>
  );
}

function CustomerModal({ isOpen, customer, onClose, onSaved }) {
  const toast = useToast();
  const isEdit = customer && customer.id;
  const [form, setForm] = useState({ name: '', phone: '', email: '', gender: '', tag: 'NEW', dob: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: customer?.name || '', phone: customer?.phone || '', email: customer?.email || '',
        gender: customer?.gender || '', tag: customer?.tag || 'NEW',
        dob: customer?.dob ? String(customer.dob).slice(0, 10) : '',
      });
    }
  }, [isOpen, customer]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim() || !form.phone.trim()) return toast.error('Name and phone are required');
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(), phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        gender: form.gender || undefined, tag: form.tag,
        dob: form.dob || undefined,
      };
      if (isEdit) await customersApi.update(customer.id, payload);
      else await customersApi.create(payload);
      toast.success(isEdit ? 'Customer updated' : 'Customer added');
      onSaved();
    } catch (err) {
      toast.error(err.message || 'Could not save customer');
    } finally { setSaving(false); }
  };

  const field = 'w-full mt-1 text-sm border border-surface-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-200';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit customer' : 'Add customer'} size="sm">
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-surface-500">Name *</label>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} className={field} />
        </div>
        <div>
          <label className="text-xs font-medium text-surface-500">Phone *</label>
          <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={field} />
        </div>
        <div>
          <label className="text-xs font-medium text-surface-500">Email</label>
          <input value={form.email} onChange={(e) => set('email', e.target.value)} className={field} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-surface-500">Gender</label>
            <select value={form.gender} onChange={(e) => set('gender', e.target.value)} className={`${field} bg-white`}>
              <option value="">—</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-surface-500">Tag</label>
            <select value={form.tag} onChange={(e) => set('tag', e.target.value)} className={`${field} bg-white`}>
              <option value="NEW">New</option>
              <option value="REGULAR">Regular</option>
              <option value="VIP">VIP</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-surface-500">Date of birth</label>
          <input type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} className={field} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
