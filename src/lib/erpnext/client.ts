export interface ERPNextResponse<T> {
  message?: T;
  data?: T;
  exc_type?: string;
  _server_messages?: string;
}

export interface ERPNextConfig {
  baseUrl: string;
  apiKey?: string;
  apiSecret?: string;
}

export class ERPNextClient {
  private config: ERPNextConfig;

  constructor(config?: Partial<ERPNextConfig>) {
    this.config = {
      baseUrl: import.meta.env.ERPNEXT_URL || 'http://139.59.111.91:8080',
      apiKey: import.meta.env.ERPNEXT_API_KEY,
      apiSecret: import.meta.env.ERPNEXT_API_SECRET,
      ...config,
    };
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.config.apiKey && this.config.apiSecret) {
      headers['Authorization'] = `token ${this.config.apiKey}:${this.config.apiSecret}`;
    }

    return headers;
  }

  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${path}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, data?: any): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    let responseData: any;
    try {
      responseData = await response.json();
    } catch (e) {
      throw new Error(`Invalid JSON response: ${response.statusText}`);
    }

    if (!response.ok || responseData.exc_type) {
      const errorMsg = responseData._server_messages 
        ? JSON.parse(responseData._server_messages)[0]
        : responseData.exc_type || 'Unknown ERPNext Error';
      throw new Error(`ERPNext API Error: ${typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}`);
    }

    // Frappe returns data in 'message' for whitelisted methods and 'data' for standard REST API
    return responseData.message !== undefined ? responseData.message : responseData.data;
  }

  // Specific MeaMart Methods (Updated for new schema)
  async getCategories(): Promise<any[]> {
    const res = await this.get<any>('/api/method/meamart_core.api.categories');
    return res.data || [];
  }

  async getListings(params?: { limit?: number; offset?: number; category_slug?: string; city?: string; q?: string }): Promise<{data: any[], total_count: number}> {
    const res = await this.get<any>('/api/method/meamart_core.api.listings', params);
    return res;
  }

  async getListingDetail(slug: string): Promise<any> {
    const res = await this.get<any>('/api/method/meamart_core.api.listing_detail', { slug });
    return res.data;
  }

  async createLead(data: { visitor_name: string; source: string; visitor_phone?: string; ad?: string; notes?: string; chat_session_id?: string }): Promise<any> {
    return this.post<any>('/api/method/meamart_core.api.create_conversation_lead', data);
  }
}

export const erpnext = new ERPNextClient();
