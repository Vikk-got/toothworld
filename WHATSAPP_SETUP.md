# WhatsApp Notification Setup

This document explains how the WhatsApp notification system works for appointment confirmations and cancellations.

## Current Implementation

The system is configured to send WhatsApp notifications from the clinic number: **9479973877**

### How It Works

1. When an admin accepts or declines an appointment in the Admin Dashboard
2. The system automatically sends a WhatsApp message to the patient's phone number
3. Messages include:
   - ✅ **Confirmed**: "Your appointment is successfully done" with full details
   - ❌ **Cancelled**: "Your request has been cancelled" with appointment info

### Message Format

**For Confirmed Appointments:**
```
✅ Appointment Confirmed ✅

Hello [Patient Name]!

Your dental appointment has been successfully confirmed.

📋 Appointment Details:
👨‍⚕️ Dentist: [Dentist Name]
📅 Date: [Date]
🕐 Time: [Time]
🦷 Service: [Service]

We look forward to seeing you! If you need to reschedule, please contact us.

DentaCare Clinic
📞 9479973877
```

**For Cancelled Appointments:**
```
❌ Appointment Cancelled ❌

Hello [Patient Name],

We regret to inform you that your appointment request has been cancelled.

📋 Cancelled Appointment:
👨‍⚕️ Dentist: [Dentist Name]
📅 Date: [Date]
🕐 Time: [Time]
🦷 Service: [Service]

If you'd like to book another appointment, please visit our website or contact us.

DentaCare Clinic
📞 9479973877
```

## Production Setup Options

### Option 1: WhatsApp Business API (Recommended)

For automated server-side messaging, you need to:

1. **Sign up for WhatsApp Business API**
   - Visit: https://business.whatsapp.com/
   - Apply for API access
   - Get verified

2. **Use a Service Provider** (Easier):
   - **Twilio**: https://www.twilio.com/whatsapp
   - **MessageBird**: https://www.messagebird.com/
   - **Vonage**: https://www.vonage.com/communications-apis/messages/
   - **Gupshup**: https://www.gupshup.io/

3. **Backend Implementation**:
   ```typescript
   // Example with Twilio
   import twilio from 'twilio';
   
   const client = twilio(accountSid, authToken);
   
   await client.messages.create({
     from: 'whatsapp:+919479973877',
     to: `whatsapp:${patientPhone}`,
     body: message
   });
   ```

### Option 2: Current Browser-Based Approach

The current implementation opens WhatsApp Web with a pre-filled message. This:
- ✅ Works immediately without API setup
- ✅ No additional costs
- ❌ Requires manual sending (admin clicks send)
- ❌ Only works in browser

### Option 3: Supabase Edge Function

Create a Supabase Edge Function to handle WhatsApp API calls:

1. Create `supabase/functions/send-whatsapp/index.ts`:
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { phone, status, details } = await req.json()
  
  // Call WhatsApp API (e.g., Twilio)
  const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa('YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      From: 'whatsapp:+919479973877',
      To: `whatsapp:${phone}`,
      Body: message
    })
  })
  
  return new Response(JSON.stringify({ success: response.ok }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

2. Update `src/lib/whatsapp.ts` to use the edge function:
```typescript
const response = await supabase.functions.invoke('send-whatsapp', {
  body: { phone, status, details }
})
```

## Testing

1. **Test with your own number first**
2. Make sure the phone number format is correct (include country code)
3. Check that the patient has WhatsApp installed
4. Verify the clinic number (9479973877) is registered with WhatsApp Business

## Cost Considerations

- **WhatsApp Web (Current)**: Free, but manual
- **WhatsApp Business API**: 
  - Twilio: ~$0.005-0.02 per message
  - MessageBird: Similar pricing
  - First 1000 messages/month often free

## Next Steps

1. Choose your preferred method (API vs manual)
2. If using API, sign up with a provider
3. Update the `sendWhatsAppNotification` function with API credentials
4. Test thoroughly before going live
5. Consider adding message templates for faster approval

## Security Notes

- Never commit API keys to version control
- Use environment variables for sensitive data
- Store credentials in Supabase secrets or .env files
- Validate phone numbers before sending
- Implement rate limiting to prevent abuse
