import { useState, useEffect, useMemo, useCallback } from 'react';
import { Store, Palette, Lock, Loader2, Check, Upload, Trash2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../components/ui/Toast';
import { useSettings } from '../context/SettingsContext';
import { settings as settingsApi, auth as authApi } from '../services/api';
import { DEFAULT_INVOICE_TEMPLATE, normalizeTemplate } from '../lib/invoiceTemplate';
import { invoicePdfDataUri } from '../lib/invoicePdf';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
const field = 'w-full mt-1 text-sm border border-surface-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-200';

const SAMPLE_INVOICE = {
  invoiceNumber: 'INV-SAMPLE-0001',
  createdAt: new Date().toISOString(),
  customer: { name: 'Priya Sharma', phone: '+91 98765 43210' },
  items: [
    { service: { name: 'Haircut (Women)' }, price: 500, quantity: 1 },
    { service: { name: 'Hair Spa' }, price: 1500, quantity: 1 },
    { service: { name: 'Manicure' }, price: 400, quantity: 2 },
  ],
  subtotal: 2800,
  discountType: 'percentage', discountValue: 10,
  totalAmount: 2520,
  paymentMode: 'UPI', paymentStatus: 'PAID',
};

export default function SettingsPage() {
  const toast = useToast();
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('profile');

  const [profile, setProfile] = useState({
    salonName: '', tagline: '', phone: '', email: '', address: '', gstNumber: '', currency: 'INR', logo: null,
  });
  const [template, setTemplate] = useState(DEFAULT_INVOICE_TEMPLATE);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);

  useEffect(() => {
    settingsApi.get().then((data) => {
      setProfile({
        salonName: data.salonName || '', tagline: data.tagline || '', phone: data.phone || '',
        email: data.email || '', address: data.address || '', gstNumber: data.gstNumber || '',
        currency: data.currency || 'INR', logo: data.logo || null,
      });
      setTemplate(normalizeTemplate(data.invoiceTemplate));
    }).catch(() => toast.error('Could not load settings'))
      .finally(() => setLoading(false));
  }, [toast]);

  const setP = (k, v) => setProfile((p) => ({ ...p, [k]: v }));
  const setT = (k, v) => setTemplate((t) => ({ ...t, [k]: v }));

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) return toast.warning('Please use a logo under 500 KB');
    const reader = new FileReader();
    reader.onload = () => setP('logo', reader.result);
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    if (!profile.salonName.trim()) return toast.error('Salon name is required');
    setSavingProfile(true);
    try {
      await settingsApi.update({
        salonName: profile.salonName, tagline: profile.tagline, phone: profile.phone,
        email: profile.email, address: profile.address, gstNumber: profile.gstNumber,
        currency: profile.currency, logo: profile.logo,
      });
      await refreshSettings();
      toast.success('Salon profile saved');
    } catch (err) { toast.error(err.message || 'Could not save'); }
    finally { setSavingProfile(false); }
  };

  const saveTemplate = async () => {
    setSavingTemplate(true);
    try {
      await settingsApi.update({ invoiceTemplate: JSON.stringify(template) });
      await refreshSettings();
      toast.success('Invoice design saved');
    } catch (err) { toast.error(err.message || 'Could not save'); }
    finally { setSavingTemplate(false); }
  };

  // Live preview data URI (regenerated when template or profile changes)
  const previewUri = useMemo(() => {
    try {
      return invoicePdfDataUri(SAMPLE_INVOICE, profile, template);
    } catch { return null; }
  }, [template, profile]);

  if (loading) return <LoadingSpinner message="Loading settings..." />;

  return (
    <>
      <PageHeader title="Settings" description="Salon profile, invoice design, and account" />

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-surface-100 p-1 rounded-lg w-full sm:w-fit">
        {[
          { id: 'profile', label: 'Salon profile', icon: Store },
          { id: 'invoice', label: 'Invoice design', icon: Palette },
          { id: 'password', label: 'Password', icon: Lock },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === id ? 'bg-white text-primary-700 shadow-card' : 'text-surface-500 hover:text-surface-700'
            }`}>
            <Icon size={15} /> <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <Card className="max-w-2xl">
          <CardBody className="space-y-4">
            {/* Logo */}
            <div>
              <label className="text-xs font-medium text-surface-500">Logo</label>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-16 h-16 rounded-xl border border-surface-200 bg-surface-50 flex items-center justify-center overflow-hidden">
                  {profile.logo ? <img src={profile.logo} alt="logo" className="w-full h-full object-cover" /> : <Store size={22} className="text-surface-300" />}
                </div>
                <div className="flex gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 text-sm px-3 py-2 border border-surface-200 rounded-lg hover:bg-surface-50">
                    <Upload size={14} /> Upload
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLogo} className="hidden" />
                  </label>
                  {profile.logo && (
                    <button onClick={() => setP('logo', null)} className="inline-flex items-center gap-1.5 text-sm px-3 py-2 border border-surface-200 rounded-lg text-danger-600 hover:bg-danger-50">
                      <Trash2 size={14} /> Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-surface-500">Salon name *</label>
                <input value={profile.salonName} onChange={(e) => setP('salonName', e.target.value)} className={field} />
              </div>
              <div>
                <label className="text-xs font-medium text-surface-500">Tagline</label>
                <input value={profile.tagline} onChange={(e) => setP('tagline', e.target.value)} className={field} />
              </div>
              <div>
                <label className="text-xs font-medium text-surface-500">Phone</label>
                <input value={profile.phone} onChange={(e) => setP('phone', e.target.value)} className={field} />
              </div>
              <div>
                <label className="text-xs font-medium text-surface-500">Email</label>
                <input value={profile.email} onChange={(e) => setP('email', e.target.value)} className={field} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-surface-500">Address</label>
                <input value={profile.address} onChange={(e) => setP('address', e.target.value)} className={field} />
              </div>
              <div>
                <label className="text-xs font-medium text-surface-500">GST number</label>
                <input value={profile.gstNumber} onChange={(e) => setP('gstNumber', e.target.value)} className={field} />
              </div>
              <div>
                <label className="text-xs font-medium text-surface-500">Currency</label>
                <select value={profile.currency} onChange={(e) => setP('currency', e.target.value)} className={`${field} bg-white`}>
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={saveProfile} disabled={savingProfile}>
                {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save profile
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {tab === 'invoice' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Designer controls */}
          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-surface-700">Design your bill</h3></CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-surface-500">Accent color</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="color" value={template.accentColor} onChange={(e) => setT('accentColor', e.target.value)}
                      className="w-10 h-9 border border-surface-200 rounded cursor-pointer p-0.5" />
                    <input value={template.accentColor} onChange={(e) => setT('accentColor', e.target.value)}
                      className="flex-1 text-sm border border-surface-200 py-2 px-2 font-mono" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-surface-500">Paper size</label>
                  <select value={template.paperSize} onChange={(e) => setT('paperSize', e.target.value)} className={`${field} bg-white`}>
                    <option value="a4">A4</option>
                    <option value="a5">A5 (compact)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-surface-500">Header title</label>
                <input value={template.headerText} onChange={(e) => setT('headerText', e.target.value)}
                  placeholder="Leave blank to use salon name" className={field} />
              </div>

              <div>
                <label className="text-xs font-medium text-surface-500 block mb-1.5">Show on bill</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['showLogo', 'Logo'], ['showAddress', 'Address'], ['showPhone', 'Phone'],
                    ['showEmail', 'Email'], ['showGst', 'GST number'], ['showItemDiscount', 'Discount line'],
                  ].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-surface-600 cursor-pointer">
                      <input type="checkbox" checked={!!template[key]} onChange={(e) => setT(key, e.target.checked)}
                        className="w-4 h-4 accent-primary-600" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-surface-500">Thank-you note</label>
                <textarea value={template.thankYouNote} onChange={(e) => setT('thankYouNote', e.target.value)}
                  rows={2} className={field} />
              </div>
              <div>
                <label className="text-xs font-medium text-surface-500">Terms / notes (small print)</label>
                <textarea value={template.terms} onChange={(e) => setT('terms', e.target.value)}
                  rows={2} className={field} />
              </div>
              <div>
                <label className="text-xs font-medium text-surface-500">Footer text</label>
                <input value={template.footerText} onChange={(e) => setT('footerText', e.target.value)}
                  placeholder="Leave blank to use salon name" className={field} />
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setTemplate(DEFAULT_INVOICE_TEMPLATE)}>Reset</Button>
                <Button onClick={saveTemplate} disabled={savingTemplate}>
                  {savingTemplate ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save design
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Live preview */}
          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-surface-700">Live preview</h3></CardHeader>
            <CardBody className="p-0">
              {previewUri ? (
                <iframe title="Bill preview" src={previewUri} className="w-full rounded-b-xl" style={{ height: 560, border: 'none' }} />
              ) : (
                <p className="text-sm text-surface-400 p-6 text-center">Preview unavailable.</p>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {tab === 'password' && <PasswordCard />}
    </>
  );
}

function PasswordCard() {
  const toast = useToast();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (next.length < 6) return toast.error('New password must be at least 6 characters');
    if (next !== confirm) return toast.error('Passwords do not match');
    setSaving(true);
    try {
      await authApi.changePassword({ currentPassword: current, newPassword: next });
      toast.success('Password updated');
      setCurrent(''); setNext(''); setConfirm('');
    } catch (err) { toast.error(err.message || 'Could not update password'); }
    finally { setSaving(false); }
  };

  return (
    <Card className="max-w-md">
      <CardBody className="space-y-3">
        <div>
          <label className="text-xs font-medium text-surface-500">Current password</label>
          <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} className={field} />
        </div>
        <div>
          <label className="text-xs font-medium text-surface-500">New password</label>
          <input type="password" value={next} onChange={(e) => setNext(e.target.value)} className={field} />
        </div>
        <div>
          <label className="text-xs font-medium text-surface-500">Confirm new password</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field} />
        </div>
        <div className="flex justify-end pt-1">
          <Button onClick={submit} disabled={saving}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />} Update password
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
