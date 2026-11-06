import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;

        // Ensure directory exists
        const uploadDir = join(process.cwd(), "public", "uploads", "comments");
        await mkdir(uploadDir, { recursive: true });

        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);

        const fileUrl = `/uploads/comments/${filename}`;

        return NextResponse.json({ url: fileUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
