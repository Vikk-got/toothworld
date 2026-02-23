# Testing WhatsApp Notifications

This guide will help you test the WhatsApp notification feature for appointment confirmations and cancellations.

## Quick Test (Current Setup)

The current implementation uses WhatsApp Web, which is perfect for immediate testing without any API setup.

### Steps to Test:

1. **Book a Test Appointment**
   - Go to the booking page
   - Fill in all details
   - **Important**: Use a real phone number with WhatsApp installed
   - Submit the appointment

2. **Login to Admin Dashboard**
   - Navigate to `/admin-login`
   - Login with admin credentials
   - Go to "Appointments" section

3. **Accept or Decline the Appointment**
   - Find the pending appointment
   - Click the ✓ (checkmark) button to accept
   - OR click the ✗ (X) button to decline

4. **WhatsApp Window Opens**
   - A new browser tab/window will open with WhatsApp Web
   - The message will be pre-filled with appointment details
   - **Click "Send"** to deliver the message to the patient

### Expected Behavior:

**When Accepting:**
- WhatsApp opens with confirmation message
- Message includes: ✅ emoji, appointment details, clinic contact
- Patient receives: "Your appointment is successfully confirmed"

**When Declining:**
- WhatsApp opens with cancellation message
- Message includes: ❌ emoji, cancelled appointment details
- Patient receives: "Your request has been cancelled"

## Testing Checklist

- [ ] Patient phone number is saved correctly in database
- [ ] Phone number format is valid (with or without country code)
- [ ] WhatsApp Web opens when accepting appointment
- [ ] WhatsApp Web opens when declining appointment
- [ ] Message is pre-filled correctly
- [ ] Clinic number (9479973877) appears in message
- [ ] Patient can receive the message
- [ ] Toast notification appears in admin dashboard

## Common Issues & Solutions

### Issue: WhatsApp doesn't open
**Solution**: 
- Check if popup blocker is enabled
- Allow popups for your domain
- Try a different browser

### Issue: Phone number format error
**Solution**:
- Ensure phone number includes country code
- Format: +919876543210 or 9876543210
- Remove spaces and special characters

### Issue: Message not pre-filled
**Solution**:
- Check browser console for errors
- Verify appointment data is complete
- Try refreshing the page

### Issue: Patient doesn't receive message
**Solution**:
- Verify patient has WhatsApp installed
- Check if phone number is correct
- Ensure you clicked "Send" in WhatsApp Web

## Testing with Different Phone Formats

Test with these formats to ensure compatibility:

```
✅ +919876543210
✅ 919876543210
✅ 9876543210
✅ +91 98765 43210
✅ +91-9876543210
```

All formats should work as the system cleans the number automatically.

## Production Testing (With API)

If you've set up the Supabase Edge Function or API integration:

1. **Enable Edge Function**
   ```typescript
   // In src/lib/whatsapp.ts
   const USE_EDGE_FUNCTION = true;
   ```

2. **Deploy Edge Function**
   ```bash
   supabase functions deploy send-whatsapp
   ```

3. **Set Environment Variables**
   ```bash
   supabase secrets set TWILIO_ACCOUNT_SID=your_sid
   supabase secrets set TWILIO_AUTH_TOKEN=your_token
   ```

4. **Test the Flow**
   - Book appointment
   - Accept/decline in admin
   - Message sends automatically (no manual click needed)
   - Check Twilio/MessageBird dashboard for delivery status

## Monitoring

### Check Logs:
```bash
# For Edge Function
supabase functions logs send-whatsapp

# For browser console
# Open DevTools > Console
# Look for: "WhatsApp notification URL: ..."
```

### Verify in Database:
```sql
-- Check appointments with phone numbers
SELECT id, patient, patient_phone, status 
FROM appointments 
WHERE patient_phone IS NOT NULL;
```

## Performance Testing

Test with multiple appointments:
1. Create 5-10 test appointments
2. Accept/decline them in quick succession
3. Verify all WhatsApp windows open correctly
4. Check for any rate limiting issues

## Security Testing

- [ ] Verify phone numbers are validated
- [ ] Check that only admins can trigger notifications
- [ ] Ensure patient data is not exposed in URLs
- [ ] Test with invalid phone numbers
- [ ] Verify error handling works correctly

## Next Steps After Testing

1. ✅ Confirm basic functionality works
2. ✅ Test with real patient data (with permission)
3. ✅ Decide on production approach (manual vs API)
4. ✅ Set up monitoring and logging
5. ✅ Train staff on the new feature
6. ✅ Create user documentation
7. ✅ Go live!

## Support

If you encounter issues:
1. Check browser console for errors
2. Review WHATSAPP_SETUP.md for configuration
3. Verify Supabase connection
4. Test with a different phone number
5. Check WhatsApp Web is accessible

## Success Criteria

✅ Appointments can be accepted/declined
✅ WhatsApp opens with correct message
✅ Patient receives notification
✅ Admin sees confirmation toast
✅ No errors in console
✅ Works on different browsers
✅ Phone number formats are handled correctly
