# WhatsApp Notifications - Frequently Asked Questions

## General Questions

### Q: How does the WhatsApp notification feature work?
**A:** When an admin accepts or declines an appointment in the dashboard, the system automatically prepares a WhatsApp message with appointment details and opens WhatsApp Web. The admin then clicks "Send" to deliver the message to the patient.

### Q: What is the clinic phone number used?
**A:** The clinic number is **9479973877**. This number appears in all WhatsApp messages sent to patients.

### Q: Do I need a WhatsApp Business account?
**A:** For the current browser-based implementation, no. You just need WhatsApp Web access. For the production API version, yes, you'll need WhatsApp Business API access.

### Q: Is this feature free?
**A:** Yes, the current browser-based implementation is completely free. If you upgrade to the API version, there are small per-message costs (~$0.005-0.02 per message).

---

## Technical Questions

### Q: What happens if the patient doesn't have WhatsApp?
**A:** The message won't be delivered. The system will still update the appointment status in the database, but the WhatsApp notification will fail. Consider adding email notifications as a backup.

### Q: Can I customize the message templates?
**A:** Yes! Edit the message templates in `src/lib/whatsapp.ts`. Look for the message generation code in the `sendWhatsAppNotification` function.

### Q: What phone number formats are supported?
**A:** The system automatically cleans phone numbers, so these all work:
- `+919876543210`
- `919876543210`
- `9876543210`
- `+91 98765 43210`
- `+91-9876-543210`

### Q: How do I switch to automated API sending?
**A:** 
1. Set up a WhatsApp API provider (Twilio, MessageBird, etc.)
2. Deploy the Supabase Edge Function: `supabase functions deploy send-whatsapp`
3. Set your API credentials as Supabase secrets
4. Change `USE_EDGE_FUNCTION = true` in `src/lib/whatsapp.ts`

### Q: Can I send notifications for other events?
**A:** Yes! You can call `sendWhatsAppNotification()` from anywhere in your code. Just pass the phone number, status, and appointment details.

---

## Troubleshooting

### Q: WhatsApp Web doesn't open when I click accept/decline
**A:** Check these:
1. Is your popup blocker enabled? Disable it for your domain
2. Try a different browser (Chrome, Firefox, Edge)
3. Check browser console for errors (F12)
4. Verify the patient has a phone number saved

### Q: The message is not pre-filled
**A:** This usually means:
1. The appointment data is incomplete
2. There's a JavaScript error (check console)
3. The phone number format is invalid
4. Try refreshing the page and trying again

### Q: Patient says they didn't receive the message
**A:** Verify:
1. Did you click "Send" in WhatsApp Web?
2. Is the phone number correct?
3. Does the patient have WhatsApp installed?
4. Is the patient's phone connected to internet?
5. Check if the message is in WhatsApp Web's sent messages

### Q: I see an error toast after accepting/declining
**A:** This means the WhatsApp notification failed but the appointment status was still updated. Check:
1. Browser console for detailed error
2. Patient phone number is valid
3. Internet connection is stable
4. Try again with a different appointment

### Q: Can I test without sending to real patients?
**A:** Yes! Use your own phone number when booking test appointments. This way you can verify the entire flow without bothering patients.

---

## Feature Questions

### Q: Can I send reminders before appointments?
**A:** Not currently, but you can add this feature by:
1. Creating a scheduled job (cron)
2. Querying appointments for tomorrow
3. Calling `sendWhatsAppNotification()` for each

### Q: Can patients reply to the messages?
**A:** In the current browser-based version, yes - replies go to the admin's WhatsApp. In the API version, you'd need to set up webhook handlers to receive replies.

### Q: Can I send messages in different languages?
**A:** Yes! Modify the message templates in `src/lib/whatsapp.ts` to support multiple languages. You could add a language field to the patient profile.

### Q: Can I track if messages were delivered?
**A:** In the browser version, no. In the API version, yes - most providers offer delivery status webhooks.

### Q: Can I send images or attachments?
**A:** Not in the current implementation, but the API version supports media messages. You'd need to modify the edge function to include media URLs.

---

## Setup Questions

### Q: Do I need to configure anything to start using this?
**A:** No! The browser-based version works immediately. Just make sure:
1. Patients provide phone numbers when booking
2. Admin has WhatsApp Web access
3. Popups are allowed in browser

### Q: How do I upgrade to the production API version?
**A:** Follow these steps:
1. Choose a provider (Twilio recommended)
2. Sign up and get API credentials
3. Configure Supabase Edge Function
4. Set environment variables
5. Deploy and test
6. See `WHATSAPP_SETUP.md` for detailed instructions

### Q: What are the costs for the API version?
**A:** Typical costs:
- Twilio: $0.005-0.02 per message
- MessageBird: Similar pricing
- Most providers offer 1000 free messages/month
- Example: 100 appointments/month = ~$1-2/month

### Q: Can I use my existing WhatsApp Business number?
**A:** For the browser version, yes. For the API version, you need to register your number with WhatsApp Business API, which requires verification.

---

## Security Questions

### Q: Is patient data secure?
**A:** Yes:
- Phone numbers are stored securely in Supabase
- Messages are sent directly via WhatsApp (encrypted)
- Only admins can trigger notifications
- No patient data is exposed in URLs (API mode)

### Q: Can anyone send WhatsApp messages from my system?
**A:** No. Only authenticated admins can access the dashboard and trigger notifications. Supabase Row Level Security (RLS) policies enforce this.

### Q: What if someone enters a wrong phone number?
**A:** The message will fail to deliver. The appointment status is still updated, but the patient won't receive the notification. Consider adding phone number verification during booking.

### Q: Are API credentials secure?
**A:** Yes, if you follow best practices:
- Store credentials in Supabase secrets (not in code)
- Never commit API keys to version control
- Use environment variables
- Rotate keys periodically

---

## Performance Questions

### Q: How fast are notifications sent?
**A:** 
- Browser version: Instant (opens immediately)
- API version: 1-3 seconds typically

### Q: Can I send bulk notifications?
**A:** Yes, but be careful:
- Browser version: Opens one tab per message (not ideal for bulk)
- API version: Can send many messages quickly
- Consider rate limits from your provider

### Q: What if I have hundreds of appointments per day?
**A:** The API version is recommended for high volume:
- Automated sending
- Better rate limits
- Delivery tracking
- Bulk sending capabilities

---

## Integration Questions

### Q: Can I integrate with other notification channels?
**A:** Yes! You can add:
- Email notifications (using Supabase Auth)
- SMS notifications (using Twilio SMS)
- Push notifications (using Firebase)
- All can use similar patterns to the WhatsApp integration

### Q: Can I use this with other appointment systems?
**A:** Yes! The `sendWhatsAppNotification()` function is standalone. You can call it from any system that has patient phone numbers and appointment details.

### Q: Does this work with the existing booking system?
**A:** Yes! It's fully integrated with your current booking flow. No changes needed to the booking page.

---

## Best Practices

### Q: What's the best way to test this feature?
**A:** 
1. Use your own phone number for initial tests
2. Test both accept and decline flows
3. Try different phone number formats
4. Test with multiple appointments
5. Verify message formatting on mobile
6. See `TESTING_WHATSAPP.md` for detailed checklist

### Q: Should I notify patients about this feature?
**A:** Yes! Add a note on your booking page like:
"You'll receive WhatsApp confirmation once your appointment is reviewed."

### Q: What if a patient doesn't want WhatsApp notifications?
**A:** Consider adding:
- Checkbox on booking form: "Send WhatsApp notifications"
- Store preference in database
- Check preference before sending

---

## Future Enhancements

### Q: What features could be added?
**A:** Potential enhancements:
- Appointment reminders (24 hours before)
- Rescheduling via WhatsApp
- Two-way communication
- Multi-language support
- Message templates in database
- Delivery status tracking
- Analytics dashboard
- Patient feedback collection

### Q: Can I add appointment reminders?
**A:** Yes! You could:
1. Create a Supabase Edge Function that runs daily
2. Query appointments for tomorrow
3. Send reminder messages
4. Use Supabase cron jobs or external scheduler

---

## Support

### Q: Where can I get help?
**A:** 
1. Check the documentation files:
   - `WHATSAPP_SETUP.md` - Setup guide
   - `TESTING_WHATSAPP.md` - Testing instructions
   - `WHATSAPP_FLOW_DIAGRAM.md` - Visual flow
2. Check browser console for errors
3. Review Supabase logs
4. Test with a known working phone number

### Q: How do I report a bug?
**A:** 
1. Note the exact steps to reproduce
2. Check browser console for errors
3. Verify phone number format
4. Test with different appointment
5. Document the issue with screenshots

---

**Still have questions?** Check the other documentation files or review the code in `src/lib/whatsapp.ts` and `src/pages/AdminDashboard.tsx`.
