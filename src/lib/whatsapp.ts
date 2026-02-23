// WhatsApp notification service using WhatsApp Business API or third-party service
// This uses a simple approach with WhatsApp Web URL scheme

import { supabase } from "@/integrations/supabase/client";

const CLINIC_PHONE = "9479973877";
const USE_EDGE_FUNCTION = false; // Set to true to use Supabase Edge Function

export interface AppointmentDetails {
  patientName: string;
  patientPhone: string;
  dentist: string;
  date: string;
  time: string;
  service: string;
}

/**
 * Sends a WhatsApp message notification for appointment status
 * @param phone - Patient's phone number
 * @param status - 'confirmed' or 'cancelled'
 * @param details - Appointment details
 */
export async function sendWhatsAppNotification(
  phone: string,
  status: 'confirmed' | 'cancelled',
  details: AppointmentDetails
): Promise<boolean> {
  try {
    // Use Supabase Edge Function if enabled
    if (USE_EDGE_FUNCTION) {
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: { phone, status, details },
      });

      if (error) {
        console.error('Edge function error:', error);
        return false;
      }

      return data?.success || false;
    }

    // Otherwise, use browser-based WhatsApp Web approach
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Prepare message based on status
    const message = status === 'confirmed'
      ? `✅ *Appointment Confirmed* ✅

Hello ${details.patientName}!

Your dental appointment has been successfully confirmed.

📋 *Appointment Details:*
👨‍⚕️ Dentist: ${details.dentist}
📅 Date: ${details.date}
🕐 Time: ${details.time}
🦷 Service: ${details.service}

We look forward to seeing you! If you need to reschedule, please contact us.

*DentaCare Clinic*
📞 ${CLINIC_PHONE}`
      : `❌ *Appointment Cancelled* ❌

Hello ${details.patientName},

We regret to inform you that your appointment request has been cancelled.

📋 *Cancelled Appointment:*
👨‍⚕️ Dentist: ${details.dentist}
📅 Date: ${details.date}
🕐 Time: ${details.time}
🦷 Service: ${details.service}

If you'd like to book another appointment, please visit our website or contact us.

*DentaCare Clinic*
📞 ${CLINIC_PHONE}`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    // For server-side implementation, you would use WhatsApp Business API
    // For now, we'll log the URL and return success
    console.log('WhatsApp notification URL:', whatsappUrl);
    
    // In a production environment, you would:
    // 1. Use WhatsApp Business API with proper authentication
    // 2. Send via a backend service
    // 3. Use services like Twilio, MessageBird, or similar
    
    // For demonstration, we'll open the URL (this works in browser)
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
    
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return false;
  }
}

/**
 * Alternative: Send via backend API (recommended for production)
 * This would call your backend endpoint that integrates with WhatsApp Business API
 */
export async function sendWhatsAppViaAPI(
  phone: string,
  status: 'confirmed' | 'cancelled',
  details: AppointmentDetails
): Promise<boolean> {
  try {
    // This is a placeholder for your backend API integration
    const response = await fetch('/api/send-whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
        status,
        details,
        clinicPhone: CLINIC_PHONE,
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error sending WhatsApp via API:', error);
    return false;
  }
}
