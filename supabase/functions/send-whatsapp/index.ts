// Supabase Edge Function for sending WhatsApp notifications
// Deploy with: supabase functions deploy send-whatsapp

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CLINIC_PHONE = "9479973877";

interface AppointmentDetails {
  patientName: string;
  patientPhone: string;
  dentist: string;
  date: string;
  time: string;
  service: string;
}

interface RequestBody {
  phone: string;
  status: 'confirmed' | 'cancelled';
  details: AppointmentDetails;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }

  try {
    const { phone, status, details }: RequestBody = await req.json();

    // Validate input
    if (!phone || !status || !details) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '');

    // Prepare message
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

    // Option 1: Using Twilio (uncomment and configure)
    /*
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: `whatsapp:+91${CLINIC_PHONE}`,
          To: `whatsapp:+${cleanPhone}`,
          Body: message,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Twilio API error: ${response.statusText}`);
    }
    */

    // Option 2: Using MessageBird (uncomment and configure)
    /*
    const messageBirdApiKey = Deno.env.get('MESSAGEBIRD_API_KEY');
    
    const response = await fetch('https://conversations.messagebird.com/v1/send', {
      method: 'POST',
      headers: {
        'Authorization': `AccessKey ${messageBirdApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: cleanPhone,
        from: CLINIC_PHONE,
        type: 'text',
        content: {
          text: message,
        },
        channelId: 'YOUR_WHATSAPP_CHANNEL_ID',
      }),
    });

    if (!response.ok) {
      throw new Error(`MessageBird API error: ${response.statusText}`);
    }
    */

    // For now, just log and return success (for testing)
    console.log('WhatsApp notification prepared:', {
      to: cleanPhone,
      status,
      message: message.substring(0, 100) + '...',
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'WhatsApp notification sent successfully',
        phone: cleanPhone,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to send WhatsApp notification',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
