import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.VITE_DB_NAME || "smile_schedule_db");

        // --- Auth Setup ---
        const adminEmail = "admin@dentacare.com";
        let admin = await db.collection("users").findOne({ email: adminEmail });
        let adminId;

        if (!admin) {
            const result = await db.collection("users").insertOne({
                email: adminEmail,
                password: "admin123",
                name: "Admin User",
                created_at: new Date()
            });
            adminId = result.insertedId;
        } else {
            adminId = admin._id;
        }

        const role = await db.collection("user_roles").findOne({
            user_id: adminId,
            role: "admin"
        });

        if (!role) {
            await db.collection("user_roles").insertOne({
                user_id: adminId,
                role: "admin"
            });
        }

        // --- Dentist Seeding ---
        const defaultDentists = [
            { id: 1, name: "Dr. Meena Maya", specialty: "General Dentistry", avatar: "👩‍⚕️" },
            { id: 2, name: "Dr. Rajesh Kumar", specialty: "Orthodontics", avatar: "👨‍⚕️" },
            { id: 3, name: "Dr. Sarah Wilson", specialty: "Pediatric Dentistry", avatar: "👩‍⚕️" }
        ];

        for (const d of defaultDentists) {
            const exists = await db.collection("dentists").findOne({ name: d.name });
            if (!exists) {
                await db.collection("dentists").insertOne(d);
            }
        }

        // --- Database Repair/Migration ---
        // Repair blocked_slots (Convert string dentist_id to ObjectId)
        const slots = await db.collection("blocked_slots").find({
            dentist_id: { $type: "string" }
        }).toArray();

        for (const slot of slots) {
            if (slot.dentist_id.length === 24) {
                try {
                    await db.collection("blocked_slots").updateOne(
                        { _id: slot._id },
                        { $set: { dentist_id: new ObjectId(slot.dentist_id) } }
                    );
                } catch (e) { }
            }
        }

        // Repair appointments
        const appointments = await db.collection("appointments").find({
            dentist_id: { $type: "string" }
        }).toArray();

        for (const apt of appointments) {
            if (apt.dentist_id?.length === 24) {
                try {
                    await db.collection("appointments").updateOne(
                        { _id: apt._id },
                        { $set: { dentist_id: new ObjectId(apt.dentist_id) } }
                    );
                } catch (e) { }
            }
        }

        return NextResponse.json({
            message: "Setup and Database Repair complete",
            adminEmail,
            dentistsEnsured: defaultDentists.length,
            repairedSlots: slots.length,
            repairedAppointments: appointments.length
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
