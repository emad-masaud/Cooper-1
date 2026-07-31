import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Camera } from 'lucide-react';

interface QrLink {
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
  qr_options?: any;
  created_at: string;
}

interface BioLinkItem {
  label: string;
  url: string;
}

interface QrDesignState {
  colorMode: 'solid' | 'gradient';
  fgColor1: string;
  fgColor2: string;
  isTransparentBg: boolean;
  bgColor: string;
  logoMode: 'none' | 'center' | 'watermark';
  logoType: 'meamart' | 'whatsapp' | 'store' | 'custom';
  customLogoUrl?: string;
}

function isSocialPlatformUrl(url = '') {
  const str = url.toLowerCase();
  return str.includes('wa.me') || str.includes('whatsapp') || str.includes('instagram') ||
    str.includes('instagr.am') || str.includes('x.com') || str.includes('twitter') ||
    str.includes('tiktok') || str.includes('snapchat') || str.includes('t.me') ||
    str.includes('telegram') || str.includes('facebook') || str.includes('fb.com') ||
    str.includes('youtube') || str.includes('youtu.be') || str.includes('linkedin') ||
    str.includes('twitch') || str.includes('discord') || str.includes('nintendo') || str.includes('switch') ||
    str.includes('github') || str.includes('spotify') || str.includes('pinterest') || str.includes('reddit') ||
    str.includes('threads') || str.includes('apple') || str.includes('amazon') || str.includes('paypal') ||
    str.includes('stripe') || str.includes('patreon') || str.includes('maps.google') || str.includes('goo.gl/maps');
}

function getTheSvgBrandElement(slug: string, altName: string) {
  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/${slug}/default.svg`}
      className="w-4 h-4 object-contain drop-shadow-sm transition-transform duration-200"
      alt={altName}
      loading="lazy"
    />
  );
}

function detectSocialIcon(url = '', label = ''): { icon: React.ReactNode; name: string } {
  const str = `${url} ${label}`.toLowerCase();
  if (str.includes('wa.me') || str.includes('whatsapp') || str.includes('واتساب')) {
    return {
      icon: getTheSvgBrandElement('whatsapp', label || 'واتساب'),
      name: label || 'واتساب'
    };
  }
  if (str.includes('instagram') || str.includes('instagr.am') || str.includes('انستغرام') || str.includes('انستقرام')) {
    return {
      icon: getTheSvgBrandElement('instagram', label || 'انستغرام'),
      name: label || 'انستغرام'
    };
  }
  if (str.includes('twitter') || str.includes('x.com') || str.includes('تويتر')) {
    return {
      icon: getTheSvgBrandElement('x', label || 'تويتر / X'),
      name: label || 'تويتر / X'
    };
  }
  if (str.includes('tiktok') || str.includes('تيك توك')) {
    return {
      icon: getTheSvgBrandElement('tiktok', label || 'تيك توك'),
      name: label || 'تيك توك'
    };
  }
  if (str.includes('snapchat') || str.includes('سناب')) {
    return {
      icon: getTheSvgBrandElement('snapchat', label || 'سناب شات'),
      name: label || 'سناب شات'
    };
  }
  if (str.includes('t.me') || str.includes('telegram') || str.includes('تليجرام')) {
    return {
      icon: getTheSvgBrandElement('telegram', label || 'تليجرام'),
      name: label || 'تليجرام'
    };
  }
  if (str.includes('facebook') || str.includes('fb.com') || str.includes('فيسبوك')) {
    return {
      icon: getTheSvgBrandElement('facebook', label || 'فيسبوك'),
      name: label || 'فيسبوك'
    };
  }
  if (str.includes('youtube') || str.includes('youtu.be') || str.includes('يوتيوب')) {
    return {
      icon: getTheSvgBrandElement('youtube', label || 'يوتيوب'),
      name: label || 'يوتيوب'
    };
  }
  if (str.includes('linkedin') || str.includes('لينكدإن')) {
    return {
      icon: getTheSvgBrandElement('linkedin', label || 'لينكدإن'),
      name: label || 'لينكدإن'
    };
  }
  if (str.includes('maps.google') || str.includes('goo.gl/maps') || str.includes('الموقع الجغرافي') || str.includes('خرائط')) {
    return {
      icon: getTheSvgBrandElement('google-maps', label || 'الموقع الجغرافي'),
      name: label || 'الموقع الجغرافي'
    };
  }
  if (str.includes('twitch') || str.includes('تويتش')) {
    return {
      icon: getTheSvgBrandElement('twitch', label || 'تويتش'),
      name: label || 'تويتش'
    };
  }
  if (str.includes('switch') || str.includes('nintendo') || str.includes('سويتش')) {
    return {
      icon: getTheSvgBrandElement('nintendo', label || 'سويتش Switch'),
      name: label || 'سويتش Switch'
    };
  }
  if (str.includes('discord') || str.includes('ديسكورد')) {
    return {
      icon: getTheSvgBrandElement('discord', label || 'ديسكورد Discord'),
      name: label || 'ديسكورد Discord'
    };
  }
  if (str.includes('github') || str.includes('جيت هب') || str.includes('قيت هب')) {
    return {
      icon: getTheSvgBrandElement('github', label || 'جيت هب'),
      name: label || 'جيت هب'
    };
  }
  if (str.includes('spotify') || str.includes('سبوتيفاي')) {
    return {
      icon: getTheSvgBrandElement('spotify', label || 'سبوتيفاي'),
      name: label || 'سبوتيفاي'
    };
  }
  if (str.includes('pinterest') || str.includes('بنترست')) {
    return {
      icon: getTheSvgBrandElement('pinterest', label || 'بنترست'),
      name: label || 'بنترست'
    };
  }
  if (str.includes('reddit') || str.includes('ريديت')) {
    return {
      icon: getTheSvgBrandElement('reddit', label || 'ريديت'),
      name: label || 'ريديت'
    };
  }
  if (str.includes('threads') || str.includes('ثريدز')) {
    return {
      icon: getTheSvgBrandElement('threads', label || 'ثريدز'),
      name: label || 'ثريدز'
    };
  }
  if (str.includes('apple') || str.includes('أبل')) {
    return {
      icon: getTheSvgBrandElement('apple', label || 'أبل'),
      name: label || 'أبل'
    };
  }
  if (str.includes('amazon') || str.includes('أمازون')) {
    return {
      icon: getTheSvgBrandElement('amazon', label || 'أمازون'),
      name: label || 'أمازون'
    };
  }
  if (str.includes('paypal') || str.includes('باي بال')) {
    return {
      icon: getTheSvgBrandElement('paypal', label || 'باي بال'),
      name: label || 'باي بال'
    };
  }
  if (str.includes('stripe') || str.includes('سترايب')) {
    return {
      icon: getTheSvgBrandElement('stripe', label || 'سترايب'),
      name: label || 'سترايب'
    };
  }
  if (str.includes('patreon') || str.includes('باتريون')) {
    return {
      icon: getTheSvgBrandElement('patreon', label || 'باتريون'),
      name: label || 'باتريون'
    };
  }
  if (str.includes('mailto:') || str.includes('@') || str.includes('بريد')) {
    return {
      icon: <svg className="w-4 h-4 fill-current text-amber-400" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
      name: label || 'البريد الإلكتروني'
    };
  }
  if (str.includes('tel:') || str.includes('اتصال') || str.includes('هاتف')) {
    return {
      icon: <svg className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>,
      name: label || 'اتصال هاتفي'
    };
  }
  return {
    icon: <svg className="w-4 h-4 fill-current text-zinc-300" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>,
    name: label || 'رابط خارجي'
  };
}

export default function SellerQrManagerClient({ lang = 'ar' }: { lang?: string }) {
  const [links, setLinks] = useState<QrLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'bio' | 'other'>('all');
  const [activeTabMobile, setActiveTabMobile] = useState<'editor' | 'preview'>('editor');
  const [activeEditTabMobile, setActiveEditTabMobile] = useState<'editor' | 'preview'>('editor');

  const handleIconImageUpload = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxDim = 128;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        callback(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Mode: 'custom' (external dynamic link) or 'bio' (tailwind Link in Bio page)
  const [createMode, setCreateMode] = useState<'custom' | 'bio'>('custom');

  // Common Form state
  const [title, setTitle] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [fgColor, setFgColor] = useState('#6c47ff');
  const [creating, setCreating] = useState(false);

  // Link-in-Bio specific state
  const [bioDescription, setBioDescription] = useState(lang === 'ar' ? 'مرحباً بك في صفحتي الرسمية. يمكنك التواصل وتصفح الروابط أدناه.' : 'Welcome to my official page. You can contact me and browse the links below.');
  const [bioLinks, setBioLinks] = useState<any[]>(lang === 'ar' ? [
    { label: 'متجري على ميمارت', url: 'https://meamart.com/ar' },
    { label: 'تواصل عبر واتساب', url: 'https://wa.me/' }
  ] : [
    { label: 'My Store on MeaMart', url: 'https://meamart.com/en' },
    { label: 'Contact via WhatsApp', url: 'https://wa.me/' }
  ]);
  const [bioThemeBg, setBioThemeBg] = useState('#09090b');
  const [bioBgType, setBioBgType] = useState<'color' | 'pattern' | 'image'>('color');
  const [bioPatternType, setBioPatternType] = useState<'whatsapp' | 'dots' | 'grid' | 'waves' | 'stars' | 'diagonal'>('whatsapp');
  const [bioPatternColor, setBioPatternColor] = useState('#ffffff');
  const [bioBgImageUrl, setBioBgImageUrl] = useState('');
  const [bioTitleColor, setBioTitleColor] = useState('#ffffff');
  const [bioTextColor, setBioTextColor] = useState('#e4e4e7');
  const [bioSectionTitleColor, setBioSectionTitleColor] = useState('#fbbf24');
  const [bioFontFamily, setBioFontFamily] = useState('Tajawal');
  const [bioFontSize, setBioFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [bioSocialStyle, setBioSocialStyle] = useState<'squares' | 'circles'>('circles');
  const [bioCardStyle, setBioCardStyle] = useState<'rounded-full' | 'rounded-3xl' | 'rounded-lg' | 'rounded-none' | 'glass' | 'flat'>('rounded-full');
  const [bioAlign, setBioAlign] = useState<'center' | 'right'>('center');

  // Edit Modal State
  const [editingLink, setEditingLink] = useState<QrLink | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editEntityType, setEditEntityType] = useState<'custom' | 'bio'>('custom');
  const [editTargetUrl, setEditTargetUrl] = useState('');
  const [editBioDesc, setEditEditBioDesc] = useState('');
  const [editBioLinks, setEditBioLinks] = useState<any[]>([]);
  const [editBioThemeBg, setEditBioThemeBg] = useState('#09090b');
  const [editBioBgType, setEditBioBgType] = useState<'color' | 'pattern' | 'image'>('color');
  const [editBioPatternType, setEditBioPatternType] = useState<'whatsapp' | 'dots' | 'grid' | 'waves' | 'stars' | 'diagonal'>('whatsapp');
  const [editBioPatternColor, setEditBioPatternColor] = useState('#ffffff');
  const [editBioBgImageUrl, setEditBioBgImageUrl] = useState('');
  const [editBioTitleColor, setEditBioTitleColor] = useState('#ffffff');
  const [editBioTextColor, setEditBioTextColor] = useState('#e4e4e7');
  const [editBioSectionTitleColor, setEditBioSectionTitleColor] = useState('#fbbf24');
  const [editBioFontFamily, setEditBioFontFamily] = useState('Tajawal');
  const [editBioFontSize, setEditBioFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [editBioSocialStyle, setEditBioSocialStyle] = useState<'squares' | 'circles'>('circles');
  const [editBioCardStyle, setEditBioCardStyle] = useState<'rounded-full' | 'rounded-3xl' | 'rounded-lg' | 'rounded-none' | 'glass' | 'flat'>('rounded-full');
  const [editBioAlign, setEditBioAlign] = useState<'center' | 'right'>('center');
  const [updating, setUpdating] = useState(false);

  // QR Scanner / Inspector state
  const [inspectQuery, setInspectQuery] = useState('');
  const [inspecting, setInspecting] = useState(false);
  const [inspectedResult, setInspectedResult] = useState<any | null>(null);
  const [inspectError, setInspectError] = useState('');
  const [showCameraModal, setShowCameraModal] = useState(false);

  // Design & Export Studio Modal State
  const [designLink, setDesignLink] = useState<QrLink | null>(null);
  const [designState, setDesignState] = useState<QrDesignState>({
    colorMode: 'solid',
    fgColor1: '#6c47ff',
    fgColor2: '#ec4899',
    isTransparentBg: false,
    bgColor: '#ffffff',
    logoMode: 'center',
    logoType: 'meamart'
  });
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const isAr = lang === 'ar';
  const t = (key: string, defaultValue?: string): string => {
    const translations: Record<string, string> = {
      // Create section
      'create.header': isAr ? 'إنشاء باركود ورابط مختصر جديد' : 'Create New QR & Short Link',
      'create.tab.custom': isAr ? 'رابط ديناميكي' : 'Dynamic Link',
      'create.tab.bio': isAr ? 'الرابط الموحد' : 'Bio Link',
      'create.title': isAr ? 'عنوان الباركود' : 'QR Code Title',
      'create.title.placeholder.bio': isAr ? 'مثال: روابط متجري الشخصي' : 'e.g. My Bio Links',
      'create.title.placeholder.custom': isAr ? 'مثال: موقعي الخارجي أو عرض خاص' : 'e.g. My External Site / Promo',
      'create.targetUrl': isAr ? 'الرابط المستهدف (قابل للتعديل لاحقاً دون تغير الباركود)' : 'Target Destination URL (Editable later without changing QR)',
      'create.shortcode': isAr ? 'الرمز المختصر المخصص (اختياري)' : 'Custom Short URL Slug (Optional)',
      'create.shortcode.placeholder': isAr ? 'my-bio (حروف إنجليزية وأرقام فقط)' : 'my-bio (English letters & numbers only)',
      
      // Filter section
      'filter.all': isAr ? 'الكل' : 'All',
      'filter.bio': isAr ? 'الرابط الموحد' : 'Bio Link',
      'filter.barcode': isAr ? 'الباركود' : 'Barcode',
      'filter.loading': isAr ? 'جاري تحميل الباركود...' : 'Loading QR codes...',
      'filter.empty': isAr ? 'لا توجد أية أكواد باركود بعد.' : 'No QR codes created yet.',
      
      // QR Card details
      'card.scans': isAr ? 'المسحات' : 'Scans',
      'card.chats': isAr ? 'محادثات واتساب' : 'WhatsApp Chats',
      'card.created': isAr ? 'تاريخ الإنشاء' : 'Created Date',
      'card.download': isAr ? 'تحميل الباركود PNG 📥' : 'Download QR PNG 📥',
      'card.copy': isAr ? 'نسخ الرابط الموحد 🔗' : 'Copy Bio Link 🔗',
      'card.targetUrl': isAr ? 'الرابط المستهدف:' : 'Destination URL:',
      'card.shortUrl': isAr ? 'رابط الباركود الذكي:' : 'Smart Short Link:',
      'card.type': isAr ? 'النوع:' : 'Type:',
      'card.type.ad': isAr ? 'إعلان ميمارت' : 'MeaMart Ad',
      'card.type.seller': isAr ? 'صفحة المعلن' : 'Seller Page',
      'card.type.bio': isAr ? 'الرابط الموحد' : 'Bio Link Page',
      'card.type.custom': isAr ? 'رابط مخصص' : 'Custom Short Link',
      'card.active': isAr ? 'نشط' : 'Active',
      'card.inactive': isAr ? 'معطل' : 'Disabled',
      
      // Live Preview panel
      'preview.header': isAr ? 'معاينة حية ومباشرة للرابط الموحد' : 'Live Bio Page Preview',
      'preview.directUrl': isAr ? '🔗 رابط الرابط الموحد المباشر والفعال:' : '🔗 Direct Bio Page URL:',
      
      // Edit Modal
      'edit.header': isAr ? 'تعديل الرابط الموحد والباركود' : 'Edit Bio Link & Barcode',
      'edit.title': isAr ? 'عنوان الرابط الموحد' : 'Bio Title',
      'edit.alert.locked': isAr ? '🔒 هذا الباركود مرتبط تلقائياً بصفحتك أو إعلانك. لا يمكن تغيير الرابط الوجهة لضمان حفظ الباركود ومصداقية الوصول.' : '🔒 This QR code is automatically linked to your store/ad. The destination URL cannot be modified to preserve scan integrity.',
      
      // Bio design and customisation
      'create.bio.description.label': isAr ? 'النبذة التعريفية لصفحة الرابط الموحد' : 'Bio Page Description / Headline',
      'create.bio.design.title': isAr ? '🎨 تخصيص المظهر وتصميم الرابط الموحد' : '🎨 Customize Appearance & Bio Design',
      'create.bio.bg.color': isAr ? '🎨 لون سادة' : '🎨 Solid Color',
      'create.bio.bg.pattern': isAr ? '✨ نقشة وباترن' : '✨ Pattern & Grid',
      'create.bio.bg.image': isAr ? '🖼️ صورة خلفية' : '🖼️ Background Image',
      'create.bio.pattern.type': isAr ? 'اختر شكل النقشة' : 'Select Pattern Style',
      'create.bio.pattern.whatsapp': isAr ? '💬 نقشة تشبه خلفية الواتساب الافتراضية' : '💬 WhatsApp Default Pattern',
      'create.bio.pattern.dots': isAr ? '⚪ نقاط أنيقة (Dots)' : '⚪ Elegant Dots',
      'create.bio.pattern.grid': isAr ? '📐 مربعات فاخرة (Grid)' : '📐 Classic Grid',
      'create.bio.pattern.waves': isAr ? '〰️ تموجات هندسية (Waves)' : '〰️ Geometric Waves',
      'create.bio.pattern.stars': isAr ? '✨ نجوم متناثرة (Stars)' : '✨ Scattered Stars',
      'create.bio.pattern.diagonal': isAr ? '📐 خطوط مائلة (Diagonal)' : '📐 Diagonal Stripes',
      'create.bio.pattern.color': isAr ? 'لون النقشة منفصل' : 'Pattern Overlay Color',
      'create.bio.bg.imageUrl': isAr ? 'رابط صورة الخلفية (URL)' : 'Background Image URL',
      'create.bio.bg.pageColor': isAr ? 'لون وخلفية الصفحة' : 'Page Background Color',
      'create.bio.titleColor': isAr ? 'لون العنوان الرئيسي' : 'Header Title Color',
      'create.bio.textColor': isAr ? 'لون النص العام في الصفحة' : 'General Text Color',
      'create.bio.sectionTitleColor': isAr ? 'لون عناوين الأقسام' : 'Section Titles Color',
      'create.bio.font.label': isAr ? 'نوع وحجم الخط' : 'Font Family & Size',
      'create.bio.fontSize.sm': isAr ? 'صغير' : 'Small',
      'create.bio.fontSize.md': isAr ? 'متوسط' : 'Medium',
      'create.bio.fontSize.lg': isAr ? 'كبير' : 'Large',
      
      // Additional design elements
      'create.bio.social.label': isAr ? 'تصميم أيقونات التواصل الاجتماعي' : 'Social Media Icons Style',
      'create.bio.social.circles': isAr ? 'أيقونات دائرية' : 'Circular Icons',
      'create.bio.social.squares': isAr ? 'مربعات جنب بعض' : 'Side-by-side Squares',
      'create.bio.cardShapes.label': isAr ? 'نظام زوايا الكروت والشيبس (Card Shapes)' : 'Card Shapes & Border Corners',
      'create.bio.cardShapes.smooth': isAr ? 'ناعمة' : 'Smooth',
      'create.bio.cardShapes.round': isAr ? 'دائرية' : 'Round',
      'create.bio.cardShapes.sharp': isAr ? 'حادة' : 'Sharp',
      'create.bio.cardShapes.glass': isAr ? 'زجاجي' : 'Glassmorphism',
      'create.bio.cardShapes.none': isAr ? 'بدون' : 'Flat/No Border',
      'create.bio.align.label': isAr ? 'محاذاة النص في الكروت' : 'Text Alignment in Cards',
      'create.bio.align.center': isAr ? 'توسيط (Center)' : 'Center',
      'create.bio.align.right': isAr ? 'يمين (Right)' : 'Right',
      'create.bio.links.label': isAr ? 'روابط التواصل وأقسام الصفحة' : 'Social Links & Page Sections',
      'create.bio.add.section': isAr ? '+ عنوان قسم' : '+ Section Header',
      'create.bio.add.menu': isAr ? '+ صنف منيو / سعر' : '+ Menu Item / Price',
      'create.bio.add.custom': isAr ? '+ رابط مخصص' : '+ Custom Link',
      'create.bio.social.quickadd': isAr ? 'إضافة منصة تواصل سريعة:' : 'Quick Add Social Platform:',
      'create.bio.link.defaultSection': isAr ? 'قسم جديد' : 'New Section',
      'create.bio.link.defaultMenu': isAr ? 'صنف منيو' : 'Menu Item',
      'create.bio.link.price': isAr ? '100 ر.س' : '100 SAR',
      
      // Platform translations
      'platform.whatsapp': isAr ? 'واتساب' : 'WhatsApp',
      'platform.instagram': isAr ? 'انستغرام' : 'Instagram',
      'platform.snapchat': isAr ? 'سناب شات' : 'Snapchat',
      'platform.tiktok': isAr ? 'تيك توك' : 'TikTok',
      'platform.twitter': isAr ? 'تويتر / X' : 'Twitter / X',
      'platform.telegram': isAr ? 'تليجرام' : 'Telegram',
      'platform.facebook': isAr ? 'فيسبوك' : 'Facebook',
      'platform.youtube': isAr ? 'يوتيوب' : 'YouTube',
      'platform.linkedin': isAr ? 'لينكدإن' : 'LinkedIn',
      'platform.maps': isAr ? 'خرائط الموقع' : 'Location Maps',
      'platform.twitch': isAr ? 'تويتش' : 'Twitch',
      'platform.switch': isAr ? 'سويتش' : 'Switch',
      'platform.discord': isAr ? 'ديسكورد' : 'Discord',
      'platform.email': isAr ? 'البريد' : 'Email',
      'platform.website': isAr ? 'الموقع' : 'Website',
      'platform.call': isAr ? 'اتصال' : 'Call',
      
      // Fields & values
      'field.icon': isAr ? 'أيقونة' : 'Icon',
      'field.myStore': isAr ? 'متجري على ميمارت' : 'My Store on MeaMart',
      'field.contactWhatsApp': isAr ? 'تواصل عبر واتساب' : 'Contact via WhatsApp',
      'field.noLine': isAr ? 'بدون خط' : 'No Line',
      'field.accountName': isAr ? 'اسم الحساب' : 'Account Name',
      'field.aboutDefault': isAr ? 'مرحباً بك في صفحتي الرسمية. يمكنك التواصل وتصفح الروابط أدناه.' : 'Welcome to my official page. You can contact me and browse the links below.',
      
      // Mockup and general labels
      'mockup.share': isAr ? 'مشاركة ↗' : 'Share ↗',
      'mockup.createdWith': isAr ? 'تم الإنشاء عن طريق MeaMart' : 'Created by MeaMart',
      'mockup.livePreview': isAr ? 'معاينة حية ومباشرة للرابط الموحد' : 'Live Bio Page Preview',
      'mockup.bioLink': isAr ? 'الرابط الموحد' : 'Bio Link',
      
      // Menu Line separator styles
      'menu.lineStyle.dotted': isAr ? 'خط منقط' : 'Dotted Line',
      'menu.lineStyle.dashed': isAr ? 'خط مخطط' : 'Dashed Line',
      'menu.lineStyle.solid': isAr ? 'خط متصل' : 'Solid Line',
      'menu.lineStyle.none': isAr ? 'بدون خط' : 'No Line',
      
      // Edit modal custom labels
      'edit.bio.designGroup': isAr ? '🎨 إعدادات المظهر والخط والتصميم' : '🎨 Appearance, Font & Style Settings',
      'edit.bio.bgType': isAr ? 'نوع الخلفية' : 'Background Type',
      'edit.bio.pageBg': isAr ? 'الخلفية' : 'Page Background Color',
      'edit.bio.titleColor': isAr ? 'لون العنوان' : 'Header Title Color',
      'edit.bio.textColor': isAr ? 'لون النص العام' : 'General Text Color',
      'edit.bio.sectionColor': isAr ? 'لون الأقسام' : 'Section Titles Color',
      'edit.bio.fontAndIcons': isAr ? 'الخط وأيقونات التواصل' : 'Font & Social Icons',
      'edit.bio.cardShapes': isAr ? 'شكل وحواف أزرار الروابط (Card Shapes)' : 'Card Corners & Border Shapes',
      'edit.bio.textAlign': isAr ? 'محاذاة النص في الكروت' : 'Text Alignment in Cards',
      'edit.bio.align.center': isAr ? 'توسيط' : 'Center',
      'edit.bio.align.right': isAr ? 'يمين' : 'Right',
      'edit.bio.addLink': isAr ? '+ إضافة رابط' : '+ Add Link',
      
      // Inspection & New Actions translations
      'inspect.title': isAr ? 'فحص الباركود واستعادة الأرشيف' : 'Inspect Barcode & Restore Archive',
      'inspect.desc': isAr ? 'أدخل رمز أو رابط أي باركود مطبوع سابقاً لفحص مالكه وإحصائياته وتفعيله فوراً إذا كان يخص إعلاناً سابقاً' : 'Enter the code or link of any previously printed barcode to check owner, stats, and activate immediately if it belongs to a past ad',
      'inspect.button': isAr ? 'فحص الباركود' : 'Inspect Barcode',
      'inspect.placeholder': isAr ? 'مثال: ad-123 أو رابط الباركود https://meamart.com/q/...' : 'e.g. ad-123 or barcode link https://meamart.com/q/...',
      'inspect.camera': isAr ? 'مسح بالكاميرا' : 'Scan with Camera',
      'inspect.camera.title': isAr ? 'مسح الباركود مباشرة من كاميرا الهاتف أو جهازك' : 'Scan barcode directly from phone camera or your device',
      'create.color': isAr ? 'لون الباركود' : 'Barcode Color',
      'create.button.submit': isAr ? 'إنشاء الباركود' : 'Create Barcode',
      'create.button.submitting': isAr ? 'جاري الإنشاء...' : 'Creating...',
      'action.edit': isAr ? 'تعديل' : 'Edit',
      'action.delete': isAr ? 'حذف' : 'Delete',
      'action.design': isAr ? 'تصميم وطباعة QR' : 'Design & Print QR',
      'action.copy': isAr ? 'نسخ' : 'Copy',
      'action.copied': isAr ? 'تم النسخ' : 'Copied',
      'scans.count': isAr ? 'عمليات المسح:' : 'Scans:',
      'whatsapp.chats': isAr ? 'محادثات واتساب:' : 'WhatsApp Chats:',
      'card.autoLocked': isAr ? '🔒 محمي تلقائياً (محفوظ لمنع التغيير بالخطأ)' : '🔒 Auto Protected (Locked to prevent accidental changes)',
      'card.storeQr': isAr ? 'باركود المتجر (تلقائي)' : 'Store Barcode (Automatic)',
      'card.adQr': isAr ? 'باركود إعلان (تلقائي)' : 'Ad Barcode (Automatic)',
      'card.bioQr': isAr ? 'الرابط الموحد' : 'Bio Link',
      'card.customQr': isAr ? 'رابط خارجي ديناميكي' : 'Dynamic External Link',
    };
    return translations[key] || defaultValue || key;
  };

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/qr');
      const data = await res.json();
      let fetchedLinks: QrLink[] = data.success ? (data.links || []) : [];

      try {
        const localSaved = localStorage.getItem('meamart_custom_qr_links');
        if (localSaved) {
          const parsedLocal: QrLink[] = JSON.parse(localSaved);
          const existingIds = new Set(fetchedLinks.map(l => l.id));
          for (const lItem of parsedLocal) {
            if (!existingIds.has(lItem.id)) {
              fetchedLinks.push(lItem);
            }
          }
        }
      } catch (e) {}

      setLinks(fetchedLinks);
    } catch (err: any) {
      setError('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCopy = (code: string, id: string) => {
    const fullUrl = `${window.location.origin}/q/${code}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createMode === 'custom' && !targetUrl) return;
    setCreating(true);
    setError('');

    const payload: any = {
      title: title || (createMode === 'bio' ? 'الرابط الموحد' : 'رابط باركود مخصص'),
      short_code: shortCode,
      entity_type: createMode,
      qr_options: {
        fgColor,
        bgColor: '#ffffff',
        logo: 'whatsapp',
        bioDescription: createMode === 'bio' ? bioDescription : undefined,
        bioLinks: createMode === 'bio' ? bioLinks : undefined,
        themeBg: createMode === 'bio' ? bioThemeBg : undefined,
        bgType: createMode === 'bio' ? bioBgType : undefined,
        patternType: createMode === 'bio' ? bioPatternType : undefined,
        patternColor: createMode === 'bio' ? bioPatternColor : undefined,
        bgImageUrl: createMode === 'bio' ? bioBgImageUrl : undefined,
        titleColor: createMode === 'bio' ? bioTitleColor : undefined,
        textColor: createMode === 'bio' ? bioTextColor : undefined,
        sectionTitleColor: createMode === 'bio' ? bioSectionTitleColor : undefined,
        fontFamily: createMode === 'bio' ? bioFontFamily : undefined,
        fontSize: createMode === 'bio' ? bioFontSize : undefined,
        socialStyle: createMode === 'bio' ? bioSocialStyle : undefined,
        cardStyle: createMode === 'bio' ? bioCardStyle : undefined,
        alignment: createMode === 'bio' ? bioAlign : undefined
      }
    };

    if (createMode === 'custom') {
      payload.target_url = targetUrl;
    }

    try {
      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        if (data.link) {
          try {
            const localSaved = localStorage.getItem('meamart_custom_qr_links');
            const parsed: QrLink[] = localSaved ? JSON.parse(localSaved) : [];
            parsed.unshift(data.link);
            localStorage.setItem('meamart_custom_qr_links', JSON.stringify(parsed));
          } catch (e) {}
        }
        setTitle('');
        setTargetUrl('');
        setShortCode('');
        fetchLinks();
      } else {
        setError(data.error || 'فشل إنشاء الرابط');
      }
    } catch (err: any) {
      setError('حدث خطأ أثناء إنشاء الرابط');
    } finally {
      setCreating(false);
    }
  };

  const performInspect = async (codeText: string) => {
    if (!codeText.trim()) return;
    setInspecting(true);
    setInspectError('');
    setInspectedResult(null);
    try {
      const res = await fetch(`/api/qr/verify?code=${encodeURIComponent(codeText.trim())}`);
      const data = await res.json();
      if (data.success) {
        setInspectedResult(data);
      } else {
        setInspectError(data.error || 'فشل فحص الباركود');
      }
    } catch {
      setInspectError('خطأ في الاتصال بالسيرفر');
    } finally {
      setInspecting(false);
    }
  };

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    performInspect(inspectQuery);
  };

  useEffect(() => {
    if (!showCameraModal) return;
    let scannerInstance: any = null;
    let cancelled = false;

    import('html5-qrcode').then(({ Html5QrcodeScanner }) => {
      if (cancelled) return;
      scannerInstance = new Html5QrcodeScanner(
        "qr-camera-reader",
        { fps: 10, qrbox: { width: 260, height: 260 }, rememberLastUsedCamera: true },
        /* verbose= */ false
      );
      scannerInstance.render(
        (decodedText: string) => {
          try {
            scannerInstance.clear();
          } catch {}
          setShowCameraModal(false);
          let cleanCode = decodedText;
          if (cleanCode.includes('/q/')) {
            const parts = cleanCode.split('/q/');
            cleanCode = parts[parts.length - 1].split('?')[0];
          }
          setInspectQuery(cleanCode);
          performInspect(cleanCode);
        },
        () => {}
      );
    });

    return () => {
      cancelled = true;
      if (scannerInstance) {
        try {
          scannerInstance.clear();
        } catch {}
      }
    };
  }, [showCameraModal]);

  const handleReactivateLink = async (shortCode: string) => {
    try {
      const res = await fetch('/api/qr/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ short_code: shortCode, action: 'reactivate' })
      });
      const data = await res.json();
      if (data.success) {
        alert('تم تفعيل واستعادة الباركود بنجاح!');
        handleInspect({ preventDefault: () => {} } as any);
        fetchLinks();
      } else {
        alert(data.error || 'فشل تفعيل الباركود');
      }
    } catch {
      alert('خطأ في الاتصال');
    }
  };

  const openEditModal = (link: QrLink) => {
    setEditingLink(link);
    setEditTitle(link.title || '');
    setEditEntityType((link.entity_type === 'bio' ? 'bio' : 'custom'));
    setEditTargetUrl(link.target_url || '');
    const opts = link.qr_options || {};
    setEditEditBioDesc(opts.bioDescription || '');
    setEditBioLinks(Array.isArray(opts.bioLinks) ? opts.bioLinks : []);
    setEditBioThemeBg(opts.themeBg || '#09090b');
    setEditBioBgType(opts.bgType || 'color');
    setEditBioPatternType(opts.patternType || 'whatsapp');
    setEditBioPatternColor(opts.patternColor || '#ffffff');
    setEditBioBgImageUrl(opts.bgImageUrl || '');
    setEditBioTitleColor(opts.titleColor || '#ffffff');
    setEditBioTextColor(opts.textColor || '#e4e4e7');
    setEditBioSectionTitleColor(opts.sectionTitleColor || '#fbbf24');
    setEditBioFontFamily(opts.fontFamily || 'Tajawal');
    setEditBioFontSize(opts.fontSize || 'md');
    setEditBioSocialStyle(opts.socialStyle || 'circles');
    setEditBioCardStyle(opts.cardStyle || 'rounded-full');
    setEditBioAlign(opts.alignment || 'center');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    setUpdating(true);
    try {
      const payload: any = {
        title: editTitle,
      };
      if (editingLink.entity_type === 'custom' || editingLink.entity_type === 'bio') {
        payload.entity_type = editEntityType;
      }
      if (editEntityType === 'custom') {
        payload.target_url = editTargetUrl;
      }
      if (editEntityType === 'bio') {
        payload.qr_options = {
          ...(editingLink.qr_options || {}),
          bioDescription: editBioDesc,
          bioLinks: editBioLinks,
          themeBg: editBioThemeBg,
          bgType: editBioBgType,
          patternType: editBioPatternType,
          patternColor: editBioPatternColor,
          bgImageUrl: editBioBgImageUrl,
          titleColor: editBioTitleColor,
          textColor: editBioTextColor,
          sectionTitleColor: editBioSectionTitleColor,
          fontFamily: editBioFontFamily,
          fontSize: editBioFontSize,
          socialStyle: editBioSocialStyle,
          cardStyle: editBioCardStyle,
          alignment: editBioAlign
        };
      }

      try {
        const localSaved = localStorage.getItem('meamart_custom_qr_links');
        if (localSaved) {
          const parsed: QrLink[] = JSON.parse(localSaved);
          const idx = parsed.findIndex(l => l.id === editingLink.id);
          if (idx !== -1) {
            parsed[idx] = { ...parsed[idx], ...payload };
            localStorage.setItem('meamart_custom_qr_links', JSON.stringify(parsed));
          }
        }
      } catch (e) {}

      try {
        await fetch(`/api/qr/${editingLink.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (e) {}

      setLinks(prev => prev.map(l => l.id === editingLink.id ? { ...l, ...payload } : l));
      setEditingLink(null);
      fetchLinks();
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الرابط والباركود؟')) return;
    try {
      try {
        const localSaved = localStorage.getItem('meamart_custom_qr_links');
        if (localSaved) {
          const parsed: QrLink[] = JSON.parse(localSaved);
          localStorage.setItem('meamart_custom_qr_links', JSON.stringify(parsed.filter(l => l.id !== id)));
        }
      } catch (e) {}

      const res = await fetch(`/api/qr/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success || res.status === 404) {
        setLinks(prev => prev.filter(l => l.id !== id));
      } else {
        alert(data.error || 'فشل حذف الرابط');
      }
    } catch {
      setLinks(prev => prev.filter(l => l.id !== id));
    }
  };

  const addBioLink = () => {
    setBioLinks(prev => [...prev, { label: '', url: '' }]);
  };

  const updateBioLink = (index: number, field: 'label' | 'url', value: string) => {
    setBioLinks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeBioLink = (index: number) => {
    setBioLinks(prev => prev.filter((_, idx) => idx !== index));
  };

  // ── QR Rendering Engine (Canvas / SVG) ──────────────────────────────────
  const openDesignStudio = (link: QrLink) => {
    setDesignLink(link);
    setDesignState({
      colorMode: 'solid',
      fgColor1: link.qr_options?.fgColor || '#6c47ff',
      fgColor2: '#ec4899',
      isTransparentBg: false,
      bgColor: link.qr_options?.bgColor || '#ffffff',
      logoMode: 'center',
      logoType: link.entity_type === 'seller' ? 'store' : 'meamart'
    });
  };

  const drawLogoIcon = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, type: 'meamart' | 'whatsapp' | 'store' | 'custom', alpha = 1.0, customUrl?: string) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    const r = size / 2;

    if (type === 'custom' && customUrl) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      const img = new Image();
      img.src = customUrl;
      if (img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.88, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, cx - r * 0.88, cy - r * 0.88, r * 1.76, r * 1.76);
        ctx.restore();
      } else {
        img.onload = () => {
          if (previewCanvasRef.current && designLink) {
            const fullUrl = `${window.location.origin}/q/${designLink.short_code}`;
            renderQrCanvas(previewCanvasRef.current, previewCanvasRef.current.width || 360, designState, fullUrl);
          }
        };
      }
    } else if (type === 'meamart') {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      const img = new Image();
      img.src = '/logo.png';
      if (img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.88, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, cx - r * 0.88, cy - r * 0.88, r * 1.76, r * 1.76);
        ctx.restore();
      } else {
        img.onload = () => {
          if (previewCanvasRef.current && designLink) {
            const fullUrl = `${window.location.origin}/q/${designLink.short_code}`;
            renderQrCanvas(previewCanvasRef.current, previewCanvasRef.current.width || 360, designState, fullUrl);
          }
        };
      }
    } else if (type === 'whatsapp') {
      ctx.fillStyle = '#25D366';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(cx - r * 0.55, cy - r * 0.55);
      const scale = (r * 1.1) / 24;
      ctx.scale(scale, scale);
      const waPath = new Path2D("M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z");
      ctx.fillStyle = '#ffffff';
      ctx.fill(waPath);
      ctx.restore();
    } else {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(cx - r * 0.55, cy - r * 0.55);
      const scale = (r * 1.1) / 24;
      ctx.scale(scale, scale);
      const bagPath = new Path2D("M16 6V4a4 4 0 00-8 0v2H3v14a2 2 0 002 2h14a2 2 0 002-2V6h-5zM10 4a2 2 0 014 0v2h-4V4zm8 16H6V8h2v2a1 1 0 002 0V8h4v2a1 1 0 002 0V8h2v12z");
      ctx.fillStyle = '#ffffff';
      ctx.fill(bagPath);
      ctx.restore();
    }
    ctx.restore();
  };

  const renderQrCanvas = (canvas: HTMLCanvasElement, sizePx: number, state: QrDesignState, fullUrl: string) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = sizePx;
    canvas.height = sizePx;
    ctx.clearRect(0, 0, sizePx, sizePx);

    if (!state.isTransparentBg) {
      ctx.fillStyle = state.bgColor;
      ctx.fillRect(0, 0, sizePx, sizePx);
    }

    if (state.logoMode === 'watermark') {
      drawLogoIcon(ctx, sizePx / 2, sizePx / 2, sizePx * 0.65, state.logoType, 0.12, state.customLogoUrl);
    }

    const qrData = QRCode.create(fullUrl, { errorCorrectionLevel: 'H' });
    const modules = qrData.modules;
    const gridSize = modules.size;
    const marginCells = 2;
    const totalCells = gridSize + marginCells * 2;
    const cellSize = sizePx / totalCells;

    const centerMin = Math.floor(gridSize * 0.38);
    const centerMax = Math.ceil(gridSize * 0.62);

    let fillStyle: string | CanvasGradient = state.fgColor1;
    if (state.colorMode === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, sizePx, sizePx);
      grad.addColorStop(0, state.fgColor1);
      grad.addColorStop(1, state.fgColor2);
      fillStyle = grad;
    }

    ctx.fillStyle = fillStyle;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isDark = modules.get(x, y);
        if (!isDark) continue;

        if (state.logoMode === 'center' && x >= centerMin && x <= centerMax && y >= centerMin && y <= centerMax) {
          continue;
        }

        const px = (x + marginCells) * cellSize;
        const py = (y + marginCells) * cellSize;

        const radius = cellSize * 0.48;
        ctx.beginPath();
        ctx.roundRect(px, py, cellSize + 0.3, cellSize + 0.3, radius);
        ctx.fill();
      }
    }

    if (state.logoMode === 'center') {
      const logoSize = sizePx * 0.22;
      const badgeSize = logoSize * 1.18;
      const cx = sizePx / 2;
      const cy = sizePx / 2;

      ctx.fillStyle = state.isTransparentBg ? '#ffffff' : state.bgColor;
      ctx.beginPath();
      ctx.arc(cx, cy, badgeSize / 2, 0, Math.PI * 2);
      ctx.fill();

      drawLogoIcon(ctx, cx, cy, logoSize, state.logoType, 1.0, state.customLogoUrl);
    }
  };

  useEffect(() => {
    if (!designLink || !previewCanvasRef.current) return;
    const fullUrl = `${window.location.origin}/q/${designLink.short_code}`;
    renderQrCanvas(previewCanvasRef.current, 360, designState, fullUrl);
  }, [designLink, designState]);

  const downloadPng = (sizePx: number, labelName: string) => {
    if (!designLink) return;
    const fullUrl = `${window.location.origin}/q/${designLink.short_code}`;
    const offscreen = document.createElement('canvas');
    renderQrCanvas(offscreen, sizePx, designState, fullUrl);

    offscreen.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meamart-qr-${designLink.short_code}-${labelName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const downloadSvg = () => {
    if (!designLink) return;
    const fullUrl = `${window.location.origin}/q/${designLink.short_code}`;
    const qrData = QRCode.create(fullUrl, { errorCorrectionLevel: 'H' });
    const modules = qrData.modules;
    const gridSize = modules.size;
    const marginCells = 2;
    const totalCells = gridSize + marginCells * 2;
    const centerMin = Math.floor(gridSize * 0.38);
    const centerMax = Math.ceil(gridSize * 0.62);

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalCells} ${totalCells}" width="1200" height="1200">\n`;

    if (designState.colorMode === 'gradient') {
      svgContent += `  <defs>\n    <linearGradient id="qrGrad" x1="0%" y1="0%" x2="100%" y2="100%">\n      <stop offset="0%" stop-color="${designState.fgColor1}" />\n      <stop offset="100%" stop-color="${designState.fgColor2}" />\n    </linearGradient>\n  </defs>\n`;
    }

    if (!designState.isTransparentBg) {
      svgContent += `  <rect width="${totalCells}" height="${totalCells}" fill="${designState.bgColor}" />\n`;
    }

    const fillAttr = designState.colorMode === 'gradient' ? 'url(#qrGrad)' : designState.fgColor1;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (!modules.get(x, y)) continue;
        if (designState.logoMode === 'center' && x >= centerMin && x <= centerMax && y >= centerMin && y <= centerMax) {
          continue;
        }
        svgContent += `  <rect x="${x + marginCells}" y="${y + marginCells}" width="1" height="1" rx="0.25" fill="${fillAttr}" />\n`;
      }
    }

    if (designState.logoMode === 'center') {
      const cx = totalCells / 2;
      const cy = totalCells / 2;
      svgContent += `  <circle cx="${cx}" cy="${cy}" r="${(gridSize * 0.26) / 2}" fill="${designState.isTransparentBg ? '#ffffff' : designState.bgColor}" />\n`;
      svgContent += `  <circle cx="${cx}" cy="${cy}" r="${(gridSize * 0.22) / 2}" fill="${designState.fgColor1}" />\n`;
    }

    svgContent += `</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meamart-qr-${designLink.short_code}-vector.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10">
      {error && (
        <div className="rounded-full border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-600 dark:text-red-400 text-center">
          {error}
        </div>
      )}

      {/* QR Scanner & Archive Inspection Card */}
      <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 dark:bg-primary/10">
        <h3 className="text-base font-extrabold text-zinc-900 dark:text-white mb-2">
          🔍 {t('inspect.title')}
        </h3>
        <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-4">
          {t('inspect.desc')}
        </p>

        <form onSubmit={handleInspect} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inspectQuery}
            onChange={e => setInspectQuery(e.target.value)}
            placeholder={t('inspect.placeholder')}
            className="flex-1 rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-900"
          />
          <button
            type="button"
            onClick={() => setShowCameraModal(true)}
            className="rounded-full border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 px-5 py-3 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Camera className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            <span>{t('inspect.camera')}</span>
          </button>
          <button
            type="submit"
            disabled={inspecting}
            className="rounded-full bg-zinc-900 px-6 py-3 text-xs font-extrabold text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 disabled:opacity-50"
          >
            {inspecting ? (isAr ? 'جاري الفحص...' : 'Inspecting...') : t('inspect.button')}
          </button>
        </form>

        {/* Live Camera Scanner Modal */}
        {showCameraModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                  <h4 className="text-base font-extrabold text-zinc-900 dark:text-white">
                    {t('inspect.camera.title')}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCameraModal(false)}
                  className="rounded-xl bg-zinc-100 dark:bg-zinc-800 px-3.5 py-1.5 text-xs font-bold hover:opacity-80"
                >
                  إغلاق
                </button>
              </div>

              <p className="text-xs font-bold text-zinc-500 mb-4 text-center">
                وجّه كاميرا الهاتف أو الكمبيوتر نحو رمز الباركود، أو اختر صورة الباركود من جهازك للفحص الفوري
              </p>

              <div id="qr-camera-reader" className="w-full overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-800 bg-black/5 p-2"></div>
            </div>
          </div>
        )}

        {inspectError && (
          <p className="text-xs font-bold text-red-500 mt-3">{inspectError}</p>
        )}

        {inspectedResult && (
          <div className="mt-4 rounded-full bg-white p-4 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            {!inspectedResult.exists ? (
              <p className="text-xs font-bold text-zinc-500">{inspectedResult.message}</p>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-extrabold text-zinc-900 dark:text-white">
                    الباركود: {inspectedResult.link.title} ({inspectedResult.link.short_code})
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    inspectedResult.link.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                  }`}>
                    {inspectedResult.link.is_active ? 'نشط ويعمل حالياً' : 'مؤرشف / غير نشط'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-300">
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-2.5">
                    <span>عدد المسحات:</span>
                    <strong className="block text-primary text-sm mt-0.5">{inspectedResult.link.clicks_count}</strong>
                  </div>
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-2.5">
                    <span>محادثات واتساب:</span>
                    <strong className="block text-emerald-600 text-sm mt-0.5">{inspectedResult.link.whatsapp_conversations_count}</strong>
                  </div>
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-2.5">
                    <span>أبرز الأجهزة:</span>
                    <strong className="block text-zinc-900 dark:text-white mt-0.5">{inspectedResult.link.last_scanned_device}</strong>
                  </div>
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-2.5">
                    <span>آخر مدينة مسح:</span>
                    <strong className="block text-zinc-900 dark:text-white mt-0.5">{inspectedResult.link.last_scanned_city}</strong>
                  </div>
                </div>

                {!inspectedResult.link.is_active && inspectedResult.is_owner && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleReactivateLink(inspectedResult.link.short_code)}
                      className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark"
                    >
                      ✓ تفعيل واستعادة الباركود الآن
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Section */}
      <div className="rounded-3xl border border-zinc-200/60 bg-white/70 p-6 shadow-xl backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            {t('create.header')}
          </h3>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-zinc-100/90 p-1 shadow-inner dark:border-zinc-700/60 dark:bg-zinc-800/80">
            <button
              type="button"
              onClick={() => setCreateMode('custom')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                createMode === 'custom'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full transition-all ${
                  createMode === 'custom' ? 'bg-white shadow-xs' : 'bg-zinc-400'
                }`}
              />
              <span>{t('create.tab.custom')}</span>
            </button>
            <button
              type="button"
              onClick={() => setCreateMode('bio')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                createMode === 'bio'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full transition-all ${
                  createMode === 'bio' ? 'bg-white shadow-xs' : 'bg-zinc-400'
                }`}
              />
              <span>{t('create.tab.bio')}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">
              {t('create.title')}
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={createMode === 'bio' ? t('create.title.placeholder.bio') : t('create.title.placeholder.custom')}
              className="w-full rounded-full border border-zinc-200 bg-white/80 px-4 py-3 text-sm font-medium text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
            />
          </div>

          {createMode === 'custom' ? (
            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">
                {t('create.targetUrl')}
              </label>
              <input
                type="url"
                value={targetUrl}
                onChange={e => setTargetUrl(e.target.value)}
                placeholder="https://example.com/..."
                required
                className="w-full rounded-full border border-zinc-200 bg-white/80 px-4 py-3 text-sm font-medium text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">
                {t('create.shortcode')}
              </label>
              <input
                type="text"
                value={shortCode}
                onChange={e => setShortCode(e.target.value)}
                placeholder={t('create.shortcode.placeholder')}
                className="w-full rounded-full border border-zinc-200 bg-white/80 px-4 py-3 text-sm font-medium text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
              />
            </div>
          )}

          {createMode === 'bio' && (
            <div className="md:col-span-2 space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">
                  {t('create.bio.description.label')}
                </label>
                <input
                  type="text"
                  value={bioDescription}
                  onChange={e => setBioDescription(e.target.value)}
                  className="w-full rounded-full border border-zinc-200 bg-white/80 px-4 py-3 text-sm font-medium text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                />
              </div>

              <div className="space-y-6 pt-2">
                {/* Visual Design & Theme Controls */}
                <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <h4 className="text-xs font-black text-zinc-900 dark:text-white flex items-center gap-2">
                    <span>{t('create.bio.design.title')}</span>
                  </h4>

                  <div className="flex items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setBioBgType('color')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${bioBgType === 'color' ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm' : 'text-zinc-500'}`}
                    >
                      {t('create.bio.bg.color')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBioBgType('pattern')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${bioBgType === 'pattern' ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm' : 'text-zinc-500'}`}
                    >
                      {t('create.bio.bg.pattern')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBioBgType('image')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${bioBgType === 'image' ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm' : 'text-zinc-500'}`}
                    >
                      {t('create.bio.bg.image')}
                    </button>
                  </div>

                  {bioBgType === 'pattern' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-full bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">
                          {t('create.bio.pattern.type')}
                        </label>
                        <select
                          value={bioPatternType}
                          onChange={e => setBioPatternType(e.target.value as any)}
                          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs font-bold"
                        >
                          <option value="whatsapp">{t('create.bio.pattern.whatsapp')}</option>
                          <option value="dots">{t('create.bio.pattern.dots')}</option>
                          <option value="grid">{t('create.bio.pattern.grid')}</option>
                          <option value="waves">{t('create.bio.pattern.waves')}</option>
                          <option value="stars">{t('create.bio.pattern.stars')}</option>
                          <option value="diagonal">{t('create.bio.pattern.diagonal')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">
                          {t('create.bio.pattern.color')}
                        </label>
                        <div className="flex items-center gap-2">
                          {[
                            { nameAr: 'أبيض', nameEn: 'White', hex: '#ffffff' },
                            { nameAr: 'ذهبي', nameEn: 'Gold', hex: '#fbbf24' },
                            { nameAr: 'أخضر زمردي', nameEn: 'Emerald Green', hex: '#10b981' },
                            { nameAr: 'أسود داكن', nameEn: 'Dark Black', hex: '#000000' },
                          ].map(c => (
                            <button
                              key={c.hex}
                              type="button"
                              onClick={() => setBioPatternColor(c.hex)}
                              title={isAr ? c.nameAr : c.nameEn}
                              style={{ backgroundColor: c.hex }}
                              className={`h-6 w-6 rounded-full border-2 transition ${
                                bioPatternColor === c.hex ? 'border-primary scale-110 shadow-sm' : 'border-zinc-400/40'
                              }`}
                            />
                          ))}
                          <input
                            type="color"
                            value={bioPatternColor}
                            onChange={e => setBioPatternColor(e.target.value)}
                            className="h-6 w-6 rounded-full border border-zinc-300 cursor-pointer bg-transparent"
                            title={isAr ? 'لون مخصص للنقشة' : 'Custom pattern color'}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {bioBgType === 'image' && (
                    <div className="p-3.5 rounded-full bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">
                        {t('create.bio.bg.imageUrl')}
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={bioBgImageUrl}
                        onChange={e => setBioBgImageUrl(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Background Color Palette */}
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">
                        {t('create.bio.bg.pageColor')}
                      </label>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          { nameAr: 'أسود فاخر', nameEn: 'Luxury Black', hex: '#09090b' },
                          { nameAr: 'أزرق ليلي', nameEn: 'Night Blue', hex: '#0f172a' },
                          { nameAr: 'زمردي ملكي', nameEn: 'Royal Emerald', hex: '#064e3b' },
                          { nameAr: 'بنفسجي مخملي', nameEn: 'Velvet Purple', hex: '#2e1065' },
                          { nameAr: 'عنابي فاخر', nameEn: 'Luxury Wine', hex: '#4c0519' },
                        ].map(theme => (
                          <button
                            key={theme.hex}
                            type="button"
                            onClick={() => setBioThemeBg(theme.hex)}
                            title={isAr ? theme.nameAr : theme.nameEn}
                            style={{ backgroundColor: theme.hex }}
                            className={`h-7 w-7 rounded-full border-2 transition ${
                              bioThemeBg === theme.hex ? 'border-primary scale-110 shadow-md' : 'border-white/30'
                            }`}
                          />
                        ))}
                        <input
                          type="color"
                          value={bioThemeBg}
                          onChange={e => setBioThemeBg(e.target.value)}
                          className="h-7 w-7 rounded-full border border-zinc-300 cursor-pointer bg-transparent"
                          title={isAr ? 'اختر لون خلفية مخصص' : 'Choose custom background color'}
                        />
                      </div>
                    </div>

                    {/* Title Color Picker */}
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">
                        {t('create.bio.titleColor')}
                      </label>
                      <div className="flex items-center gap-2">
                        {[
                          { nameAr: 'أبيض', nameEn: 'White', hex: '#ffffff' },
                          { nameAr: 'ذهبي فاخر', nameEn: 'Luxury Gold', hex: '#fbbf24' },
                          { nameAr: 'أزرق سماوي', nameEn: 'Sky Blue', hex: '#38bdf8' },
                          { nameAr: 'زمردي', nameEn: 'Emerald', hex: '#34d399' },
                          { nameAr: 'وردي', nameEn: 'Pink', hex: '#f472b6' },
                        ].map(c => (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => setBioTitleColor(c.hex)}
                            title={isAr ? c.nameAr : c.nameEn}
                            style={{ backgroundColor: c.hex }}
                            className={`h-6 w-6 rounded-full border-2 transition ${
                              bioTitleColor === c.hex ? 'border-primary scale-110 shadow-sm' : 'border-zinc-400/40'
                            }`}
                          />
                        ))}
                        <input
                          type="color"
                          value={bioTitleColor}
                          onChange={e => setBioTitleColor(e.target.value)}
                          className="h-6 w-6 rounded-full border border-zinc-300 cursor-pointer bg-transparent"
                          title={isAr ? 'اختر لون عنوان مخصص' : 'Choose custom title color'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">
                        {t('create.bio.textColor')}
                      </label>
                      <div className="flex items-center gap-2">
                        {[
                          { nameAr: 'رمادي فاتح', nameEn: 'Light Gray', hex: '#e4e4e7' },
                          { nameAr: 'أبيض ناصع', nameEn: 'Bright White', hex: '#ffffff' },
                          { nameAr: 'ذهبي', nameEn: 'Gold', hex: '#fef08a' },
                          { nameAr: 'سماوي', nameEn: 'Sky Blue', hex: '#bae6fd' },
                          { nameAr: 'داكن', nameEn: 'Dark', hex: '#18181b' },
                        ].map(c => (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => setBioTextColor(c.hex)}
                            title={isAr ? c.nameAr : c.nameEn}
                            style={{ backgroundColor: c.hex }}
                            className={`h-6 w-6 rounded-full border-2 transition ${
                              bioTextColor === c.hex ? 'border-primary scale-110 shadow-sm' : 'border-zinc-400/40'
                            }`}
                          />
                        ))}
                        <input
                          type="color"
                          value={bioTextColor}
                          onChange={e => setBioTextColor(e.target.value)}
                          className="h-6 w-6 rounded-full border border-zinc-300 cursor-pointer bg-transparent"
                          title={isAr ? 'اختر لون نص مخصص' : 'Choose custom text color'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">
                        {t('create.bio.sectionTitleColor')}
                      </label>
                      <div className="flex items-center gap-2">
                        {[
                          { nameAr: 'ذهبي', nameEn: 'Gold', hex: '#fbbf24' },
                          { nameAr: 'أبيض', nameEn: 'White', hex: '#ffffff' },
                          { nameAr: 'أخضر', nameEn: 'Green', hex: '#34d399' },
                          { nameAr: 'أزرق', nameEn: 'Blue', hex: '#38bdf8' },
                          { nameAr: 'وردي', nameEn: 'Pink', hex: '#f472b6' },
                        ].map(c => (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => setBioSectionTitleColor(c.hex)}
                            title={isAr ? c.nameAr : c.nameEn}
                            style={{ backgroundColor: c.hex }}
                            className={`h-6 w-6 rounded-full border-2 transition ${
                              bioSectionTitleColor === c.hex ? 'border-primary scale-110 shadow-sm' : 'border-zinc-400/40'
                            }`}
                          />
                        ))}
                        <input
                          type="color"
                          value={bioSectionTitleColor}
                          onChange={e => setBioSectionTitleColor(e.target.value)}
                          className="h-6 w-6 rounded-full border border-zinc-300 cursor-pointer bg-transparent"
                          title={isAr ? 'اختر لون عناوين الأقسام' : 'Choose custom section title color'}
                        />
                      </div>
                    </div>

                    {/* Font Family & Size */}
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">
                        {t('create.bio.font.label')}
                      </label>
                      <div className="flex items-center gap-1.5">
                        <select
                          value={bioFontFamily}
                          onChange={e => setBioFontFamily(e.target.value)}
                          className="flex-1 rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-bold dark:border-zinc-800 dark:bg-zinc-950"
                        >
                          <option value="Tajawal">Tajawal / تجاول</option>
                          <option value="Cairo">Cairo / كايرو</option>
                          <option value="Alexandria">Alexandria / إسكندرية</option>
                          <option value="Almarai">Almarai / المراعي</option>
                          <option value="Rubik">Rubik / روبيك</option>
                          <option value="Changa">Changa / تشانجا</option>
                          <option value="El Messiri">El Messiri / المسيري</option>
                          <option value="Amiri">Amiri / أميري</option>
                          <option value="IBM Plex Sans Arabic">IBM Plex / تقني</option>
                          <option value="Readex Pro">Readex Pro / ريدكس برو</option>
                        </select>
                        <select
                          value={bioFontSize}
                          onChange={e => setBioFontSize(e.target.value as any)}
                          className="w-20 rounded-xl border border-zinc-200 bg-white px-2 py-1.5 text-xs font-bold dark:border-zinc-800 dark:bg-zinc-950"
                        >
                          <option value="sm">{t('create.bio.fontSize.sm')}</option>
                          <option value="md">{t('create.bio.fontSize.md')}</option>
                          <option value="lg">{t('create.bio.fontSize.lg')}</option>
                        </select>
                      </div>
                    </div>

                    {/* Social Icons Layout Style */}
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">
                        {t('create.bio.social.label')}
                      </label>
                      <div className="flex rounded-xl border border-zinc-200 dark:border-zinc-800 p-1 bg-white dark:bg-zinc-950">
                        <button
                          type="button"
                          onClick={() => setBioSocialStyle('circles')}
                          className={`flex-1 rounded-lg py-1 text-[11px] font-bold transition ${
                            bioSocialStyle === 'circles' ? 'bg-primary text-white shadow-xs' : 'text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {t('create.bio.social.circles')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setBioSocialStyle('squares')}
                          className={`flex-1 rounded-lg py-1 text-[11px] font-bold transition ${
                            bioSocialStyle === 'squares' ? 'bg-primary text-white shadow-xs' : 'text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {t('create.bio.social.squares')}
                        </button>
                      </div>
                    </div>

                    {/* Cards Shape / Corner System & Alignment */}
                    <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">
                          {t('create.bio.cardShapes.label')}
                        </label>
                        <div className="grid grid-cols-5 gap-1 rounded-xl border border-zinc-200 dark:border-zinc-800 p-1 bg-white dark:bg-zinc-950">
                          {[
                            { id: 'rounded-full', labelKey: 'create.bio.cardShapes.smooth' },
                            { id: 'rounded-3xl', labelKey: 'create.bio.cardShapes.round' },
                            { id: 'rounded-none', labelKey: 'create.bio.cardShapes.sharp' },
                            { id: 'glass', labelKey: 'create.bio.cardShapes.glass' },
                            { id: 'flat', labelKey: 'create.bio.cardShapes.none' }
                          ].map((shape) => (
                            <button
                              key={shape.id}
                              type="button"
                              onClick={() => setBioCardStyle(shape.id as any)}
                              className={`rounded-lg py-1 text-[10px] font-bold transition text-center ${
                                bioCardStyle === shape.id ? 'bg-primary text-white shadow-xs' : 'text-zinc-600 dark:text-zinc-400'
                              }`}
                            >
                              {t(shape.labelKey)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">
                          {t('create.bio.align.label')}
                        </label>
                        <div className="flex rounded-xl border border-zinc-200 dark:border-zinc-800 p-1 bg-white dark:bg-zinc-950">
                          <button
                            type="button"
                            onClick={() => setBioAlign('center')}
                            className={`flex-1 rounded-lg py-1 text-[11px] font-bold transition ${
                              bioAlign === 'center' ? 'bg-primary text-white shadow-xs' : 'text-zinc-600 dark:text-zinc-400'
                            }`}
                          >
                            {t('create.bio.align.center')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setBioAlign('right')}
                            className={`flex-1 rounded-lg py-1 text-[11px] font-bold transition ${
                              bioAlign === 'right' ? 'bg-primary text-white shadow-xs' : 'text-zinc-600 dark:text-zinc-400'
                            }`}
                          >
                            {t('create.bio.align.right')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Tab Toggle Bar */}
                <div className="flex lg:hidden items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-full mb-4">
                  <button
                    type="button"
                    onClick={() => setActiveTabMobile('editor')}
                    className={`flex-1 py-2 text-xs font-black rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                      activeTabMobile === 'editor'
                        ? 'bg-white dark:bg-zinc-800 text-primary shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                    <span>✍️</span>
                    <span>{lang === 'ar' ? 'تعديل المحتوى' : 'Edit Content'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTabMobile('preview')}
                    className={`flex-1 py-2 text-xs font-black rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                      activeTabMobile === 'preview'
                        ? 'bg-white dark:bg-zinc-800 text-primary shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                    <span>📱</span>
                    <span>{lang === 'ar' ? 'المعاينة الحية' : 'Live Preview'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Links & Sections Editor */}
                  <div className={`lg:col-span-7 space-y-4 ${activeTabMobile === 'editor' ? 'block' : 'hidden lg:block'}`}>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300">
                        {t('create.bio.links.label')}
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setBioLinks(prev => [...prev, { label: t('create.bio.link.defaultSection'), url: '', isSection: true }])}
                          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                        >
                          {t('create.bio.add.section')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setBioLinks(prev => [...prev, { label: t('create.bio.link.defaultMenu'), price: t('create.bio.link.price'), icon: '☕', lineStyle: 'dotted', isMenu: true, type: 'menu' }])}
                          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          {t('create.bio.add.menu')}
                        </button>
                        <button
                          type="button"
                          onClick={addBioLink}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          {t('create.bio.add.custom')}
                        </button>
                      </div>
                    </div>

                    {/* Comprehensive Social Quick-Add Strip */}
                    <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
                      <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 w-full mb-1">{t('create.bio.social.quickadd')}</span>
                      {[
                        { labelKey: 'platform.whatsapp', url: 'https://wa.me/', icon: '💬' },
                        { labelKey: 'platform.instagram', url: 'https://instagram.com/', icon: '📸' },
                        { labelKey: 'platform.snapchat', url: 'https://snapchat.com/add/', icon: '👻' },
                        { labelKey: 'platform.tiktok', url: 'https://tiktok.com/@', icon: '🎵' },
                        { labelKey: 'platform.twitter', url: 'https://x.com/', icon: '𝕏' },
                        { labelKey: 'platform.telegram', url: 'https://t.me/', icon: '✈️' },
                        { labelKey: 'platform.facebook', url: 'https://facebook.com/', icon: '📘' },
                        { labelKey: 'platform.youtube', url: 'https://youtube.com/', icon: '▶️' },
                        { labelKey: 'platform.linkedin', url: 'https://linkedin.com/in/', icon: '💼' },
                        { labelKey: 'platform.maps', url: 'https://maps.google.com/', icon: '📍' },
                        { labelKey: 'platform.twitch', url: 'https://twitch.tv/', icon: '🎮' },
                        { labelKey: 'platform.switch', url: 'https://switch/', icon: '🕹️' },
                        { labelKey: 'platform.discord', url: 'https://discord.gg/', icon: '💬' },
                        { labelKey: 'platform.email', url: 'mailto:', icon: '✉️' },
                        { labelKey: 'platform.website', url: 'https://', icon: '🌐' },
                        { labelKey: 'platform.call', url: 'tel:', icon: '📞' },
                      ].map((platform, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setBioLinks(prev => [...prev, { label: t(platform.labelKey), url: platform.url }])}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-primary hover:text-primary transition shadow-2xs"
                        >
                          <span>{platform.icon}</span>
                          <span>{t(platform.labelKey)}</span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      {bioLinks.map((item, idx) => {
                        if (item.isSection) {
                          return (
                            <div key={idx} className="flex items-center gap-2 bg-amber-500/10 dark:bg-amber-500/5 p-2 rounded-full border border-amber-500/30">
                              <span className="text-xs font-black text-amber-600 dark:text-amber-400 px-1">── عنوان قسم</span>
                              <input
                                type="text"
                                placeholder="اسم القسم (مثال: روابط متجرنا)"
                                value={item.label || item.title || ''}
                                onChange={e => {
                                  const val = e.target.value;
                                  setBioLinks(prev => {
                                    const up = [...prev];
                                    up[idx] = { ...up[idx], label: val, title: val };
                                    return up;
                                  });
                                }}
                                className="flex-1 rounded-xl border border-amber-500/30 bg-white px-3 py-1.5 text-xs font-extrabold dark:bg-zinc-950 dark:text-zinc-100"
                              />
                              <button
                                type="button"
                                onClick={() => removeBioLink(idx)}
                                className="rounded-xl bg-red-500/10 px-2.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500/20 transition"
                              >
                                ×
                              </button>
                            </div>
                          );
                        }
                        if (item.isMenu || item.type === 'menu') {
                          return (
                            <div key={idx} className="flex flex-wrap items-center gap-2 bg-emerald-500/10 dark:bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/30">
                              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 px-1">🍽️ صنف منيو</span>
                              <input
                                type="text"
                                placeholder="اسم الصنف (مثال: قهوة لاتيه)"
                                value={item.label || ''}
                                onChange={e => updateBioLink(idx, 'label', e.target.value)}
                                className="w-1/3 rounded-full border border-emerald-500/30 bg-white px-3 py-1.5 text-xs font-bold dark:bg-zinc-950 dark:text-zinc-100"
                              />
                              <input
                                type="text"
                                placeholder="السعر (مثال: 18 ر.س)"
                                value={item.price || ''}
                                onChange={e => {
                                  const val = e.target.value;
                                  setBioLinks(prev => {
                                    const up = [...prev];
                                    up[idx] = { ...up[idx], price: val };
                                    return up;
                                  });
                                }}
                                className="w-24 rounded-full border border-emerald-500/30 bg-white px-2.5 py-1.5 text-xs font-black dark:bg-zinc-950 dark:text-zinc-100"
                              />
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  placeholder={lang === 'ar' ? "أيقونة أو رابط صورة" : "Icon / Image URL"}
                                  value={item.icon || ''}
                                  onChange={e => {
                                    const val = e.target.value;
                                    setBioLinks(prev => {
                                      const up = [...prev];
                                      up[idx] = { ...up[idx], icon: val };
                                      return up;
                                    });
                                  }}
                                  className="w-24 rounded-full border border-emerald-500/30 bg-white px-2.5 py-1.5 text-xs font-medium dark:bg-zinc-950 dark:text-zinc-100"
                                />
                                <label className="cursor-pointer bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-full border border-emerald-500/20 transition text-xs flex items-center justify-center shrink-0" title={lang === 'ar' ? 'رفع صورة أيقونة مخصصة' : 'Upload custom image icon'}>
                                  <span>🖼️</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleIconImageUpload(file, (url) => {
                                          setBioLinks(prev => {
                                            const up = [...prev];
                                            up[idx] = { ...up[idx], icon: url };
                                            return up;
                                          });
                                        });
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                              <select
                                value={item.lineStyle || 'dotted'}
                                onChange={e => {
                                  const val = e.target.value;
                                  setBioLinks(prev => {
                                    const up = [...prev];
                                    up[idx] = { ...up[idx], lineStyle: val };
                                    return up;
                                  });
                                }}
                                className="rounded-full border border-emerald-500/30 bg-white px-2 py-1.5 text-xs font-bold dark:bg-zinc-950 dark:text-zinc-100"
                              >
                                <option value="dotted">{t('menu.lineStyle.dotted')}</option>
                                <option value="dashed">{t('menu.lineStyle.dashed')}</option>
                                <option value="solid">{t('menu.lineStyle.solid')}</option>
                                <option value="none">{t('menu.lineStyle.none')}</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => removeBioLink(idx)}
                                className="rounded-xl bg-red-500/10 px-2.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500/20 transition"
                              >
                                ×
                              </button>
                            </div>
                          );
                        }
                        const soc = detectSocialIcon(item.url, item.label);
                        const hasIcon = Boolean(item.icon);
                        const isImg = hasIcon && (item.icon.startsWith('http') || item.icon.startsWith('/') || item.icon.startsWith('data:'));
                        return (
                          <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-base" title={soc.name}>
                              {hasIcon ? (
                                isImg ? (
                                  <img src={item.icon} alt="" className="w-6 h-6 rounded-md object-cover" />
                                ) : (
                                  <span>{item.icon}</span>
                                )
                              ) : (
                                soc.icon
                              )}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <input
                                type="text"
                                placeholder={lang === 'ar' ? "أيقونة" : "Icon"}
                                value={item.icon || ''}
                                onChange={e => {
                                  const val = e.target.value;
                                  setBioLinks(prev => {
                                    const up = [...prev];
                                    up[idx] = { ...up[idx], icon: val };
                                    return up;
                                  });
                                }}
                                className="w-14 rounded-full border border-zinc-200 bg-white px-1.5 py-1.5 text-xs font-bold dark:border-zinc-800 dark:bg-zinc-950 text-center"
                              />
                              <label className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary p-1.5 rounded-full border border-primary/20 transition text-xs flex items-center justify-center shrink-0" title={lang === 'ar' ? 'رفع صورة أيقونة' : 'Upload image icon'}>
                                <span>🖼️</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleIconImageUpload(file, (url) => {
                                        setBioLinks(prev => {
                                          const up = [...prev];
                                          up[idx] = { ...up[idx], icon: url };
                                          return up;
                                        });
                                      });
                                    }
                                  }}
                                />
                              </label>
                            </div>
                            <input
                              type="text"
                              placeholder="نص الزر"
                              value={item.label}
                              onChange={e => updateBioLink(idx, 'label', e.target.value)}
                              className="w-1/4 rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-medium dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                            />
                            <input
                              type="url"
                              placeholder="الرابط (https://... أو tel:)"
                              value={item.url}
                              onChange={e => updateBioLink(idx, 'url', e.target.value)}
                              className="flex-1 rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-medium dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeBioLink(idx)}
                              className="rounded-full bg-red-500/10 px-2.5 py-2 text-xs font-bold text-red-500 hover:bg-red-500/20 transition"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live Smartphone Screen Preview & Direct URL */}
                  <div className={`lg:col-span-5 flex flex-col items-center justify-center p-5 rounded-3xl bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-4 ${activeTabMobile === 'preview' ? 'block' : 'hidden lg:block'}`}>
                    <div className="text-xs font-extrabold text-zinc-700 dark:text-zinc-200 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{t('mockup.livePreview')}</span>
                    </div>

                    {/* Smartphone Mockup */}
                    <link
                      href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;700&family=Almarai:wght@400;700;800&family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;900&family=Changa:wght@400;700&family=El+Messiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;600;700&family=Lalezar&family=Readex+Pro:wght@400;700&family=Rubik:wght@400;700&family=Tajawal:wght@400;500;700;800&display=swap"
                      rel="stylesheet"
                    />
                    <style>{`
                      .live-preview-mockup, .live-preview-mockup * {
                        font-family: '${bioFontFamily}', 'Tajawal', sans-serif !important;
                      }
                    `}</style>
                    <div
                      style={{ backgroundColor: bioThemeBg, color: bioTextColor }}
                      className="live-preview-mockup w-72 rounded-[2.5rem] border-4 border-zinc-800 dark:border-zinc-700 p-4 shadow-2xl overflow-hidden flex flex-col items-center text-center space-y-3 relative min-h-[440px] mx-auto"
                    >
                      {/* Background Image Preview */}
                      {bioBgType === 'image' && bioBgImageUrl && (
                        <div
                          className="absolute inset-0 bg-cover bg-center pointer-events-none z-0 opacity-40"
                          style={{ backgroundImage: `url('${bioBgImageUrl}')` }}
                        />
                      )}

                      {/* Pattern Background Preview */}
                      {bioBgType === 'pattern' && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-25">
                          <defs>
                            {bioPatternType === 'whatsapp' && (
                              <pattern id="bio-preview-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
                                <g fill="none" stroke={bioPatternColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
                                  <path d="M22 18a8 8 0 1 0-3.5 6.6L16 26l1.8-3.3A8 8 0 0 0 22 18Z" transform="translate(8,8) scale(0.7)" />
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" transform="translate(68,12) scale(0.55)" />
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" transform="translate(15,70) scale(0.55)" />
                                  <path d="M18 6 7 17l-5-5 M22 10l-7.5 7.5L13 16" transform="translate(75,72) scale(0.6)" />
                                  <path d="M18 8h2a4 4 0 0 1 0 8h-2 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" transform="translate(15,20) scale(0.4)" />
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" transform="translate(70,42) scale(0.45)" />
                                </g>
                              </pattern>
                            )}
                            {bioPatternType === 'dots' && (
                              <pattern id="bio-preview-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
                                <circle cx="12" cy="12" r="1.5" fill={bioPatternColor} />
                              </pattern>
                            )}
                            {bioPatternType === 'grid' && (
                              <pattern id="bio-preview-pattern" width="36" height="36" patternUnits="userSpaceOnUse">
                                <path d="M 36 0 L 0 0 0 36" fill="none" stroke={bioPatternColor} strokeWidth="0.8" />
                              </pattern>
                            )}
                            {bioPatternType === 'waves' && (
                              <pattern id="bio-preview-pattern" width="60" height="30" patternUnits="userSpaceOnUse">
                                <path d="M 0 15 Q 15 3 30 15 T 60 15" fill="none" stroke={bioPatternColor} strokeWidth="1.2" />
                              </pattern>
                            )}
                            {bioPatternType === 'stars' && (
                              <pattern id="bio-preview-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M20 2 L23 12 L33 12 L25 18 L28 28 L20 22 L12 28 L15 18 L7 12 L17 12 Z" fill="none" stroke={bioPatternColor} strokeWidth="0.8" transform="scale(0.4)" />
                              </pattern>
                            )}
                            {bioPatternType === 'diagonal' && (
                              <pattern id="bio-preview-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M0 20 L20 0 M-5 5 L5 -5 M15 25 L25 15" fill="none" stroke={bioPatternColor} strokeWidth="0.8" />
                              </pattern>
                            )}
                          </defs>
                          <rect width="100%" height="100%" fill="url(#bio-preview-pattern)" />
                        </svg>
                      )}

                      {/* Sticky Header Simulation */}
                      <div className="w-full flex items-center justify-between pb-2 border-b text-[10px] font-black opacity-90 relative z-10" style={{ color: bioTextColor, borderColor: `${bioTextColor}20` }}>
                        <span className="truncate">{title || t('mockup.bioLink')}</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10">{t('mockup.share')}</span>
                      </div>

                      {/* Avatar & Hero */}
                      <div className="flex flex-col items-center space-y-1.5 pt-1">
                        <div className="h-14 w-14 rounded-full border-2 border-white/40 p-0.5 bg-black/40 overflow-hidden shadow-lg flex items-center justify-center text-xl">
                          🏪
                        </div>
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs font-extrabold" style={{ color: bioTitleColor }}>{title || t('field.accountName')}</h4>
                          <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-500 text-[9px] text-white">✓</span>
                        </div>
                        <p 
                          className={`max-w-[210px] leading-relaxed ${
                            bioFontSize === 'lg' ? 'text-xs' : bioFontSize === 'sm' ? 'text-[10px]' : 'text-[11px]'
                          }`}
                          style={{ color: bioTextColor, opacity: 0.85 }}
                        >
                          {bioDescription || (isAr ? 'نبذة تعريفية سريعة' : 'Short bio/description')}
                        </p>
                      </div>

                      {/* Social Media Section Simulation */}
                      {(() => {
                        const previewSocials = bioLinks.filter(l => !l.isSection && isSocialPlatformUrl(l.url));
                        if (previewSocials.length === 0) return null;
                        return bioSocialStyle === 'squares' ? (
                          <div className="grid grid-cols-2 gap-1.5 w-full pt-1">
                            {previewSocials.slice(0, 4).map((item, i) => {
                              const soc = detectSocialIcon(item.url, item.label);
                              return (
                                <div
                                  key={i}
                                  className={`flex flex-col items-center justify-center p-2 border ${
                                    bioCardStyle === 'rounded-3xl' ? 'rounded-full' : bioCardStyle === 'rounded-lg' ? 'rounded-lg' : 'rounded-xl'
                                  } text-[10px] font-bold truncate`}
                                  style={{ 
                                    color: bioTextColor, 
                                    borderColor: `${bioTextColor}25`, 
                                    backgroundColor: `${bioTextColor}12`
                                  }}
                                >
                                  <span>{soc.icon}</span>
                                  <span className="truncate w-full mt-1" style={{ color: bioTextColor }}>{item.label || soc.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center justify-center gap-1.5 w-full pt-1">
                            {previewSocials.map((item, i) => {
                              const soc = detectSocialIcon(item.url, item.label);
                              return (
                                <span 
                                  key={i} 
                                  className="flex h-8 w-8 items-center justify-center rounded-full border shadow-xs" 
                                  style={{ 
                                    borderColor: `${bioTextColor}30`, 
                                    backgroundColor: `${bioTextColor}15`
                                  }}
                                  title={item.label || soc.name}
                                >
                                  {soc.icon}
                                </span>
                              );
                            })}
                          </div>
                        );
                      })()}

                      {/* Links Stack Simulation */}
                      <div className="w-full space-y-2 pt-1 flex-1 max-h-48 overflow-y-auto pr-1">
                        {bioLinks
                          .filter(item => item.isSection || item.isMenu || item.type === 'menu' || !isSocialPlatformUrl(item.url))
                          .map((item, i) => {
                            if (item.isSection) {
                              return (
                                <div key={i} className="py-1 text-center text-[10px] font-extrabold uppercase tracking-wider" style={{ color: bioSectionTitleColor }}>
                                  ── {item.label || item.title} ──
                                </div>
                              );
                            }

                            const hasIcon = Boolean(item.icon);
                            const isImg = hasIcon && (item.icon.startsWith('http') || item.icon.startsWith('/') || item.icon.startsWith('data:'));
                            const soc = detectSocialIcon(item.url, item.label);
                            const lineStyle = item.lineStyle || 'dotted';

                            // Determine classes based on bioCardStyle
                            const getCardRoundedClass = () => {
                              if (bioCardStyle === 'rounded-3xl') return 'rounded-3xl';
                              if (bioCardStyle === 'rounded-none') return 'rounded-none';
                              if (bioCardStyle === 'rounded-lg') return 'rounded-lg';
                              if (bioCardStyle === 'glass') return 'rounded-xl backdrop-blur-md';
                              return 'rounded-full';
                            };

                            const isFlat = bioCardStyle === 'flat';

                            if (item.isMenu || item.type === 'menu') {
                              return (
                                <div
                                  key={i}
                                  className={`flex items-center justify-between w-full border px-3 py-2 text-[11px] font-bold shadow-sm ${getCardRoundedClass()} ${bioAlign === 'right' ? 'flex-row-reverse' : ''}`}
                                  style={{ 
                                    color: bioTextColor, 
                                    borderColor: isFlat ? 'transparent' : `${bioTextColor}25`, 
                                    backgroundColor: isFlat ? 'transparent' : `${bioTextColor}12`,
                                    boxShadow: isFlat ? 'none' : undefined
                                  }}
                                >
                                  <div className={`flex items-center gap-1.5 max-w-[55%] truncate ${bioAlign === 'right' ? 'flex-row-reverse text-right' : ''}`}>
                                    {hasIcon && (
                                      isImg ? (
                                        <img src={item.icon} alt="" className="w-5 h-5 rounded-md object-cover shrink-0 shadow-xs" />
                                      ) : (
                                        <span className="text-sm shrink-0">{item.icon}</span>
                                      )
                                    )}
                                    <span className="truncate">{item.label || 'صنف'}</span>
                                  </div>
                                  {lineStyle !== 'none' && (
                                    <div
                                      className="flex-1 mx-1.5 self-end mb-1 opacity-40"
                                      style={{
                                        borderBottomStyle: lineStyle as any,
                                        borderBottomWidth: '1.5px',
                                        borderBottomColor: bioTextColor
                                      }}
                                    />
                                  )}
                                  <span 
                                    className="shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded bg-primary/20"
                                    style={{ color: bioTextColor }}
                                  >
                                    {item.price || '0 ر.س'}
                                  </span>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={i}
                                className={`flex items-center justify-between w-full border px-3 py-2 text-[11px] font-bold shadow-sm ${getCardRoundedClass()} ${bioAlign === 'right' ? 'flex-row-reverse' : ''}`}
                                style={{ 
                                  color: bioTextColor, 
                                  borderColor: isFlat ? 'transparent' : `${bioTextColor}25`, 
                                  backgroundColor: isFlat ? 'transparent' : `${bioTextColor}12`,
                                  boxShadow: isFlat ? 'none' : undefined
                                }}
                              >
                                <div className={`flex items-center gap-1.5 truncate ${bioAlign === 'right' ? 'flex-row-reverse text-right' : ''}`}>
                                  {hasIcon ? (
                                    isImg ? (
                                      <img src={item.icon} alt="" className="w-5 h-5 rounded-md object-cover shrink-0" />
                                    ) : (
                                      <span className="text-sm shrink-0">{item.icon}</span>
                                    )
                                  ) : (
                                    <span>{soc.icon}</span>
                                  )}
                                  <span className="truncate">{item.label || soc.name}</span>
                                </div>
                                <span className="text-[9px] opacity-60">←</span>
                              </div>
                            );
                          })}
                      </div>

                      {/* Standalone MeaMart Copyright Statement */}
                      <div className="w-full pt-3 border-t text-center" style={{ borderColor: `${bioTextColor}15` }}>
                        <span className="text-[10px] font-bold" style={{ color: bioTextColor, opacity: 0.6 }}>
                          {isAr ? 'تم الإنشاء عن طريق' : 'Created by'} <strong className="text-blue-500">MeaMart</strong>
                        </span>
                      </div>
                    </div>

                    {/* Live Direct URL Info Box */}
                    <div className="w-full p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
                      <div className="text-[11px] font-extrabold text-zinc-700 dark:text-zinc-300">
                        {t('preview.directUrl')}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          readOnly
                          value={`${typeof window !== 'undefined' ? window.location.origin : 'https://meamart.com'}/${lang}/bio/${shortCode || 'code'}`}
                          className="flex-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 text-xs font-mono text-zinc-600 dark:text-zinc-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const url = `${window.location.origin}/${lang}/bio/${shortCode || 'code'}`;
                            navigator.clipboard.writeText(url);
                            alert(isAr ? 'تم نسخ رابط الرابط الموحد بنجاح!' : 'Bio page link copied successfully!');
                          }}
                          className="rounded-xl bg-primary/10 text-primary px-2.5 py-1.5 text-xs font-bold hover:bg-primary/20 transition"
                        >
                          نسخ
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            try {
                              localStorage.setItem('meamart_bio_live_preview', JSON.stringify({
                                title: title || 'متجر ميمارت التجريبي',
                                qr_options: {
                                  bioDescription,
                                  themeBg: bioThemeBg,
                                  fontFamily: bioFontFamily,
                                  fontSize: bioFontSize,
                                  socialStyle: bioSocialStyle,
                                  cardStyle: bioCardStyle,
                                  alignment: bioAlign,
                                  titleColor: bioTitleColor,
                                  textColor: bioTextColor,
                                  sectionTitleColor: bioTitleColor,
                                  bgType: bioBgType,
                                  patternType: bioPatternType,
                                  patternColor: bioPatternColor,
                                  bgImageUrl: bioBgImageUrl,
                                  bioLinks
                                }
                              }));
                            } catch (e) {}
                            window.open(`/ar/bio/${shortCode || 'code'}`, '_blank');
                          }}
                          className="rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1.5 text-xs font-bold hover:bg-emerald-500/20 transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>معاينة</span>
                          <span>↗</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">
              {t('create.color')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={fgColor}
                onChange={e => setFgColor(e.target.value)}
                className="h-11 w-16 cursor-pointer bg-transparent"
              />
              <span className="text-xs font-bold text-zinc-500">{fgColor}</span>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end mt-2">
            <button
              type="submit"
              disabled={creating}
              className="rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark disabled:opacity-50"
            >
              {creating ? t('create.button.submitting') : t('create.button.submit')}
            </button>
          </div>
        </form>
      </div>

      {/* Links List Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            {t('card.type.custom', 'روابط الباركود النشطة')}
          </h3>

          <div className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === 'all'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {t('filter.all')} ({links.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('bio')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === 'bio'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {t('filter.bio')} ({links.filter(l => l.entity_type === 'bio').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('other')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === 'other'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {t('filter.barcode')} ({links.filter(l => l.entity_type !== 'bio').length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm font-bold text-zinc-400">{t('filter.loading')}</div>
        ) : links.length === 0 ? (
          <div className="rounded-3xl border border-zinc-200/50 bg-white/50 p-8 text-center dark:border-zinc-800/50 dark:bg-zinc-900/50">
            <p className="text-sm font-bold text-zinc-500">{t('filter.empty')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {links
              .filter(link => {
                if (filterType === 'bio') return link.entity_type === 'bio';
                if (filterType === 'other') return link.entity_type !== 'bio';
                return true;
              })
              .map(link => {
              const fullShortUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://meamart.com'}/q/${link.short_code}`;
              const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(fullShortUrl)}&color=${(link.qr_options?.fgColor || '#6c47ff').replace('#', '')}`;

              const isAutoSystemItem = link.entity_type === 'seller' || link.entity_type === 'ad';

              return (
                <div
                  key={link.id}
                  className="rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:border-primary/40"
                >
                  <div className="flex items-center gap-4 flex-1 overflow-hidden">
                    <div className="h-16 w-16 rounded-xl border border-zinc-200 p-1 bg-white shrink-0 shadow-sm">
                      <img src={qrImageUrl} alt="QR Code" className="h-full w-full object-contain" />
                    </div>
                    
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          link.entity_type === 'seller'
                            ? 'bg-primary/10 text-primary'
                            : link.entity_type === 'ad'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : link.entity_type === 'bio'
                            ? 'bg-purple-500/10 text-purple-600'
                            : 'bg-blue-500/10 text-blue-600'
                        }`}>
                          {link.entity_type === 'seller'
                            ? t('card.storeQr')
                            : link.entity_type === 'ad'
                            ? t('card.adQr')
                            : link.entity_type === 'bio'
                            ? t('card.bioQr')
                            : t('card.customQr')}
                        </span>
                        {isAutoSystemItem && (
                          <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                            {t('card.autoLocked', 'تلقائي')}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                        {link.title}
                      </h4>

                      <p className="text-[11px] text-zinc-500 truncate" dir="ltr">
                        {fullShortUrl}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:gap-6 shrink-0 bg-zinc-50 dark:bg-zinc-800/50 p-2 md:bg-transparent md:dark:bg-transparent md:p-0 rounded-xl">
                    <div className="text-center">
                      <span className="text-[10px] text-zinc-400 block">{t('scans.count')}</span>
                      <span className="text-primary text-xs font-black">{link.clicks_count || 0}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-zinc-400 block">{t('whatsapp.chats')}</span>
                      <span className="text-emerald-600 text-xs font-black">{link.whatsapp_conversations_count || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 border-t border-zinc-100 dark:border-zinc-800 md:border-t-0 pt-3 md:pt-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(link.short_code, link.id)}
                      className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-2.5 py-1.5 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                      {copiedId === link.id ? t('action.copied') : t('action.copy')}
                    </button>

                    <button
                      type="button"
                      onClick={() => openDesignStudio(link)}
                      className="rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-dark shadow-sm"
                    >
                      {t('action.design')}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(link)}
                      className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-primary/5"
                    >
                      {t('action.edit')}
                    </button>
                    {!isAutoSystemItem && (
                      <button
                        type="button"
                        onClick={() => handleDelete(link.id)}
                        className="rounded-xl bg-red-500/10 px-2.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500/20"
                      >
                        {t('action.delete')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Design & Export Studio Modal */}
      {designLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-7xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                  استوديو تصميم وطباعة الباركود: {designLink.title}
                </h3>
                <p className="text-xs font-bold text-zinc-500 mt-0.5">
                  خصص الألوان والشعار والخلفية وحمل الباركود بجودة احترافية فائقة للطباعة
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDesignLink(null)}
                className="rounded-xl bg-zinc-100 dark:bg-zinc-800 px-4 py-2 text-xs font-bold hover:opacity-80"
              >
                إغلاق
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-6 text-center">
                <span className="text-xs font-bold text-zinc-500 mb-4">المعاينة المباشرة للباركود</span>
                <div className="p-4 rounded-3xl bg-white shadow-lg inline-block border border-zinc-200/60">
                  <canvas ref={previewCanvasRef} className="max-w-full h-auto rounded-xl mx-auto" />
                </div>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-4">
                  ✓ دقة تصحيح الخطأ عالية (30%) تضمن مسحاً فورياً حتى مع وجود الشعار
                </p>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-2">
                    نمط ألوان الباركود
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDesignState(prev => ({ ...prev, colorMode: 'solid' }))}
                      className={`rounded-full border p-3 text-xs font-bold transition ${
                        designState.colorMode === 'solid'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      لون مصمت
                    </button>
                    <button
                      type="button"
                      onClick={() => setDesignState(prev => ({ ...prev, colorMode: 'gradient' }))}
                      className={`rounded-full border p-3 text-xs font-bold transition ${
                        designState.colorMode === 'gradient'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      تدرج لوني جذاب
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">
                      {designState.colorMode === 'gradient' ? 'اللون الأساسي الأول' : 'لون الباركود'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={designState.fgColor1}
                        onChange={e => setDesignState(prev => ({ ...prev, fgColor1: e.target.value }))}
                        className="h-10 w-14 rounded-xl border border-zinc-200 cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-bold text-zinc-500">{designState.fgColor1}</span>
                    </div>
                  </div>

                  {designState.colorMode === 'gradient' && (
                    <div>
                      <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">
                        اللون الأساسي الثاني
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={designState.fgColor2}
                          onChange={e => setDesignState(prev => ({ ...prev, fgColor2: e.target.value }))}
                          className="h-10 w-14 rounded-xl border border-zinc-200 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-bold text-zinc-500">{designState.fgColor2}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-2">
                    خلفية الباركود
                  </label>
                  <div className="flex items-center gap-6">
                    <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={designState.isTransparentBg}
                        onChange={e => setDesignState(prev => ({ ...prev, isTransparentBg: e.target.checked }))}
                        className="rounded border-zinc-300 h-4 w-4 text-primary"
                      />
                      <span>خلفية شفافة (Transparent PNG/SVG)</span>
                    </label>

                    {!designState.isTransparentBg && (
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={designState.bgColor}
                          onChange={e => setDesignState(prev => ({ ...prev, bgColor: e.target.value }))}
                          className="h-8 w-12 rounded-lg border border-zinc-200 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-bold text-zinc-500">لون الخلفية</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-2">
                    موضع وطريقة عرض الشعار
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDesignState(prev => ({ ...prev, logoMode: 'none' }))}
                      className={`rounded-xl border py-2 px-3 text-xs font-bold transition ${
                        designState.logoMode === 'none'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      بدون شعار
                    </button>
                    <button
                      type="button"
                      onClick={() => setDesignState(prev => ({ ...prev, logoMode: 'center' }))}
                      className={`rounded-xl border py-2 px-3 text-xs font-bold transition ${
                        designState.logoMode === 'center'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      الشعار في الوسط
                    </button>
                    <button
                      type="button"
                      onClick={() => setDesignState(prev => ({ ...prev, logoMode: 'watermark' }))}
                      className={`rounded-xl border py-2 px-3 text-xs font-bold transition ${
                        designState.logoMode === 'watermark'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      الشعار كخلفية
                    </button>
                  </div>

                  {designState.logoMode !== 'none' && (
                    <div className="space-y-3 mt-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-zinc-500">نوع الشعار:</span>
                        <button
                          type="button"
                          onClick={() => setDesignState(prev => ({ ...prev, logoType: 'meamart' }))}
                          className={`rounded-lg px-3 py-1 text-xs font-bold ${
                            designState.logoType === 'meamart' ? 'bg-primary text-white' : 'bg-zinc-100 dark:bg-zinc-800'
                          }`}
                        >
                          ميمارت MeaMart
                        </button>
                        <button
                          type="button"
                          onClick={() => setDesignState(prev => ({ ...prev, logoType: 'whatsapp' }))}
                          className={`rounded-lg px-3 py-1 text-xs font-bold ${
                            designState.logoType === 'whatsapp' ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'
                          }`}
                        >
                          واتساب WhatsApp
                        </button>
                        <button
                          type="button"
                          onClick={() => setDesignState(prev => ({ ...prev, logoType: 'store' }))}
                          className={`rounded-lg px-3 py-1 text-xs font-bold ${
                            designState.logoType === 'store' ? 'bg-amber-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'
                          }`}
                        >
                          أيقونة المتجر
                        </button>
                        <button
                          type="button"
                          onClick={() => setDesignState(prev => ({ ...prev, logoType: 'custom' }))}
                          className={`rounded-lg px-3 py-1 text-xs font-bold ${
                            designState.logoType === 'custom' ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'
                          }`}
                        >
                          + رفع شعار مخصص
                        </button>
                      </div>

                      {designState.logoType === 'custom' && (
                        <div className="flex items-center gap-3 p-3 rounded-full bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900">
                          <label className="cursor-pointer rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition">
                            اختر صورة الشعار من جهازك
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = URL.createObjectURL(file);
                                  setDesignState(prev => ({ ...prev, customLogoUrl: url }));
                                }
                              }}
                            />
                          </label>
                          <span className="text-xs font-bold text-zinc-500">
                            {designState.customLogoUrl ? '✓ تم اختيار الشعار المخصص' : 'اختر أي صورة لتظهر بوسط الباركود الإضافي'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
                  <label className="block text-sm font-extrabold text-zinc-900 dark:text-white mb-3">
                    تحميل الباركود للطباعة والنشر
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      type="button"
                      onClick={() => downloadPng(300, 'small-300px')}
                      className="rounded-full border border-zinc-200 dark:border-zinc-800 p-3 text-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                    >
                      <span className="block text-xs font-extrabold text-zinc-900 dark:text-white">PNG صغير</span>
                      <span className="block text-[10px] text-zinc-400 mt-0.5">300×300 بكسل</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadPng(600, 'medium-600px')}
                      className="rounded-full border border-zinc-200 dark:border-zinc-800 p-3 text-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                    >
                      <span className="block text-xs font-extrabold text-zinc-900 dark:text-white">PNG وسط</span>
                      <span className="block text-[10px] text-zinc-400 mt-0.5">600×600 بكسل</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadPng(1200, 'print-large-1200px')}
                      className="rounded-full bg-primary text-white p-3 text-center hover:bg-primary-dark shadow-md transition"
                    >
                      <span className="block text-xs font-extrabold">PNG للطباعة</span>
                      <span className="block text-[10px] opacity-80 mt-0.5">1200×1200 بكسل</span>
                    </button>

                    <button
                      type="button"
                      onClick={downloadSvg}
                      className="rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 p-3 text-center hover:opacity-90 shadow-md transition"
                    >
                      <span className="block text-xs font-extrabold">SVG متجهي</span>
                      <span className="block text-[10px] opacity-80 mt-0.5">غير محدود الدقة للمطابع</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className={`w-full ${editEntityType === 'bio' ? 'max-w-2xl' : 'max-w-md'} rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto`}>
            <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
              تعديل الباركود ({editingLink.title})
            </h4>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">
                  العنوان
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full rounded-full border border-zinc-200 px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                />
              </div>

              {(editingLink.entity_type === 'custom' || editingLink.entity_type === 'bio') && (
                <div className="rounded-full border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-950/50">
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-2">
                    نوع الوجهة (التحويل هنا لا يغير رابط الباركود المطبوع نهائياً)
                  </label>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-zinc-100/90 p-1 shadow-inner dark:border-zinc-700/60 dark:bg-zinc-800/80">
                    <button
                      type="button"
                      onClick={() => setEditEntityType('custom')}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                        editEntityType === 'custom'
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full transition-all ${
                          editEntityType === 'custom' ? 'bg-white shadow-xs' : 'bg-zinc-400'
                        }`}
                      />
                      <span>رابط ديناميكي</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditEntityType('bio')}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                        editEntityType === 'bio'
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full transition-all ${
                          editEntityType === 'bio' ? 'bg-white shadow-xs' : 'bg-zinc-400'
                        }`}
                      />
                      <span>الرابط الموحد</span>
                    </button>
                  </div>
                </div>
              )}

              {editEntityType === 'custom' && (editingLink.entity_type === 'custom' || editingLink.entity_type === 'bio') && (
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">
                    الرابط المستهدف الجديد (تعديل الوجهة دون تغير صورة الباركود)
                  </label>
                  <input
                    type="url"
                    value={editTargetUrl}
                    onChange={e => setEditTargetUrl(e.target.value)}
                    required
                    className="w-full rounded-full border border-zinc-200 px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                  />
                </div>
              )}

              {editEntityType === 'bio' && (editingLink.entity_type === 'custom' || editingLink.entity_type === 'bio') && (
                <div>
                  {/* Mobile Tab Toggle Bar in Edit Modal */}
                  <div className="flex md:hidden items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-full mb-3">
                    <button
                      type="button"
                      onClick={() => setActiveEditTabMobile('editor')}
                      className={`flex-1 py-1.5 text-xs font-black rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                        activeEditTabMobile === 'editor'
                          ? 'bg-white dark:bg-zinc-800 text-primary shadow-xs'
                          : 'text-zinc-500'
                      }`}
                    >
                      <span>✍️</span>
                      <span>تعديل</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveEditTabMobile('preview')}
                      className={`flex-1 py-1.5 text-xs font-black rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                        activeEditTabMobile === 'preview'
                          ? 'bg-white dark:bg-zinc-800 text-primary shadow-xs'
                          : 'text-zinc-500'
                      }`}
                    >
                      <span>📱</span>
                      <span>معاينة</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className={`space-y-3 ${activeEditTabMobile === 'editor' ? 'block' : 'hidden md:block'}`}>
                    <div>
                      <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">
                        النبذة التعريفية لصفحة الرابط الموحد
                      </label>
                      <input
                        type="text"
                        value={editBioDesc}
                        onChange={e => setEditEditBioDesc(e.target.value)}
                        className="w-full rounded-full border border-zinc-200 px-4 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300">
                          أزرار الروابط والتواصل
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditBioLinks([...editBioLinks, { label: 'قسم جديد', url: '', isSection: true }])}
                            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                          >
                            + عنوان قسم
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditBioLinks([...editBioLinks, { label: 'صنف منيو', price: '100 ر.س', icon: '☕', lineStyle: 'dotted', isMenu: true, type: 'menu' }])}
                            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            + صنف منيو / سعر
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditBioLinks([...editBioLinks, { label: '', url: '' }])}
                            className="text-xs font-bold text-primary hover:underline"
                          >
                            + إضافة رابط
                          </button>
                        </div>
                      </div>

                      {/* Visual Design Options in Edit */}
                      <div className="p-3 rounded-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-3 mb-3">
                        <div className="text-[11px] font-extrabold text-zinc-800 dark:text-zinc-200">{t('edit.bio.designGroup')}</div>
                        
                        {/* Edit Background Type Toggle */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-zinc-500">{t('edit.bio.bgType')}</label>
                          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-800">
                            <button
                              type="button"
                              onClick={() => setEditBioBgType('color')}
                              className={`flex-1 py-1 text-[10px] font-bold rounded transition ${editBioBgType === 'color' ? 'bg-white dark:bg-zinc-800 text-primary shadow-xs' : 'text-zinc-500'}`}
                            >
                              {t('create.bio.bg.color')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditBioBgType('pattern')}
                              className={`flex-1 py-1 text-[10px] font-bold rounded transition ${editBioBgType === 'pattern' ? 'bg-white dark:bg-zinc-800 text-primary shadow-xs' : 'text-zinc-500'}`}
                            >
                              {t('create.bio.bg.pattern')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditBioBgType('image')}
                              className={`flex-1 py-1 text-[10px] font-bold rounded transition ${editBioBgType === 'image' ? 'bg-white dark:bg-zinc-800 text-primary shadow-xs' : 'text-zinc-500'}`}
                            >
                              {t('create.bio.bg.image')}
                            </button>
                          </div>
                        </div>

                        {editBioBgType === 'pattern' && (
                          <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-zinc-100/50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                            <div>
                              <label className="block text-[9px] font-bold text-zinc-500 mb-1">
                                {t('create.bio.pattern.type')}
                              </label>
                              <select
                                value={editBioPatternType}
                                onChange={e => setEditBioPatternType(e.target.value as any)}
                                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-1 text-[10px] font-bold"
                              >
                                <option value="whatsapp">{t('create.bio.pattern.whatsapp')}</option>
                                <option value="dots">{t('create.bio.pattern.dots')}</option>
                                <option value="grid">{t('create.bio.pattern.grid')}</option>
                                <option value="waves">{t('create.bio.pattern.waves')}</option>
                                <option value="stars">{t('create.bio.pattern.stars')}</option>
                                <option value="diagonal">{t('create.bio.pattern.diagonal')}</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-zinc-500 mb-1">
                                {t('create.bio.pattern.color')}
                              </label>
                              <div className="flex items-center gap-1 mt-0.5">
                                {[
                                  { hex: '#ffffff' },
                                  { hex: '#fbbf24' },
                                  { hex: '#10b981' },
                                  { hex: '#000000' },
                                ].map(c => (
                                  <button
                                    key={c.hex}
                                    type="button"
                                    onClick={() => setEditBioPatternColor(c.hex)}
                                    style={{ backgroundColor: c.hex }}
                                    className={`h-4 w-4 rounded-full border ${editBioPatternColor === c.hex ? 'border-primary scale-110' : 'border-zinc-400'}`}
                                  />
                                ))}
                                <input
                                  type="color"
                                  value={editBioPatternColor}
                                  onChange={e => setEditBioPatternColor(e.target.value)}
                                  className="h-4 w-4 rounded-full border-0 bg-transparent cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {editBioBgType === 'image' && (
                          <div className="p-2 rounded-xl bg-zinc-100/50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                            <label className="block text-[9px] font-bold text-zinc-500 mb-1">
                              {t('create.bio.bg.imageUrl')}
                            </label>
                            <input
                              type="url"
                              placeholder="https://example.com/image.jpg"
                              value={editBioBgImageUrl}
                              onChange={e => setEditBioBgImageUrl(e.target.value)}
                              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-1 text-[10px]"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-500 mb-1">{t('edit.bio.pageBg')}</label>
                            <div className="flex items-center gap-1">
                              {[
                                { hex: '#09090b' },
                                { hex: '#0f172a' },
                                { hex: '#064e3b' },
                                { hex: '#2e1065' },
                                { hex: '#4c0519' },
                              ].map(t => (
                                <button
                                  key={t.hex}
                                  type="button"
                                  onClick={() => setEditBioThemeBg(t.hex)}
                                  style={{ backgroundColor: t.hex }}
                                  className={`h-5 w-5 rounded-full border ${editBioThemeBg === t.hex ? 'border-primary scale-110' : 'border-white/20'}`}
                                />
                              ))}
                              <input
                                type="color"
                                value={editBioThemeBg}
                                onChange={e => setEditBioThemeBg(e.target.value)}
                                className="h-5 w-5 rounded-full border-0 bg-transparent cursor-pointer"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-500 mb-1">{t('edit.bio.titleColor')}</label>
                            <div className="flex items-center gap-1">
                              {[
                                { hex: '#ffffff' },
                                { hex: '#fbbf24' },
                                { hex: '#38bdf8' },
                                { hex: '#34d399' },
                                { hex: '#f472b6' },
                              ].map(c => (
                                <button
                                  key={c.hex}
                                  type="button"
                                  onClick={() => setEditBioTitleColor(c.hex)}
                                  style={{ backgroundColor: c.hex }}
                                  className={`h-5 w-5 rounded-full border ${editBioTitleColor === c.hex ? 'border-primary scale-110' : 'border-zinc-400'}`}
                                />
                              ))}
                              <input
                                type="color"
                                value={editBioTitleColor}
                                onChange={e => setEditBioTitleColor(e.target.value)}
                                className="h-5 w-5 rounded-full border-0 bg-transparent cursor-pointer"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-500 mb-1">{t('edit.bio.textColor')}</label>
                            <div className="flex items-center gap-1">
                              {[
                                { hex: '#e4e4e7' },
                                { hex: '#ffffff' },
                                { hex: '#fef08a' },
                                { hex: '#bae6fd' },
                                { hex: '#18181b' },
                              ].map(c => (
                                <button
                                  key={c.hex}
                                  type="button"
                                  onClick={() => setEditBioTextColor(c.hex)}
                                  style={{ backgroundColor: c.hex }}
                                  className={`h-5 w-5 rounded-full border ${editBioTextColor === c.hex ? 'border-primary scale-110' : 'border-zinc-400'}`}
                                />
                              ))}
                              <input
                                type="color"
                                value={editBioTextColor}
                                onChange={e => setEditBioTextColor(e.target.value)}
                                className="h-5 w-5 rounded-full border-0 bg-transparent cursor-pointer"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-500 mb-1">{t('edit.bio.sectionColor')}</label>
                            <div className="flex items-center gap-1">
                              {[
                                { hex: '#fbbf24' },
                                { hex: '#ffffff' },
                                { hex: '#34d399' },
                                { hex: '#38bdf8' },
                                { hex: '#f472b6' },
                              ].map(c => (
                                <button
                                  key={c.hex}
                                  type="button"
                                  onClick={() => setEditBioSectionTitleColor(c.hex)}
                                  style={{ backgroundColor: c.hex }}
                                  className={`h-5 w-5 rounded-full border ${editBioSectionTitleColor === c.hex ? 'border-primary scale-110' : 'border-zinc-400'}`}
                                />
                              ))}
                              <input
                                type="color"
                                value={editBioSectionTitleColor}
                                onChange={e => setEditBioSectionTitleColor(e.target.value)}
                                className="h-5 w-5 rounded-full border-0 bg-transparent cursor-pointer"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-500 mb-1">{t('edit.bio.fontAndIcons')}</label>
                            <div className="flex items-center gap-1">
                              <select
                                value={editBioFontFamily}
                                onChange={e => setEditBioFontFamily(e.target.value)}
                                className="w-20 rounded-lg border border-zinc-200 bg-white px-1 py-1 text-[10px] font-bold dark:border-zinc-800 dark:bg-zinc-950"
                              >
                                <option value="Tajawal">Tajawal / تجاول</option>
                                <option value="Cairo">Cairo / كايرو</option>
                                <option value="Alexandria">Alexandria / إسكندرية</option>
                                <option value="Almarai">Almarai / المراعي</option>
                                <option value="Rubik">Rubik / روبيك</option>
                                <option value="Changa">Changa / تشانجا</option>
                                <option value="El Messiri">El Messiri / المسيري</option>
                                <option value="Amiri">Amiri / أميري</option>
                                <option value="IBM Plex Sans Arabic">IBM Plex / تقني</option>
                                <option value="Readex Pro">Readex Pro / ريدكس برو</option>
                              </select>
                              <select
                                value={editBioSocialStyle}
                                onChange={e => setEditBioSocialStyle(e.target.value as any)}
                                className="flex-1 rounded-lg border border-zinc-200 bg-white px-1 py-1 text-[10px] font-bold dark:border-zinc-800 dark:bg-zinc-950"
                              >
                                <option value="circles">{t('create.bio.social.circles')}</option>
                                <option value="squares">{t('create.bio.social.squares')}</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-zinc-500 mb-1">{t('edit.bio.cardShapes')}</label>
                            <div className="grid grid-cols-5 gap-1 rounded-lg border border-zinc-200 dark:border-zinc-800 p-0.5 bg-white dark:bg-zinc-950">
                              {[
                                { id: 'rounded-full', labelKey: 'create.bio.cardShapes.smooth' },
                                { id: 'rounded-3xl', labelKey: 'create.bio.cardShapes.round' },
                                { id: 'rounded-none', labelKey: 'create.bio.cardShapes.sharp' },
                                { id: 'glass', labelKey: 'create.bio.cardShapes.glass' },
                                { id: 'flat', labelKey: 'create.bio.cardShapes.none' }
                              ].map((shape) => (
                                <button
                                  key={shape.id}
                                  type="button"
                                  onClick={() => setEditBioCardStyle(shape.id as any)}
                                  className={`rounded py-0.5 text-[9px] font-bold transition text-center ${
                                    editBioCardStyle === shape.id ? 'bg-primary text-white shadow-xs' : 'text-zinc-600 dark:text-zinc-400'
                                  }`}
                                >
                                  {t(shape.labelKey)}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-zinc-500 mb-1">{t('edit.bio.textAlign')}</label>
                            <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-800 p-0.5 bg-white dark:bg-zinc-950">
                              <button
                                type="button"
                                onClick={() => setEditBioAlign('center')}
                                className={`flex-1 rounded py-0.5 text-[9px] font-bold transition ${
                                  editBioAlign === 'center' ? 'bg-primary text-white shadow-xs' : 'text-zinc-600 dark:text-zinc-400'
                                }`}
                              >
                                {t('edit.bio.align.center')}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditBioAlign('right')}
                                className={`flex-1 rounded py-0.5 text-[9px] font-bold transition ${
                                  editBioAlign === 'right' ? 'bg-primary text-white shadow-xs' : 'text-zinc-600 dark:text-zinc-400'
                                }`}
                              >
                                {t('edit.bio.align.right')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Social Quick-Add Strip */}
                      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 mb-2">
                        {[
                          { label: 'واتساب', url: 'https://wa.me/', slug: 'whatsapp' },
                          { label: 'انستغرام', url: 'https://instagram.com/', slug: 'instagram' },
                          { label: 'سناب', url: 'https://snapchat.com/add/', slug: 'snapchat' },
                          { label: 'تيك توك', url: 'https://tiktok.com/@', slug: 'tiktok' },
                          { label: 'تويتر / X', url: 'https://x.com/', slug: 'x' },
                          { label: 'تليجرام', url: 'https://t.me/', slug: 'telegram' },
                          { label: 'فيسبوك', url: 'https://facebook.com/', slug: 'facebook' },
                          { label: 'يوتيوب', url: 'https://youtube.com/', slug: 'youtube' },
                          { label: 'لينكدإن', url: 'https://linkedin.com/in/', slug: 'linkedin' },
                          { label: 'ديسكورد', url: 'https://discord.gg/', slug: 'discord' },
                          { label: 'جيت هب', url: 'https://github.com/', slug: 'github' },
                          { label: 'سبوتيفاي', url: 'https://open.spotify.com/', slug: 'spotify' },
                          { label: 'خرائط', url: 'https://maps.google.com/', slug: 'google-maps' },
                        ].map((platform, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setEditBioLinks([...editBioLinks, { label: platform.label, url: platform.url }])}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-primary hover:scale-105 shadow-xs transition"
                          >
                            <img
                              src={`https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/${platform.slug}/default.svg`}
                              className="w-3.5 h-3.5 object-contain"
                              alt={platform.label}
                              loading="lazy"
                            />
                            <span>{platform.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                        {editBioLinks.map((item, idx) => {
                          if (item.isSection) {
                            return (
                              <div key={idx} className="flex items-center gap-1.5 bg-amber-500/10 p-1.5 rounded-xl border border-amber-500/30">
                                <span className="text-[10px] font-bold text-amber-600">── قسم</span>
                                <input
                                  type="text"
                                  placeholder={t('create.bio.link.defaultSection')}
                                  value={item.label || item.title || ''}
                                  onChange={e => {
                                    const copy = [...editBioLinks];
                                    copy[idx] = { ...copy[idx], label: e.target.value, title: e.target.value };
                                    setEditBioLinks(copy);
                                  }}
                                  className="flex-1 rounded-xl border border-amber-500/30 px-2 py-1 text-xs font-bold dark:bg-zinc-950"
                                />
                                <button
                                  type="button"
                                  onClick={() => setEditBioLinks(editBioLinks.filter((_, i) => i !== idx))}
                                  className="rounded-xl bg-red-500/10 px-2 py-1 text-xs font-bold text-red-500"
                                >
                                  ×
                                </button>
                              </div>
                            );
                          }
                          if (item.isMenu || item.type === 'menu') {
                            return (
                              <div key={idx} className="flex flex-wrap items-center gap-1.5 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/30">
                                <span className="text-[10px] font-bold text-emerald-600">🍽️ {isAr ? 'صنف' : 'Item'}</span>
                                <input
                                  type="text"
                                  placeholder={t('create.bio.link.defaultMenu')}
                                  value={item.label || ''}
                                  onChange={e => {
                                    const copy = [...editBioLinks];
                                    copy[idx] = { ...copy[idx], label: e.target.value };
                                    setEditBioLinks(copy);
                                  }}
                                  className="w-1/3 rounded-xl border border-emerald-500/30 px-2 py-1 text-xs font-bold dark:bg-zinc-950"
                                />
                                <input
                                  type="text"
                                  placeholder={t('create.bio.link.price')}
                                  value={item.price || ''}
                                  onChange={e => {
                                    const copy = [...editBioLinks];
                                    copy[idx] = { ...copy[idx], price: e.target.value };
                                    setEditBioLinks(copy);
                                  }}
                                  className="w-20 rounded-xl border border-emerald-500/30 px-2 py-1 text-xs font-black dark:bg-zinc-950"
                                />
                                <input
                                  type="text"
                                  placeholder={isAr ? 'أيقونة/صورة' : 'Icon/Image'}
                                  value={item.icon || ''}
                                  onChange={e => {
                                    const copy = [...editBioLinks];
                                    copy[idx] = { ...copy[idx], icon: e.target.value };
                                    setEditBioLinks(copy);
                                  }}
                                  className="w-20 rounded-xl border border-emerald-500/30 px-2 py-1 text-xs dark:bg-zinc-950"
                                />
                                <select
                                  value={item.lineStyle || 'dotted'}
                                  onChange={e => {
                                    const copy = [...editBioLinks];
                                    copy[idx] = { ...copy[idx], lineStyle: e.target.value };
                                    setEditBioLinks(copy);
                                  }}
                                  className="rounded-xl border border-emerald-500/30 px-1.5 py-1 text-[10px] font-bold dark:bg-zinc-950"
                                >
                                  <option value="dotted">{t('menu.lineStyle.dotted')}</option>
                                  <option value="dashed">{t('menu.lineStyle.dashed')}</option>
                                  <option value="solid">{t('menu.lineStyle.solid')}</option>
                                  <option value="none">{t('menu.lineStyle.none')}</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => setEditBioLinks(editBioLinks.filter((_, i) => i !== idx))}
                                  className="rounded-xl bg-red-500/10 px-2 py-1 text-xs font-bold text-red-500"
                                >
                                  ×
                                </button>
                              </div>
                            );
                          }
                          const soc = detectSocialIcon(item.url, item.label);
                          return (
                            <div key={idx} className="flex items-center gap-1.5 bg-zinc-50/80 dark:bg-zinc-900/40 p-1.5 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-zinc-200/60 dark:bg-zinc-800 text-xs" title={soc.name}>
                                {soc.icon}
                              </span>
                              <input
                                type="text"
                                placeholder={isAr ? 'النص' : 'Label'}
                                value={item.label}
                                onChange={e => {
                                  const copy = [...editBioLinks];
                                  copy[idx] = { ...copy[idx], label: e.target.value };
                                  setEditBioLinks(copy);
                                }}
                                className="w-1/3 rounded-xl border border-zinc-200 px-2 py-1 text-xs dark:border-zinc-800 dark:bg-zinc-950"
                              />
                              <input
                                type="url"
                                placeholder={isAr ? 'الرابط' : 'URL'}
                                value={item.url}
                                onChange={e => {
                                  const copy = [...editBioLinks];
                                  copy[idx] = { ...copy[idx], url: e.target.value };
                                  setEditBioLinks(copy);
                                }}
                                className="flex-1 rounded-xl border border-zinc-200 px-2 py-1 text-xs dark:border-zinc-800 dark:bg-zinc-950"
                              />
                              <button
                                type="button"
                                onClick={() => setEditBioLinks(editBioLinks.filter((_, i) => i !== idx))}
                                className="rounded-xl bg-red-500/10 px-2 py-1 text-xs font-bold text-red-500"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Live Mobile Screen Preview in Edit Modal */}
                  <div className={`flex flex-col items-center justify-center p-3 rounded-full bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 ${activeEditTabMobile === 'preview' ? 'block' : 'hidden md:block'}`}>
                    <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-2 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>معاينة شاشة الرابط الموحد</span>
                    </div>
                    <div 
                      className="w-56 rounded-[2rem] border-4 border-zinc-800 dark:border-zinc-700 p-3 shadow-lg flex flex-col items-center text-center space-y-3 min-h-[360px]"
                      style={{ backgroundColor: editBioThemeBg, color: editBioTextColor }}
                    >
                      <div className="h-1 w-12 rounded-full bg-zinc-700/40"></div>
                      <h4 className="text-xs font-bold line-clamp-1" style={{ color: editBioTitleColor }}>{editTitle || editingLink.title}</h4>
                      <p className="text-[10px] line-clamp-2 px-1 leading-tight" style={{ color: editBioTextColor }}>{editBioDesc || 'النبذة التعريفية'}</p>

                      <div className="flex flex-wrap items-center justify-center gap-1 w-full">
                        {editBioLinks.map((item, i) => {
                          const soc = detectSocialIcon(item.url, item.label);
                          return (
                            <span 
                              key={i} 
                              className="flex h-6 w-6 items-center justify-center rounded-full border text-[10px]" 
                              style={{ 
                                borderColor: `${editBioTextColor}30`, 
                                backgroundColor: `${editBioTextColor}15`
                              }}
                              title={item.label}
                            >
                              {soc.icon}
                            </span>
                          );
                        })}
                      </div>

                      <div className="w-full space-y-1.5 max-h-32 overflow-y-auto">
                        {editBioLinks.map((item, i) => {
                          const soc = detectSocialIcon(item.url, item.label);
                          return (
                            <div 
                              key={i} 
                              className="flex items-center justify-between w-full rounded-lg border px-2.5 py-1.5 text-[10px] font-bold"
                              style={{ 
                                color: editBioTextColor, 
                                borderColor: `${editBioTextColor}25`, 
                                backgroundColor: `${editBioTextColor}12`
                              }}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span>{soc.icon}</span>
                                <span className="truncate">{item.label || 'رابط'}</span>
                              </div>
                              <span className="text-[9px] opacity-60">←</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

              {(editingLink.entity_type === 'seller' || editingLink.entity_type === 'ad') && (
                <div className="rounded-full bg-amber-500/10 border border-amber-500/30 p-3.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                  🔒 هذا الباركود مرتبط تلقائياً بصفحتك أو إعلانك. لا يمكن تغيير الرابط الوجهة لضمان حفظ الباركود ومصداقية الوصول.
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="rounded-xl px-4 py-2 text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {updating ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
