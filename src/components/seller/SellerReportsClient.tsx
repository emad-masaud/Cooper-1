import React, { useState, useEffect } from 'react';

interface QrLinkReport {
  id: string;
  short_code: string;
  target_url: string;
  title: string;
  entity_type: string;
  clicks_count: number;
  whatsapp_conversations_count?: number;
  last_scanned_device?: string;
  last_scanned_city?: string;
  is_active?: boolean;
  created_at: string;
}

export default function SellerReportsClient() {
  const [links, setLinks] = useState<QrLinkReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/qr');
      const data = await res.json();
      if (data.success) {
        setLinks(data.links || []);
      } else {
        setError(data.error || 'فشل تحميل الإحصائيات');
      }
    } catch {
      setError('خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Compute aggregated stats
  const totalScans = links.reduce((sum, item) => sum + (item.clicks_count || 0), 0);
  const totalWhatsAppChats = links.reduce((sum, item) => sum + (item.whatsapp_conversations_count || 0), 0);
  const conversionRate = totalScans > 0 ? Math.round((totalWhatsAppChats / totalScans) * 100) : 0;

  // Device Aggregation
  const deviceCounts: Record<string, number> = {};
  const cityCounts: Record<string, number> = {};

  links.forEach(l => {
    const scans = l.clicks_count || 0;
    const dev = l.last_scanned_device || 'جوال';
    deviceCounts[dev] = (deviceCounts[dev] || 0) + scans;

    const city = l.last_scanned_city || 'الرياض';
    cityCounts[city] = (cityCounts[city] || 0) + scans;
  });

  const totalDeviceScans = Object.values(deviceCounts).reduce((a, b) => a + b, 0) || 1;
  const topDevices = Object.entries(deviceCounts)
    .map(([name, count]) => ({
      name,
      count,
      pct: Math.round((count / totalDeviceScans) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  const totalCityScans = Object.values(cityCounts).reduce((a, b) => a + b, 0) || 1;
  const topCities = Object.entries(cityCounts)
    .map(([name, count]) => ({
      name,
      count,
      pct: Math.round((count / totalCityScans) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-full border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-600 dark:text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-xs font-bold text-zinc-400 block mb-1">إجمالي عمليات المسح (QR Scans)</span>
          <span className="text-3xl font-black text-primary">{totalScans.toLocaleString()}</span>
          <p className="text-[11px] font-bold text-zinc-500 mt-2">عبر جميع إعلاناتك وروابطك</p>
        </div>

        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-xs font-bold text-zinc-400 block mb-1">محادثات واتساب المفتوحة</span>
          <span className="text-3xl font-black text-emerald-600">{totalWhatsAppChats.toLocaleString()}</span>
          <p className="text-[11px] font-bold text-zinc-500 mt-2">تواصل مباشر مع العملاء</p>
        </div>

        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-xs font-bold text-zinc-400 block mb-1">معدل التحويل للتواصل</span>
          <span className="text-3xl font-black text-amber-600">{conversionRate}%</span>
          <p className="text-[11px] font-bold text-zinc-500 mt-2">نسبة الماسحين الذين فتحوا محادثة</p>
        </div>

        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-xs font-bold text-zinc-400 block mb-1">عدد الأكواد والروابط التفاعلية</span>
          <span className="text-3xl font-black text-purple-600">{links.length}</span>
          <p className="text-[11px] font-bold text-zinc-500 mt-2">روابط نشطة ومحفوظة بالأرشيف</p>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
          <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-4">
            📱 توزيع الأجهزة الماسحة
          </h4>
          {topDevices.length === 0 ? (
            <p className="text-xs font-bold text-zinc-400 py-6 text-center">لا توجد بيانات مسح حتى الآن</p>
          ) : (
            <div className="space-y-4">
              {topDevices.map((dev, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-zinc-800 dark:text-zinc-200">{dev.name}</span>
                    <span className="text-primary">{dev.count} مسحة ({dev.pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500 rounded-full"
                      style={{ width: `${dev.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* City Breakdown */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
          <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-4">
            📍 المدن والمناطق الأكثر نشاطاً ومسحاً
          </h4>
          {topCities.length === 0 ? (
            <p className="text-xs font-bold text-zinc-400 py-6 text-center">لا توجد بيانات مدن حتى الآن</p>
          ) : (
            <div className="space-y-4">
              {topCities.map((city, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-zinc-800 dark:text-zinc-200">{city.name}</span>
                    <span className="text-emerald-600">{city.count} مسحة ({city.pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                      style={{ width: `${city.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Table */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900 overflow-x-auto">
        <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-4">
          📊 تقرير أداء كل إعلان وباركود بالتفصيل
        </h4>

        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-zinc-400">جاري إعداد التقرير...</div>
        ) : links.length === 0 ? (
          <div className="py-12 text-center text-xs font-bold text-zinc-400">لا توجد روابط أو باركود في حسابك حتى الآن</div>
        ) : (
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-bold">
                <th className="pb-3 pr-2">العنوان والنوع</th>
                <th className="pb-3">الرمز المختصر</th>
                <th className="pb-3">المسحات</th>
                <th className="pb-3">محادثات واتساب</th>
                <th className="pb-3">معدل التحويل</th>
                <th className="pb-3">آخر جهاز</th>
                <th className="pb-3">آخر مدينة</th>
                <th className="pb-3">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-bold">
              {links.map(link => {
                const scans = link.clicks_count || 0;
                const chats = link.whatsapp_conversations_count || 0;
                const convPct = scans > 0 ? Math.round((chats / scans) * 100) : 0;
                return (
                  <tr key={link.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-3.5 pr-2 font-extrabold text-zinc-900 dark:text-white">
                      {link.title}
                      <span className="block text-[10px] text-zinc-400 font-medium">{link.entity_type === 'ad' ? 'إعلان' : link.entity_type === 'seller' ? 'متجر' : 'مخصص'}</span>
                    </td>
                    <td className="py-3.5 text-primary font-mono" dir="ltr">/q/{link.short_code}</td>
                    <td className="py-3.5 text-zinc-800 dark:text-zinc-200">{scans}</td>
                    <td className="py-3.5 text-emerald-600">{chats}</td>
                    <td className="py-3.5 text-amber-600">{convPct}%</td>
                    <td className="py-3.5 text-zinc-600 dark:text-zinc-400">{link.last_scanned_device || '-'}</td>
                    <td className="py-3.5 text-zinc-600 dark:text-zinc-400">{link.last_scanned_city || '-'}</td>
                    <td className="py-3.5">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] ${
                        link.is_active !== false ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                      }`}>
                        {link.is_active !== false ? 'نشط' : 'مؤرشف'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
