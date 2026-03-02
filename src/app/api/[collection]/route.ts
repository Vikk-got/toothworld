import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function getDb() {
    const client = await clientPromise;
    return client.db(process.env.VITE_DB_NAME || "smile_schedule_db");
}

function convertObjectIds(obj: any) {
    if (!obj || typeof obj !== 'object') return obj;
    for (const key in obj) {
        const val = obj[key];
        if (typeof val === 'string' && val.length === 24) {
            if (key === '_id' || key.endsWith('_id') || key.toLowerCase().includes('userid')) {
                try {
                    obj[key] = new ObjectId(val);
                } catch (e) { /* ignore */ }
            }
        } else if (val && typeof val === 'object') {
            if (val.$in && Array.isArray(val.$in)) {
                val.$in = val.$in.map((v: any) =>
                    (typeof v === 'string' && v.length === 24) ? new ObjectId(v) : v
                );
            } else {
                convertObjectIds(val);
            }
        }
    }
    return obj;
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ collection: string }> }
) {
    try {
        const { collection } = await params;
        const db = await getDb();

        const { searchParams } = new URL(req.url);
        const filter = searchParams.get("filter") ? JSON.parse(searchParams.get("filter")!) : {};
        const sort = searchParams.get("sort") ? JSON.parse(searchParams.get("sort")!) : {};
        const limit = parseInt(searchParams.get("limit") || "0");

        convertObjectIds(filter);

        let query = db.collection(collection).find(filter).sort(sort);
        if (limit > 0) query = query.limit(limit);

        const data = await query.toArray();
        return NextResponse.json({ data, error: null });
    } catch (error: any) {
        return NextResponse.json({ data: null, error: error.message }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ collection: string }> }
) {
    try {
        const { collection } = await params;
        const db = await getDb();
        const body = await req.json();

        if (body.operation === 'findOne' || body.filter) {
            const filter = body.filter || {};
            convertObjectIds(filter);
            const data = await db.collection(collection).findOne(filter);
            return NextResponse.json({ data, error: null });
        }

        // Default to insertOne for legacy compatibility or if specified
        const doc = body.document || body;
        convertObjectIds(doc);
        const result = await db.collection(collection).insertOne(doc);
        return NextResponse.json({ data: { ...doc, _id: result.insertedId }, error: null });
    } catch (error: any) {
        return NextResponse.json({ data: null, error: error.message }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ collection: string }> }
) {
    try {
        const { collection } = await params;
        const db = await getDb();
        const body = await req.json();
        const filter = body.filter || {};
        convertObjectIds(filter);

        const update = body.update || {};
        // If it's a plain update, wrap it in $set
        const finalUpdate = update.$set || update.$push || update.$pull ? update : { $set: update };

        const result = await db.collection(collection).findOneAndUpdate(
            filter,
            finalUpdate,
            { returnDocument: 'after' }
        );

        return NextResponse.json({ data: result, error: null });
    } catch (error: any) {
        return NextResponse.json({ data: null, error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ collection: string }> }
) {
    try {
        const { collection } = await params;
        const db = await getDb();
        const body = await req.json();
        const filter = body.filter || {};
        convertObjectIds(filter);

        const result = await db.collection(collection).deleteOne(filter);
        return NextResponse.json({ data: result, error: null });
    } catch (error: any) {
        return NextResponse.json({ data: null, error: error.message }, { status: 500 });
    }
}
