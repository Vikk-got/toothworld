import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const { phone, status, details, clinicPhone } = await req.json();
        const db = (await clientPromise).db(process.env.VITE_DB_NAME || "smile_schedule_db");

        // Log the notification to DB
        await db.collection("notifications").insertOne({
            phone,
            status,
            details,
            sentAt: new Date(),
            provider: 'whatsapp',
            success: true
        });

        // In a real production scenario, you'd use Twilio or Meta API here
        // For now, we return success so the frontend knows it was logged
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
