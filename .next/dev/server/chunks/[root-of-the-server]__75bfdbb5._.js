module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Desktop/smile-schedule-dash/src/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$mongodb$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs, [project]/Desktop/smile-schedule-dash/node_modules/mongodb)");
;
if (!process.env.VITE_MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env');
}
const uri = process.env.VITE_MONGODB_URI;
const options = {};
let client;
let clientPromise;
if ("TURBOPACK compile-time truthy", 1) {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!/*TURBOPACK member replacement*/ __turbopack_context__.g._mongoClientPromise) {
        client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$mongodb$29$__["MongoClient"](uri, options);
        /*TURBOPACK member replacement*/ __turbopack_context__.g._mongoClientPromise = client.connect();
    }
    clientPromise = /*TURBOPACK member replacement*/ __turbopack_context__.g._mongoClientPromise;
} else //TURBOPACK unreachable
;
const __TURBOPACK__default__export__ = clientPromise;
}),
"[project]/Desktop/smile-schedule-dash/src/app/api/auth/setup/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/smile-schedule-dash/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smile$2d$schedule$2d$dash$2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/smile-schedule-dash/src/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$mongodb$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs, [project]/Desktop/smile-schedule-dash/node_modules/mongodb)");
;
;
;
async function GET() {
    try {
        const client = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smile$2d$schedule$2d$dash$2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"];
        const db = client.db(process.env.VITE_DB_NAME || "smile_schedule_db");
        // --- Auth Setup ---
        const adminEmail = "admin@dentacare.com";
        let admin = await db.collection("users").findOne({
            email: adminEmail
        });
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
            {
                id: 1,
                name: "Dr. Meena Maya",
                specialty: "General Dentistry",
                avatar: "👩‍⚕️"
            },
            {
                id: 2,
                name: "Dr. Rajesh Kumar",
                specialty: "Orthodontics",
                avatar: "👨‍⚕️"
            },
            {
                id: 3,
                name: "Dr. Sarah Wilson",
                specialty: "Pediatric Dentistry",
                avatar: "👩‍⚕️"
            }
        ];
        for (const d of defaultDentists){
            const exists = await db.collection("dentists").findOne({
                name: d.name
            });
            if (!exists) {
                await db.collection("dentists").insertOne(d);
            }
        }
        // --- Database Repair/Migration ---
        // Repair blocked_slots (Convert string dentist_id to ObjectId)
        const slots = await db.collection("blocked_slots").find({
            dentist_id: {
                $type: "string"
            }
        }).toArray();
        for (const slot of slots){
            if (slot.dentist_id.length === 24) {
                try {
                    await db.collection("blocked_slots").updateOne({
                        _id: slot._id
                    }, {
                        $set: {
                            dentist_id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$mongodb$29$__["ObjectId"](slot.dentist_id)
                        }
                    });
                } catch (e) {}
            }
        }
        // Repair appointments
        const appointments = await db.collection("appointments").find({
            dentist_id: {
                $type: "string"
            }
        }).toArray();
        for (const apt of appointments){
            if (apt.dentist_id?.length === 24) {
                try {
                    await db.collection("appointments").updateOne({
                        _id: apt._id
                    }, {
                        $set: {
                            dentist_id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$mongodb$29$__["ObjectId"](apt.dentist_id)
                        }
                    });
                } catch (e) {}
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Setup and Database Repair complete",
            adminEmail,
            dentistsEnsured: defaultDentists.length,
            repairedSlots: slots.length,
            repairedAppointments: appointments.length
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__75bfdbb5._.js.map