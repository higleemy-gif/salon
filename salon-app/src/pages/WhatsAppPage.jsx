import { useState, useEffect, useCallback } from 'react';
import {
  MessageCircle, ExternalLink, CheckCircle2, AlertTriangle, Loader2, Send, Inbox,
  Workflow, Megaphone, GitBranch, RefreshCw,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';
import { whatsappCrm, settings as settingsApi } from '../services/api';

const field = 'w-full mt-1 text-sm border border-surface-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-200';

const CRM_SECTIONS = [
  { path: '/inbox', label: 'Inbox', desc: 'Chat with customers', icon: Inbox },
  { path: '/automations', label: 'Automations', desc: 'Auto replies & follow-ups', icon: Workflow },
  { path: '/broadcasts', label: 'Broadcasts', desc: 'Offers to many customers', icon: Megaphone },
  { path: '/flows', label: 'Chatbot flows', desc: 'Menus and booking bots', icon: GitBranch },
];

export default function WhatsAppPage() {
  const toast = useToast();
  const { user } = useAuth();
  const isAdmin = ['ADMIN', 'OWNER'].includes(user?.role);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({ waCrmAutoSendBill: false, waCrmBillTemplate: '', waCrmTemplateLanguage: 'en' });
  const [saving, setSaving] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [testing, setTesting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const s = await whatsappCrm.status();
      setStatus(s);
      setForm(s.settings);
    } catch {
      toast.error('Could not load WhatsApp status');
    } finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (form.waCrmAutoSendBill && !form.waCrmBillTemplate.trim()) {
      return toast.warning('Enter the template name before turning on auto-send');
    }
    setSaving(true);
    try {
      await settingsApi.update({
        waCrmAutoSendBill: form.waCrmAutoSendBill,
        waCrmBillTemplate: form.waCrmBillTemplate.trim() || null,
        waCrmTemplateLanguage: form.waCrmTemplateLanguage.trim() || 'en',
      });
      toast.success('WhatsApp automation saved');
    } catch (e) {
      toast.error(e.message || 'Could not save');
    } finally { setSaving(false); }
  };

  const sendTest = async () => {
    setTesting(true);
    try {
      await whatsappCrm.test(testPhone);
      toast.success('Test message sent');
    } catch (e) {
      toast.error(e.message || 'Test failed');
    } finally { setTesting(false); }
  };

  if (loading) return <LoadingSpinner message="Checking WhatsApp CRM..." />;

  const crmUrl = status?.url;

  return (
    <>
      <PageHeader
        title="WhatsApp"
        description="WhatsApp automation for bills, offers and customer chats"
        actions={crmUrl && (
          <a href={crmUrl} target="_blank" rel="noopener noreferrer">
            <Button><ExternalLink size={16} /> Open WhatsApp CRM</Button>
          </a>
        )}
      />

      {/* Connection */}
      <Card className="mb-4 max-w-3xl">
        <CardBody className="flex items-start gap-3">
          {status?.connected ? (
            <CheckCircle2 size={22} className="text-success-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle size={22} className="text-warning-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            {status?.connected ? (
              <>
                <p className="font-semibold text-surface-800">Connected to WhatsApp CRM</p>
                <p className="text-sm text-surface-500">
                  Account: {status.account || '—'}{status.scopes?.length ? ` · Permissions: ${status.scopes.join(', ')}` : ''}
                </p>
              </>
            ) : status?.configured ? (
              <>
                <p className="font-semibold text-surface-800">WhatsApp CRM is not reachable</p>
                <p className="text-sm text-surface-500 break-words">{status.error}</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-surface-800">WhatsApp CRM is not set up yet</p>
                <p className="text-sm text-surface-500">
                  Ask your administrator to deploy the WhatsApp CRM and set <code>WACRM_URL</code> and{' '}
                  <code>WACRM_API_KEY</code> on the backend. See DEPLOYMENT.md.
                </p>
              </>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={load} title="Refresh"><RefreshCw size={14} /></Button>
        </CardBody>
      </Card>

      {/* CRM shortcuts */}
      {crmUrl && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 max-w-3xl">
          {CRM_SECTIONS.map(({ path, label, desc, icon: Icon }) => (
            <a key={path} href={`${crmUrl}${path}`} target="_blank" rel="noopener noreferrer"
              className="bg-white border border-surface-200 rounded-xl p-4 hover:border-primary-200 hover:bg-primary-50 transition-colors">
              <Icon size={20} className="text-primary-600 mb-2" />
              <p className="text-sm font-semibold text-surface-800">{label}</p>
              <p className="text-xs text-surface-400">{desc}</p>
            </a>
          ))}
        </div>
      )}

      {/* Bill automation */}
      <Card className="max-w-3xl">
        <CardHeader>
          <h3 className="text-sm font-semibold text-surface-700 flex items-center gap-2">
            <MessageCircle size={16} /> Send bills on WhatsApp automatically
          </h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-sm text-surface-500">
            WhatsApp only allows businesses to start a chat with a <strong>Meta-approved template</strong>.
            Create one in the CRM (Settings → Templates) whose body uses these variables in order:{' '}
            <code>{'{{1}}'}</code> customer name, <code>{'{{2}}'}</code> salon name, <code>{'{{3}}'}</code> bill number,{' '}
            <code>{'{{4}}'}</code> amount. Example: “Hi {'{{1}}'}, thank you for visiting {'{{2}}'}! Your bill {'{{3}}'} for {'{{4}}'} is paid.”
          </p>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.waCrmAutoSendBill} disabled={!isAdmin}
              onChange={(e) => setF('waCrmAutoSendBill', e.target.checked)} className="w-4 h-4 accent-primary-600" />
            <span className="text-sm font-medium text-surface-700">Send the bill message to the customer after every new bill</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-surface-500">Template name</label>
              <input value={form.waCrmBillTemplate} disabled={!isAdmin} placeholder="e.g. bill_receipt"
                onChange={(e) => setF('waCrmBillTemplate', e.target.value)} className={field} />
            </div>
            <div>
              <label className="text-xs font-medium text-surface-500">Template language</label>
              <input value={form.waCrmTemplateLanguage} disabled={!isAdmin} placeholder="en"
                onChange={(e) => setF('waCrmTemplateLanguage', e.target.value)} className={field} />
            </div>
          </div>

          {isAdmin ? (
            <div className="flex flex-wrap items-end gap-3 pt-2 border-t border-surface-100">
              <Button onClick={save} disabled={saving}>
                {saving && <Loader2 size={14} className="animate-spin" />} Save
              </Button>
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs font-medium text-surface-500">Send a test to (after saving)</label>
                <input value={testPhone} onChange={(e) => setTestPhone(e.target.value)} placeholder="98765 43210" className={field} />
              </div>
              <Button variant="outline" onClick={sendTest} disabled={testing || !status?.connected || !testPhone.trim()}>
                {testing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send test
              </Button>
            </div>
          ) : (
            <p className="text-xs text-surface-400">Only the owner or an admin can change these settings.</p>
          )}
        </CardBody>
      </Card>
    </>
  );
}
