

export const siteConfig = {
  name: 'MeaMart',
  description: 'The smart Arabic classifieds marketplace platform with AI-powered chat.',
  logo: {
    src: '/logo.svg',
    srcDark: '/logo.svg',       // Used when strategy is 'switch'
    alt: 'MeaMart Logo',
    strategy: 'invert' as 'invert' | 'switch' | 'static', // 'invert' | 'switch' | 'static'
  },
  ogImage: '/og-image.webp',
  primaryColor: '#00008B', // Default primary color
  search: {
    enabled: true,
  },
  announcement: {
    enabled: true,
    id: 'upgrade_v2_0_0', // Change this ID to reshow the banner
    link: '/changelog',
    localizeLink: true, // Set to true to apply i18n routing to the link, false for external/absolute links
  },
  blog: {
    postsPerPage: 6,
  },
  contact: {
    email: {
      support: 'support@interstellar.com',
      sales: 'sales@interstellar.com',
    },
    phone: {
      main: '+1 (555) 123-4567',
      label: 'Mon-Fri 9am-6pm PST'
    },
    address: {
      city: 'Endurance',
      full: 'Interstellar Space Station'
    }
  },
  analytics: {
    alwaysLoad: import.meta.env.ANALYTICS_ALWAYS_LOAD === 'true',
    vendors: {
      googleAnalytics: {
        id: import.meta.env.GA_ID || '',
        enabled: import.meta.env.GA_ENABLED === 'true',
      },
      rybbit: {
        id: import.meta.env.RYBBIT_ID || '',
        src: import.meta.env.RYBBIT_SRC || 'https://rybbit.example.com/api/script.js',
        enabled: import.meta.env.RYBBIT_ENABLED === 'true',
      },
      umami: {
        id: import.meta.env.UMAMI_ID || '',
        src: import.meta.env.UMAMI_SRC || 'https://analytics.umami.is/script.js',
        enabled: import.meta.env.UMAMI_ENABLED === 'true',
      },
    },
  },
  dateOptions: {
    localeMapping: {
        'ar': 'ar-TN',
        'en': 'en-GB',
    }
  },
  seo: {
    keywords: 'classifieds, ads, buy, sell, Saudi Arabia, إعلانات, بيع, شراء, ميمارت',
    author: 'MeaMart',
  },
  marketing: {
    googleSiteVerification: '',
    facebookDomainVerification: '',
    gtm: { enabled: false, id: '' },
    facebookPixel: { enabled: false, id: '' },
    snapchatPixel: { enabled: false, id: '' },
    tiktokPixel: { enabled: false, id: '' },
  },
  features: {
    rss: false,
  },
};

export const NAV_LINKS = [
  { 
    href: '/categories', 
    label: 'Categories',
    children: [
        { href: '/categories/vehicles', label: 'Vehicles', description: 'Cars, bikes, and boats', icon: 'Car' },
        { href: '/categories/real-estate', label: 'Real Estate', description: 'Apartments and villas', icon: 'Home' },
        { href: '/categories/electronics', label: 'Electronics', description: 'Phones and computers', icon: 'Laptop' },
        { href: '/categories/services', label: 'Services', description: 'Professional services', icon: 'Wrench' },
    ]
  },
  { 
    href: '/listings', 
    label: 'Listings',
    children: [
        { href: '/listings', label: 'All Ads', description: 'Browse all recent ads', icon: 'List' },
        { href: '/featured', label: 'Featured', description: 'Premium listings', icon: 'Star' },
    ]
  },
  {
    href: '/about',
    label: 'Company',
    children: [
        { href: '/about', label: 'About Us', description: 'Who we are', icon: 'Building2' },
        { href: '/contact', label: 'Contact', description: 'Get in touch', icon: 'Mail' },
    ]
  }
];

export const ACTION_LINKS = {
  primary: { label: 'Post Ad', href: '/post-ad' },
  social: { 
    twitter: 'https://twitter.com/gladtek',
    linkedin: 'https://linkedin.com/company/gladtek',
    github: 'https://github.com/gladtek',
    youtube: 'https://youtube.com/@gladtek',
    facebook: 'https://facebook.com/gladtek'
    
  }
};

export const FOOTER_LINKS = {
  product: {
    title: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/about', label: 'About' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/changelog', label: 'Changelog' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy', localize: false },
      { href: '/terms', label: 'Terms', localize: false }
    ],
  },
};
