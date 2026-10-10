import { useState, useEffect, useMemo, useCallback } from 'react';
import { Scissors, Plus, Pencil, Loader2, Check, Search } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../components/ui/Toast';
import { useSettings } from '../context/SettingsContext';
import { services as servicesApi } from '../services/api';
import { formatMoney } from '../lib/format';

export default function ServicesPage() {
  const toast = useToast();
  const salon = useSettings();
  const currency = salon.currency || 'INR';

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [svc, cat] = await Promise.all([
        servicesApi.list(),
        servicesApi.categories().catch(() => ({ data: [] })),
      ]);
      setList(svc.data || []);
      setCategories(cat.data || []);
    } catch { toast.error('Could not load services'); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((s) => s.name.toLowerCase().includes(q));
  }, [list, query]);

  const openNew = () => { setEditing({}); setModalOpen(true); };
  const openEdit = (s) => { setEditing(s); setModalOpen(true); };

  const toggleActive = async (s) => {
    try {
      await servicesApi.update(s.id, { isActive: !s.isActive });
      load();
    } catch { toast.error('Could not update service'); }
  };

  return (
    <>
      <PageHeader
        title="Services"
        description="Items you can add to a bill"
        actions={<Button onClick={openNew}><Plus size={16} /> Add service</Button>}
      />

      <Card className="mb-4">
        <CardBody>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <LoadingSpinner message="Loading services..." />
      ) : filtered.length === 0 ? (
        <Card><CardBody>
          <EmptyState icon={Scissors} title="No services"
            description="Add the services your salon offers so you can bill for them."
            action={<Button onClick={openNew}><Plus size={16} /> Add service</Button>} />
        </CardBody></Card>
      ) : (
        <Card>
          <CardBody className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-surface-400 border-b border-surface-100">
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 font-medium text-right">Price</th>
                  <th className="px-4 py-3 font-medium text-center">Active</th>
                  <th className="px-4 py-3 font-medium text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {filtered.map((s) => (
                  <tr key={s.id} className={`hover:bg-surface-50 ${!s.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3 font-medium text-surface-700">{s.name}</td>
                    <td className="px-4 py-3 text-surface-500 hidden sm:table-cell">{s.category?.name || '—'}</td>
                    <td className="px-4 py-3 text-right font-medium text-surface-700">{formatMoney(s.price, currency)}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleActive(s)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${s.isActive ? 'bg-primary-500' : 'bg-surface-300'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${s.isActive ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(s)} className="p-1.5 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
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

      <ServiceModal
        isOpen={modalOpen}
        service={editing}
        categories={categories}
        currency={currency}
        onClose={() => setModalOpen(false)}
        onSaved={() => { setModalOpen(false); load(); }}
      />
    </>
  );
}

function ServiceModal({ isOpen, service, categories, currency, onClose, onSaved }) {
  const toast = useToast();
  const isEdit = service && service.id;
  const [form, setForm] = useState({ name: '', price: '', duration: 30, categoryId: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: service?.name || '', price: service?.price ?? '',
        duration: service?.duration ?? 30,
        categoryId: service?.categoryId || categories[0]?.id || '',
      });
    }
  }, [isOpen, service, categories]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const ensureCategoryId = async () => {
    if (form.categoryId) return form.categoryId;
    if (categories.length) return categories[0].id;
    const created = await servicesApi.createCategory({ name: 'General' });
    return created.id;
  };

  const submit = async () => {
    if (!form.name.trim() || form.price === '') return toast.error('Name and price are required');
    setSaving(true);
    try {
      const categoryId = await ensureCategoryId();
      const payload = {
        name: form.name.trim(),
        price: Number(form.price) || 0,
        duration: Number(form.duration) || 30,
        categoryId,
      };
      if (isEdit) await servicesApi.update(service.id, payload);
      else await servicesApi.create(payload);
      toast.success(isEdit ? 'Service updated' : 'Service added');
      onSaved();
    } catch (err) {
      toast.error(err.message || 'Could not save service');
    } finally { setSaving(false); }
  };

  const field = 'w-full mt-1 text-sm border border-surface-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-200';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit service' : 'Add service'} size="sm">
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-surface-500">Service name *</label>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} className={field} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-surface-500">Price ({currency}) *</label>
            <input type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} className={field} />
          </div>
          <div>
            <label className="text-xs font-medium text-surface-500">Duration (min)</label>
            <input type="number" min="1" value={form.duration} onChange={(e) => set('duration', e.target.value)} className={field} />
          </div>
        </div>
        {categories.length > 0 && (
          <div>
            <label className="text-xs font-medium text-surface-500">Category</label>
            <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className={`${field} bg-white`}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
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
