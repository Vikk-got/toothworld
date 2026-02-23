# WhatsApp Notification Flow

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     PATIENT BOOKING FLOW                         │
└─────────────────────────────────────────────────────────────────┘

    Patient                 Website              Supabase DB
       │                       │                      │
       │  1. Fill booking form │                      │
       ├──────────────────────>│                      │
       │                       │                      │
       │                       │  2. Save appointment │
       │                       ├─────────────────────>│
       │                       │     (with phone)     │
       │                       │                      │
       │  3. Confirmation page │                      │
       │<──────────────────────┤                      │
       │                       │                      │


┌─────────────────────────────────────────────────────────────────┐
│                  ADMIN NOTIFICATION FLOW                         │
└─────────────────────────────────────────────────────────────────┘

    Admin                  Dashboard            Supabase DB        WhatsApp
      │                       │                      │                │
      │  1. View appointments │                      │                │
      ├──────────────────────>│                      │                │
      │                       │  2. Fetch data       │                │
      │                       ├─────────────────────>│                │
      │                       │                      │                │
      │  3. Click ✓ or ✗     │                      │                │
      ├──────────────────────>│                      │                │
      │                       │                      │                │
      │                       │  4. Update status    │                │
      │                       ├─────────────────────>│                │
      │                       │                      │                │
      │                       │  5. Trigger WhatsApp │                │
      │                       │     notification     │                │
      │                       ├──────────────────────┼───────────────>│
      │                       │                      │   (opens Web)  │
      │                       │                      │                │
      │  6. WhatsApp opens    │                      │                │
      │     with message      │                      │                │
      │<──────────────────────┤                      │                │
      │                       │                      │                │
      │  7. Click "Send"      │                      │                │
      ├──────────────────────────────────────────────┼───────────────>│
      │                       │                      │                │
      │                       │                      │  8. Deliver to │
      │                       │                      │     patient    │
      │                       │                      │                ▼
      │                       │                      │            Patient
      │                       │                      │            receives
      │                       │                      │            message
```

## 🔄 Detailed Step-by-Step Flow

### Phase 1: Appointment Booking
```
1. Patient visits booking page
   └─> Fills form (name, email, phone, etc.)
   └─> Submits appointment request

2. System saves to database
   └─> Status: "pending"
   └─> Phone number stored in patient_phone field

3. Patient sees confirmation
   └─> "Appointment Booked!" message
```

### Phase 2: Admin Review
```
1. Admin logs into dashboard
   └─> Navigates to "Appointments" section
   └─> Sees list of pending appointments

2. Admin reviews appointment
   └─> Sees patient details including phone number
   └─> Decides to accept or decline
```

### Phase 3: WhatsApp Notification (Current Browser-Based)
```
1. Admin clicks ✓ (accept) or ✗ (decline)
   └─> updateAppointmentStatus() called
   └─> Status updated in database

2. sendWhatsAppNotification() triggered
   └─> Cleans phone number
   └─> Generates message based on status
   └─> Creates WhatsApp Web URL

3. Browser opens new tab
   └─> WhatsApp Web loads
   └─> Message pre-filled
   └─> Admin clicks "Send"

4. Patient receives notification
   └─> WhatsApp message delivered
   └─> Patient sees appointment status
```

### Phase 3 Alternative: Production API Flow
```
1. Admin clicks ✓ or ✗
   └─> updateAppointmentStatus() called
   └─> Status updated in database

2. sendWhatsAppNotification() triggered
   └─> Calls Supabase Edge Function
   └─> Edge function calls WhatsApp API (Twilio/MessageBird)

3. API sends message automatically
   └─> No manual intervention needed
   └─> Delivery status returned

4. Patient receives notification
   └─> WhatsApp message delivered instantly
   └─> Admin sees success toast
```

## 🎯 Key Components

### Frontend (React)
```typescript
// src/pages/AdminDashboard.tsx
updateAppointmentStatus(id, status)
  ├─> Updates database
  └─> Calls sendWhatsAppNotification()

// src/lib/whatsapp.ts
sendWhatsAppNotification(phone, status, details)
  ├─> Cleans phone number
  ├─> Generates message
  └─> Opens WhatsApp Web OR calls API
```

### Backend (Supabase)
```sql
-- appointments table
id, patient, patient_email, patient_phone,
dentist, date, time, service, status

-- Status values:
- "pending"   → Waiting for admin
- "confirmed" → Admin accepted
- "cancelled" → Admin declined
```

### WhatsApp Integration
```
Current: Browser-based (WhatsApp Web)
  └─> Opens wa.me URL with pre-filled message
  └─> Requires manual send

Future: API-based (Automated)
  └─> Calls WhatsApp Business API
  └─> Fully automated delivery
```

## 📱 Message Flow

```
┌──────────────────────────────────────────────────────────┐
│                    MESSAGE TEMPLATE                       │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Status: confirmed                                        │
│  ├─> ✅ Appointment Confirmed ✅                         │
│  ├─> Hello [Patient Name]!                               │
│  ├─> Your appointment has been confirmed.                │
│  ├─> Details: [Dentist, Date, Time, Service]            │
│  └─> Contact: 9479973877                                 │
│                                                           │
│  Status: cancelled                                        │
│  ├─> ❌ Appointment Cancelled ❌                         │
│  ├─> Hello [Patient Name],                               │
│  ├─> Your appointment has been cancelled.                │
│  ├─> Details: [Dentist, Date, Time, Service]            │
│  └─> Contact: 9479973877                                 │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## 🔐 Security Flow

```
1. Authentication Check
   └─> Only logged-in admins can update appointments
   └─> Supabase RLS policies enforce access control

2. Phone Number Validation
   └─> Clean and format phone number
   └─> Remove special characters
   └─> Validate format

3. Data Privacy
   └─> Phone numbers not exposed in URLs (API mode)
   └─> Messages sent directly to patient
   └─> No data leakage

4. Error Handling
   └─> Failed sends show error toast
   └─> Appointment still updated
   └─> Logs for debugging
```

## 🚀 Upgrade Path

```
Current State:
  Browser-based → Manual send → Free

Upgrade Option 1:
  Add Twilio API → Automated → ~$0.01/msg

Upgrade Option 2:
  Add MessageBird → Automated → ~$0.01/msg

Upgrade Option 3:
  WhatsApp Business API → Automated → Variable cost
```

---

**Legend:**
- `│` = Flow direction
- `├─>` = Action/Step
- `└─>` = Result/Outcome
- `▼` = Continues below
