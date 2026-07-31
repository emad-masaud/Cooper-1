import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Users, Search, Plus, Trash2, Edit, Save, 
  X, HelpCircle, Check, Sparkles, MessageCircle, Globe, RefreshCw 
} from 'lucide-react';
import { useTranslations } from '~/i18n/utils';

interface ChatbotResponse {
  id: string;
  trigger_pattern: string;
  category: string;
  default_reply: string;
  custom_reply: string | null;
  use_count: number;
  is_ai_generated: boolean;
  created_at: string;
}

interface ChatbotContact {
  phone: string;
  name: string;
  country: string;
  message_count: number;
  last_message_at: string;
}

export default function SellerChatbotClient({ lang = 'ar' }: { lang?: string }) {
  const rtl = lang === 'ar';
  const t = useTranslations(lang);
  
  // Data State
  const [responses, setResponses] = useState<ChatbotResponse[]>([]);
  const [contacts, setContacts] = useState<ChatbotContact[]>([]);
  const [chatbotToken, setChatbotToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'responses' | 'contacts'>('responses');
  const [searchQuery, setSearchQuery] = useState('');

  // Form / Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingResponse, setEditingResponse] = useState<ChatbotResponse | null>(null);
  
  const [formTrigger, setFormTrigger] = useState('');
  const [formCategory, setFormCategory] = useState('general');
  const [formDefaultReply, setFormDefaultReply] = useState('');
  const [formCustomReply, setFormCustomReply] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seller/chatbot');
      const data = await res.json();
      if (data.success) {
        setResponses(data.responses || []);
        setContacts(data.contacts || []);
        setChatbotToken(data.chatbot_token || null);
      } else {
        setChatbotToken(`API ERROR: ${data.error || res.statusText}`);
      }
    } catch (err: any) {
      console.error('Failed to fetch chatbot seller data:', err);
      setChatbotToken(`FETCH ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingResponse(null);
    setFormTrigger('');
    setFormCategory('general');
    setFormDefaultReply('');
    setFormCustomReply('');
    setErrorMsg('');
    setSuccessMsg('');
    setShowModal(true);
  };

  const openEditModal = (resp: ChatbotResponse) => {
    setEditingResponse(resp);
    setFormTrigger(resp.trigger_pattern);
    setFormCategory(resp.category);
    setFormDefaultReply(resp.default_reply);
    setFormCustomReply(resp.custom_reply || '');
    setErrorMsg('');
    setSuccessMsg('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTrigger.trim() || !formDefaultReply.trim()) {
      setErrorMsg(t['chatbot.please_fill_all_required_field']);
      return;
    }

    const payload = {
      id: editingResponse?.id,
      trigger_pattern: formTrigger,
      category: formCategory,
      default_reply: formDefaultReply,
      custom_reply: formCustomReply ? formCustomReply : null
    };

    const method = editingResponse ? 'PUT' : 'POST';
    try {
      const res = await fetch('/api/seller/chatbot', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(t['chatbot.saved_successfully']);
        fetchData();
        setTimeout(() => setShowModal(false), 1500);
      } else {
        setErrorMsg(data.error || (t['chatbot.failed_to_save']));
      }
    } catch (err) {
      setErrorMsg(t['chatbot.server_communication_error']);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmText = t['chatbot.are_you_sure_you_want_to_delet'];
    if (!confirm(confirmText)) return;

    try {
      const res = await fetch('/api/seller/chatbot', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || (t['chatbot.failed_to_delete']));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter lists based on search query
  const filteredResponses = responses.filter(r => 
    r.trigger_pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.default_reply.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.custom_reply || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(c => 
    c.phone.includes(searchQuery) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8" dir={t['chatbot.ltr']}>
      {/* Webhook Configuration Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Globe size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              {t['chatbot.your_webhook_url']}
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
              {t['chatbot.copy_this_url_and_place_it_in']}
            </p>
            <div className="mt-4 flex flex-col md:flex-row gap-3">
              <input 
                type="text" 
                readOnly 
                value={chatbotToken ? `https://meamart.com/api/ai/sanad-chat?token=${chatbotToken}` : (t['chatbot.fetching_url'])}
                className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm font-mono text-zinc-800 dark:text-zinc-200"
              />
              <button 
                onClick={() => {
                  if (chatbotToken) {
                    navigator.clipboard.writeText(`https://meamart.com/api/ai/sanad-chat?token=${chatbotToken}`);
                    alert(t['chatbot.copied']);
                  }
                }}
                className="bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                {t['chatbot.copy_url']}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-4 bottom-4 opacity-15">
            <MessageSquare size={120} />
          </div>
          <p className="text-sm text-indigo-100 font-medium">{t['chatbot.total_cached_replies']}</p>
          <h3 className="text-4xl font-extrabold mt-2">{responses.length}</h3>
          <div className="flex items-center gap-2 mt-4 text-xs text-indigo-100">
            <Sparkles size={14} />
            <span>{responses.filter(r => r.is_ai_generated).length} {t['chatbot.generated_by_ai']}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-4 bottom-4 opacity-15">
            <Users size={120} />
          </div>
          <p className="text-sm text-emerald-100 font-medium">{t['chatbot.active_whatsapp_clients']}</p>
          <h3 className="text-4xl font-extrabold mt-2">{contacts.length}</h3>
          <p className="text-xs text-emerald-100 mt-4">
            {t['chatbot.automatically_registered_via_w']}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-4 bottom-4 opacity-15">
            <MessageCircle size={120} />
          </div>
          <p className="text-sm text-amber-100 font-medium">{t['chatbot.stats.saved_tokens']}</p>
          <h3 className="text-4xl font-extrabold mt-2">
            {responses.reduce((acc, curr) => acc + (curr.use_count || 0), 0)}
          </h3>
          <p className="text-xs text-amber-100 mt-4">
            {t['chatbot.stats.cache_hits']}
          </p>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-2.5">
          <button 
            onClick={() => { setActiveTab('responses'); setSearchQuery(''); }}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'responses' 
                ? 'bg-zinc-800 dark:bg-white text-white dark:text-zinc-900' 
                : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <MessageSquare size={16} />
            <span>{t['chatbot.replies_library']}</span>
          </button>
          <button 
            onClick={() => { setActiveTab('contacts'); setSearchQuery(''); }}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'contacts' 
                ? 'bg-zinc-800 dark:bg-white text-white dark:text-zinc-900' 
                : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Users size={16} />
            <span>{t['chatbot.contacts_session']}</span>
          </button>
        </div>

        <div className="flex items-center gap-3 flex-1 md:max-w-md">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'responses' 
                ? (t['chatbot.search_triggers_or_replies'])
                : (t['chatbot.search_phone_or_country'])
              }
              className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-full px-10 py-2.5 outline-none focus:border-indigo-500 dark:text-white"
            />
            <div className={`absolute top-3 ${t['chatbot.left_3']} text-zinc-400`}>
              <Search size={16} />
            </div>
          </div>
          
          {activeTab === 'responses' && (
            <button 
              onClick={openAddModal}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-sm flex items-center gap-2 transition-all"
            >
              <Plus size={16} />
              <span>{t['chatbot.add_reply']}</span>
            </button>
          )}

          <button 
            onClick={fetchData}
            title={t['chatbot.refresh']}
            className="p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-all"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-4">{t['chatbot.loading_data']}</p>
        </div>
      ) : activeTab === 'responses' ? (
        /* RESPONSES VIEW */
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="px-6 py-4">{t['chatbot.trigger_pattern']}</th>
                  <th className="px-6 py-4">{t['chatbot.category']}</th>
                  <th className="px-6 py-4">{t['chatbot.default_reply_replay']}</th>
                  <th className="px-6 py-4">{t['chatbot.custom_reply_replay_custom']}</th>
                  <th className="px-6 py-4 text-center">{t['chatbot.hits']}</th>
                  <th className="px-6 py-4 text-center">{t['chatbot.source']}</th>
                  <th className="px-6 py-4 text-center">{t['chatbot.actions']}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredResponses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-400 dark:text-zinc-500">
                      {t['chatbot.no_responses_found_matching_se']}
                    </td>
                  </tr>
                ) : (
                  filteredResponses.map(resp => (
                    <tr key={resp.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 transition-all text-sm text-zinc-700 dark:text-zinc-300">
                      <td className="px-6 py-4 font-bold text-zinc-800 dark:text-white break-all max-w-xs">{resp.trigger_pattern}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full text-xs font-medium">
                          {resp.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-md break-words truncate hover:whitespace-normal">{resp.default_reply}</td>
                      <td className="px-6 py-4 max-w-xs break-all">
                        {resp.custom_reply ? (
                          <span className="text-indigo-600 dark:text-indigo-400 font-mono">{resp.custom_reply}</span>
                        ) : (
                          <span className="text-zinc-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-zinc-900 dark:text-white">{resp.use_count}</td>
                      <td className="px-6 py-4 text-center">
                        {resp.is_ai_generated ? (
                          <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50 rounded-full text-xs font-bold inline-flex items-center gap-1">
                            <Sparkles size={10} />
                            <span>ذكاء اصطناعي</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 rounded-full text-xs font-bold inline-flex items-center gap-1">
                            <span>يدوي</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => openEditModal(resp)}
                            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-indigo-600 rounded-lg transition-all"
                            title={t['chatbot.edit']}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(resp.id)}
                            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-rose-600 rounded-lg transition-all"
                            title={t['chatbot.delete']}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CONTACTS VIEW */
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="px-6 py-4">{t['chatbot.phone']}</th>
                  <th className="px-6 py-4">{t['chatbot.name']}</th>
                  <th className="px-6 py-4">{t['chatbot.country']}</th>
                  <th className="px-6 py-4 text-center">{t['chatbot.message_count']}</th>
                  <th className="px-6 py-4">{t['chatbot.last_interaction']}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-400 dark:text-zinc-500">
                      {t['chatbot.no_contacts_found']}
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map(contact => (
                    <tr key={contact.phone} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 transition-all text-sm text-zinc-700 dark:text-zinc-300">
                      <td className="px-6 py-4 font-mono font-bold text-zinc-800 dark:text-white">+{contact.phone}</td>
                      <td className="px-6 py-4">{contact.name || (t['chatbot.whatsapp_user'])}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5">
                          <Globe size={14} className="text-zinc-400" />
                          <span>{contact.country}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-indigo-600 dark:text-indigo-400">{contact.message_count}</td>
                      <td className="px-6 py-4 text-zinc-400 dark:text-zinc-500">
                        {new Date(contact.last_message_at).toLocaleString(t['chatbot.en_us'])}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Response Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden" dir={t['chatbot.ltr']}>
            <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-xl font-black text-zinc-800 dark:text-white">
                {editingResponse 
                  ? (t['chatbot.edit_saved_reply']) 
                  : (t['chatbot.add_new_smart_reply'])
                }
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all text-zinc-400"
              >
                <X size={20} />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 p-3.5 rounded-full text-xs font-bold border border-rose-200 dark:border-rose-900/50">
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 p-3.5 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2">
                <Check size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                  {t['chatbot.trigger_pattern_query']}
                </label>
                <input 
                  type="text" 
                  value={formTrigger}
                  onChange={(e) => setFormTrigger(e.target.value)}
                  placeholder={t['chatbot.type_trigger']}
                  className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-indigo-500 dark:text-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                  {t['chatbot.category']}
                </label>
                <select 
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-indigo-500 dark:text-white"
                >
                  <option value="general">{t['chatbot.general_chat']}</option>
                  <option value="greeting">{t['chatbot.greeting']}</option>
                  <option value="sales">{t['chatbot.sales_inquiry']}</option>
                  <option value="support">{t['chatbot.technical_support']}</option>
                  <option value="custom">{t['chatbot.custom_advanced']}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                  {t['chatbot.default_reply_default_reply']}
                </label>
                <textarea 
                  value={formDefaultReply}
                  onChange={(e) => setFormDefaultReply(e.target.value)}
                  placeholder={t['chatbot.type_default_response']}
                  className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-indigo-500 dark:text-white h-24 resize-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                  {t['chatbot.custom_reply_custom_reply_opti']}
                </label>
                <textarea 
                  value={formCustomReply}
                  onChange={(e) => setFormCustomReply(e.target.value)}
                  placeholder={t['chatbot.type_custom_reply_overrides']}
                  className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-indigo-500 dark:text-white h-20 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl font-bold text-sm transition-all"
                >
                  {t['chatbot.cancel']}
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-indigo-600/10"
                >
                  <Save size={16} />
                  <span>{t['chatbot.save']}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
