import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const stmt = db.prepare("INSERT INTO visitors (name) VALUES (?)");
        const info = stmt.run(name);

        return NextResponse.json({ id: info.lastInsertRowid, name });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to save visitor" }, { status: 500 });
    }
}
