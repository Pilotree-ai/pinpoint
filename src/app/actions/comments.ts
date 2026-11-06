"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export type Comment = {
    id: number;
    text: string;
    author_name: string;
    selector: string | null;
    element_info: string | null;
    page_url: string | null;
    image_url: string | null;
    timestamp: string;
};

export async function saveComment(data: {
    text: string;
    author_name: string;
    selector?: string;
    element_info?: string;
    page_url?: string;
    image_url?: string;
}) {
    const { text, author_name, selector, element_info, page_url, image_url } = data;

    const stmt = db.prepare(`
    INSERT INTO comments (text, author_name, selector, element_info, page_url, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

    stmt.run(text, author_name, selector || null, element_info || null, page_url || null, image_url || null);

    revalidatePath("/");
    return { success: true };
}

export async function fetchComments(pageUrl?: string) {
    let query = "SELECT * FROM comments ORDER BY timestamp DESC";
    let params: any[] = [];

    if (pageUrl) {
        query = "SELECT * FROM comments WHERE page_url = ? ORDER BY timestamp DESC";
        params = [pageUrl];
    }

    const stmt = db.prepare(query);
    const rows = stmt.all(...params) as Comment[];

    return rows;
}
