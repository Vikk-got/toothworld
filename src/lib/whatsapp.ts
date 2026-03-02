// WhatsApp notification service
const CLINIC_PHONE = "8302115319";

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
 */
export async function sendWhatsAppNotification(
  phone: string,
  status: 'confirmed' | 'cancelled',
  details: AppointmentDetails
): Promise<boolean> {
  try {
    // 1. Log to our API (database tracking)
    try {
      await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, status, details, clinicPhone: CLINIC_PHONE }),
      });
    } catch (e) {
      console.error("Failed to log notification to API", e);
    }

    // 2. Open WhatsApp Web (Browser-based approach as requested for immediate use)
    const cleanPhone = phone.replace(/\D/g, '');

    const message = status === 'confirmed'
      ? `✅ *Appointment Confirmed* ✅\n\nHello ${details.patientName}!\n\nYour dental appointment has been successfully confirmed.\n\n📋 *Appointment Details:*\n👨‍⚕️ Dentist: ${details.dentist}\n📅 Date: ${details.date}\n🕐 Time: ${details.time}\n🦷 Service: ${details.service}\n\nWe look forward to seeing you! If you need to reschedule, please contact us.\n\n*Tooth World Clinic*\n📞 ${CLINIC_PHONE}`
      : `❌ *Appointment Cancelled* ❌\n\nHello ${details.patientName},\n\nWe regret to inform you that your appointment request has been cancelled.\n\n📋 *Cancelled Appointment:*\n👨‍⚕️ Dentist: ${details.dentist}\n📅 Date: ${details.date}\n🕐 Time: ${details.time}\n🦷 Service: ${details.service}\n\nIf you'd like to book another appointment, please visit our website or contact us.\n\n*Tooth World Clinic*\n📞 ${CLINIC_PHONE}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }

    return true;
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return false;
  }
}
