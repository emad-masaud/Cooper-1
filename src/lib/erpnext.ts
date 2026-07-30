export const ERPNEXT_URL = import.meta.env.PUBLIC_ERPNEXT_URL || 'http://139.59.111.91:8080';
const API_KEY = import.meta.env.PUBLIC_ERPNEXT_API_KEY;
const API_SECRET = import.meta.env.PUBLIC_ERPNEXT_API_SECRET;

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (API_KEY && API_SECRET) {
    headers['Authorization'] = `token ${API_KEY}:${API_SECRET}`;
  }
  
  return headers;
};

export async function getListings(filters?: Record<string, any>, limit = 12) {
  try {
    let url = `${ERPNEXT_URL}/api/resource/Classified Ad?limit_page_length=${limit}&fields=["*"]`;
    if (filters) {
      url += `&filters=${encodeURIComponent(JSON.stringify(filters))}`;
    }
    
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch listings');
    
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
}

export async function getListing(id: string) {
  try {
    const res = await fetch(`${ERPNEXT_URL}/api/resource/Classified Ad/${encodeURIComponent(id)}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch listing');
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching listing:', error);
    return null;
  }
}

export async function getCategories() {
  try {
    const res = await fetch(`${ERPNEXT_URL}/api/resource/Ad Category?fields=["*"]&limit_page_length=100`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createLead(adId: string, visitorData: any) {
  try {
    const payload = {
      ad: adId,
      source: "Website",
      status: "New",
      ...visitorData
    };
    
    const res = await fetch(`${ERPNEXT_URL}/api/resource/Ad Lead`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) throw new Error('Failed to create lead');
    return await res.json();
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
}

export async function searchListings(query: string, category?: string) {
  // Simple search implementation
  const filters: any[] = [['title', 'like', `%${query}%`]];
  if (category) {
    filters.push(['category', '=', category]);
  }
  
  return getListings(filters, 50);
}

export async function getUserProfile(userId: string) {
  try {
    const res = await fetch(`${ERPNEXT_URL}/api/resource/User/${encodeURIComponent(userId)}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
