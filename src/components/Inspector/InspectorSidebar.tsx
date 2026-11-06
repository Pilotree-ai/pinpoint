"use client";

import React, { useState, useEffect } from "react";
import { useInspector } from "./InspectorProvider";
import { saveComment, fetchComments, Comment } from "@/app/actions/comments";
import { usePathname } from "next/navigation";

const InspectorSidebar: React.FC = () => {
    const { selectedElement, setSelectedElement, userName, isInspectMode, setIsInspectMode, setHighlightedSelector, highlightedSelector } = useInspector();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const pathname = usePathname();

    const loadComments = async () => {
        const data = await fetchComments(pathname);
        setComments(data);
    };

    useEffect(() => {
        loadComments();
    }, [pathname]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setUploadedImageUrl(data.url);
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newComment.trim() && !uploadedImageUrl) || !userName) return;

        setIsSubmitting(true);
        try {
            await saveComment({
                text: newComment,
                author_name: userName,
                selector: selectedElement?.selector,
                element_info: selectedElement
                    ? `${selectedElement.tagName}${selectedElement.id ? "#" + selectedElement.id : ""} ${selectedElement.innerText ? `("${selectedElement.innerText}")` : ""}`
                    : undefined,
                page_url: pathname,
                image_url: uploadedImageUrl || undefined,
            });
            setNewComment("");
            setUploadedImageUrl(null);
            setSelectedElement(null);
            await loadComments();
        } catch (error) {
            console.error("Failed to save comment", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="inspector-ui flex h-full flex-col border-l border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pinpoint</h2>
                <button
                    onClick={() => setIsInspectMode(!isInspectMode)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${isInspectMode
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                >
                    {isInspectMode ? "Selecting..." : "Inspect Element"}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {selectedElement ? (
                    <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase text-primary">Context</span>
                            <button
                                onClick={() => setSelectedElement(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="rounded bg-gray-50 p-3 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200 border border-indigo-100 dark:border-indigo-900/30">
                            {selectedElement.innerText ? (
                                <div className="font-medium text-indigo-700 dark:text-indigo-300">
                                    "{selectedElement.innerText}"
                                </div>
                            ) : (
                                <div className="font-medium text-gray-500 capitalize">
                                    {selectedElement.tagName} Element
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500 italic dark:border-gray-700 dark:bg-gray-800">
                        Select an element to add specific feedback, or leave a general comment below.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mb-8">
                    {uploadedImageUrl && (
                        <div className="relative mb-2 rounded-lg border border-gray-200 overflow-hidden w-fit group">
                            <img src={uploadedImageUrl} alt="Upload preview" className="h-20 w-auto object-cover" />
                            <button
                                type="button"
                                onClick={() => setUploadedImageUrl(null)}
                                className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                </svg>
                            </button>
                        </div>
                    )}
                    <textarea
                        autoFocus={!!selectedElement}
                        className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        placeholder={selectedElement ? "What change is needed here?" : "General feedback..."}
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="mt-3 flex gap-2">
                        <label className="flex items-center justify-center p-2 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                            </svg>
                        </label>
                        <button
                            disabled={isSubmitting || (!newComment.trim() && !uploadedImageUrl)}
                            type="submit"
                            className="flex-1 rounded-md bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg disabled:opacity-50 disabled:shadow-none"
                        >
                            {isSubmitting ? "Saving..." : "Save Comment"}
                        </button>
                    </div>
                </form>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Recent Feedback</h3>
                    {comments.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">No feedback yet.</p>
                    ) : (
                        comments.map((comment) => {
                            const isCurrentPage = comment.page_url === pathname;
                            const canHighlight = comment.selector && isCurrentPage;

                            return (
                            <div
                                key={comment.id}
                                className={`rounded-lg border bg-white p-3 shadow-sm transition-all hover:shadow-md ${canHighlight ? 'cursor-pointer' : 'cursor-default'} group ${highlightedSelector === comment.selector && isCurrentPage
                                    ? "border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                                    : "border-gray-200 hover:border-indigo-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-400"
                                    }`}
                                onClick={() => {
                                    if (canHighlight) {
                                        setHighlightedSelector(highlightedSelector === comment.selector ? null : comment.selector);
                                    }
                                }}
                            >
                                <div className="mb-1 flex items-center justify-between">
                                    <span className="font-bold text-gray-900 dark:text-white">{comment.author_name}</span>
                                    <span className="text-[10px] text-gray-400">{new Date(comment.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comment.text}</p>
                                {comment.image_url && (
                                    <div className="mt-2 relative group/image">
                                        <img src={comment.image_url} alt="Attachment" className="max-h-40 rounded border border-gray-200 dark:border-gray-600" />
                                        <a
                                            href={comment.image_url}
                                            download
                                            target="_blank"
                                            onClick={(e) => e.stopPropagation()}
                                            className="absolute bottom-2 right-2 bg-white/90 dark:bg-gray-800/90 p-1.5 rounded-full shadow-sm opacity-0 group-hover/image:opacity-100 transition-opacity hover:scale-110"
                                            title="Download Image"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-700 dark:text-gray-300">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                            </svg>
                                        </a>
                                    </div>
                                )}
                                {comment.element_info && (
                                    <div className="mt-2 flex items-center gap-1">
                                        <span className="text-[10px] font-mono text-primary bg-primary/10 px-1 rounded group-hover:bg-indigo-100 group-hover:text-indigo-700">
                                            {comment.element_info}
                                        </span>
                                        {comment.page_url && (
                                            <a
                                                href={comment.page_url}
                                                className="text-[10px] text-gray-400 hover:text-indigo-600 hover:underline truncate max-w-[150px]"
                                                title={`Go to ${comment.page_url}`}
                                            >
                                                {comment.page_url}
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default InspectorSidebar;
