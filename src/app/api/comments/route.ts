import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { text, page_url, author_name, selector, element_info } = await request.json();

        if (!text) {
            return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
        }
        if (!author_name) {
            return NextResponse.json({ error: "Author name is required" }, { status: 400 });
        }

        const stmt = db.prepare("INSERT INTO comments (text, author_name, selector, element_info, page_url) VALUES (?, ?, ?, ?, ?)");
        const info = stmt.run(text, author_name, selector || null, element_info || null, page_url || null);

        return NextResponse.json({
            id: info.lastInsertRowid,
            text,
            author_name,
            selector,
            element_info
        });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to save comment" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const comments = db.prepare("SELECT * FROM comments ORDER BY timestamp DESC").all();
        return NextResponse.json(comments);
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}
