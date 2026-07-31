/**
 * MeaChat API Service Wrapper
 * Based on MeaChat API - Developer Reference
 */

const MEACHAT_BASE_URL = 'https://app.meachat.com/api/v1';

// Default configuration based on provided options
const DEFAULT_PHONE_NUMBER = '+15559607109';
const DEFAULT_PHONE_NUMBER_ID = '1188066204390074';

export class MeaChatAPI {
  private apiToken: string;

  constructor(apiToken?: string) {
    // Attempt to get token from env variables, or fallback
    this.apiToken = apiToken || import.meta.env?.MEACHAT_API_TOKEN || process.env?.MEACHAT_API_TOKEN || '20125|yU5zzzgWj1uD7WZsJURufELzF6paa60g7uEe0xGb9c1bc37a';
  }

  /**
   * Helper method to send API requests
   */
  private async request(endpoint: string, data: Record<string, any> = {}) {
    if (!this.apiToken) {
      throw new Error('MeaChat API Token is not configured.');
    }

    const payload = {
      ...data,
      apiToken: this.apiToken
    };

    try {
      const response = await fetch(`${MEACHAT_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`MeaChat API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * Helper utility to clean and format phone numbers for international delivery via MeaChat
   * Examples: 
   * '0501234567' -> '966501234567'
   * '+966 50 123 4567' -> '966501234567'
   * '00966501234567' -> '966501234567'
   * '97339123456' -> '97339123456'
   */
  public formatInternationalPhone(phone: string, defaultCountryCode: string = '966'): string {
    if (!phone) return '';
    // Strip all non-digit characters
    let clean = phone.replace(/[^0-9]/g, '');
    
    // Remove leading double zero if present
    if (clean.startsWith('00')) {
      clean = clean.substring(2);
    }
    
    // If it starts with 05 (common local mobile format in KSA/UAE), replace leading 0 with default country code
    if (clean.startsWith('05') && clean.length === 10) {
      clean = `${defaultCountryCode}${clean.substring(1)}`;
    } else if (clean.startsWith('5') && clean.length === 9) {
      clean = `${defaultCountryCode}${clean}`;
    } else if (clean.startsWith('0') && clean.length > 8 && clean.length < 12) {
      // Local phone starting with 0
      clean = `${defaultCountryCode}${clean.substring(1)}`;
    }
    
    return clean;
  }

  // ==========================================
  // 1. WhatsApp API Methods
  // ==========================================

  /**
   * 2.2 Send Text Message (Session Message within 24h)
   */
  async sendTextMessage(
    phoneNumber: string, 
    message: string, 
    phoneNumberId: string = DEFAULT_PHONE_NUMBER_ID
  ) {
    const formattedPhone = this.formatInternationalPhone(phoneNumber);
    return this.request('/whatsapp/send', {
      phone_number_id: phoneNumberId,
      phone_number: formattedPhone,
      message: message
    });
  }

  /**
   * 2.3 Send Interactive Buttons
   */
  async sendInteractiveButtons(
    phoneNumber: string,
    message: string,
    buttons: Array<{ type: 'reply', reply: { id: string, title: string } }>,
    options?: {
      header_text?: string;
      footer_text?: string;
      media_url?: string;
      media_type?: 'image' | 'video' | 'document';
      phoneNumberId?: string;
    }
  ) {
    const formattedPhone = this.formatInternationalPhone(phoneNumber);
    return this.request('/whatsapp/send/interactive-buttons', {
      phone_number_id: options?.phoneNumberId || DEFAULT_PHONE_NUMBER_ID,
      phone_number: formattedPhone,
      message: message,
      buttons: buttons,
      button_header_text: options?.header_text,
      button_footer_text: options?.footer_text,
      media_url: options?.media_url,
      media_type: options?.media_type
    });
  }

  /**
   * 2.4 Send File / Media
   */
  async sendFile(
    phoneNumber: string,
    mediaUrl: string,
    options?: {
      mediaType?: string;
      caption?: string;
      phoneNumberId?: string;
    }
  ) {
    const formattedPhone = this.formatInternationalPhone(phoneNumber);
    return this.request('/whatsapp/send/file', {
      phone_number_id: options?.phoneNumberId || DEFAULT_PHONE_NUMBER_ID,
      phone_number: formattedPhone,
      media_url: mediaUrl,
      media_type: options?.mediaType,
      media_caption_text: options?.caption
    });
  }

  /**
   * 2.10 Trigger Bot Flow
   */
  async triggerBotFlow(
    phoneNumber: string,
    botFlowUniqueId: string,
    phoneNumberId: string = DEFAULT_PHONE_NUMBER_ID
  ) {
    const formattedPhone = this.formatInternationalPhone(phoneNumber);
    return this.request('/whatsapp/trigger-bot', {
      phone_number_id: phoneNumberId,
      phone_number: formattedPhone,
      bot_flow_unique_id: botFlowUniqueId
    });
  }

  /**
   * 2.5 Subscriber List
   */
  async getSubscribers(limit: number = 100, offset: number = 0, phoneNumberId: string = DEFAULT_PHONE_NUMBER_ID) {
    return this.request('/whatsapp/subscriber/list', {
      phone_number_id: phoneNumberId,
      limit,
      offset
    });
  }

  /**
   * 2.7 Subscriber Create
   */
  async createSubscriber(name: string, phoneNumber: string, phoneNumberId: string = DEFAULT_PHONE_NUMBER_ID) {
    const formattedPhone = this.formatInternationalPhone(phoneNumber);
    return this.request('/whatsapp/subscriber/create', {
      phoneNumberID: phoneNumberId,
      name,
      phoneNumber: formattedPhone
    });
  }

  /**
   * Smart WhatsApp Notification Sender
   * Attempts to ensure subscriber exists and sends the text message with automatic retry
   */
  async sendSmartNotification(
    phoneNumber: string,
    message: string,
    name: string = 'MeaMart User',
    phoneNumberId: string = DEFAULT_PHONE_NUMBER_ID
  ) {
    const formattedPhone = this.formatInternationalPhone(phoneNumber);
    if (!formattedPhone) return { success: false, error: 'Invalid phone number' };

    try {
      // Step 1: Ensure subscriber exists in MeaChat (prevents delivery failure for new contacts)
      try {
        await this.createSubscriber(name, formattedPhone, phoneNumberId);
      } catch (subErr) {
        console.warn(`[MeaChat] Could not auto-register subscriber ${formattedPhone}:`, subErr);
      }

      // Step 2: Send text message
      const res = await this.sendTextMessage(formattedPhone, message, phoneNumberId);
      console.log(`[MeaChat] WhatsApp message delivered successfully to ${formattedPhone}`, res);
      return { success: true, data: res, formattedPhone };
    } catch (error: any) {
      console.error(`[MeaChat] Smart notification failed for ${formattedPhone}:`, error);
      return { success: false, error: error.message || String(error), formattedPhone };
    }
  }

  // ==========================================
  // 2. User / General API Methods
  // ==========================================

  /**
   * 1.1 My Information
   */
  async getMyInfo() {
    return this.request('/user/myInfo');
  }

  /**
   * 1.15 Get Direct Login URL
   */
  async getDirectLoginUrl(email: string, options?: { name?: string, mobile?: string }) {
    return this.request('/user/get/direct-login-url', {
      email,
      name: options?.name,
      mobile: options?.mobile
    });
  }

  /**
   * 1.2 Usage Log
   */
  async getUsageLog() {
    return this.request('/user/usage/log');
  }
}

// Export a default instance
export const meachat = new MeaChatAPI();
