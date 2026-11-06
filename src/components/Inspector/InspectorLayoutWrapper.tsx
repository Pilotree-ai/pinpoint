"use client";

import React from "react";
import { useInspector } from "./InspectorProvider";
import InspectorSidebar from "./InspectorSidebar";
import InspectorLayer from "./InspectorLayer";
import NameEntryModal from "./NameEntryModal";
import { isInspectorEnabled } from "./isInspectorEnabled";
import { usePathname } from "next/navigation";

const InspectorLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { showComments, setShowComments } = useInspector();
    const pathname = usePathname();

    // Keep the layout shell identical when the Inspector is off — pages depend on
    // #inspector-scroll-container for scrolling — and drop only the review UI.
    const inspectorVisible = isInspectorEnabled;

    return (
        <div className="relative flex h-screen w-screen overflow-hidden">
            {/* Main Content Area */}
            <div className={`flex flex-1 flex-col overflow-hidden transition-all duration-300`}>
                <div className="relative flex-1 overflow-auto bg-white dark:bg-gray-900" id="inspector-scroll-container">
                    {children}
                    {inspectorVisible && <InspectorLayer />}
                </div>

                {/* Toggle Button (Floating) */}
                {inspectorVisible && !showComments && (
                    <button
                        onClick={() => setShowComments(true)}
                        className="fixed bottom-6 right-6 z-[9997] flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl transition-all hover:scale-110 hover:bg-indigo-700"
                        title="Open Pinpoint"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                            />
                        </svg>
                    </button>
                )}
            </div>

            {/* Chrome-like Console Sidebar */}
            {inspectorVisible && showComments && (
                <div className="w-[400px] flex-shrink-0 animate-slide-in-right relative">
                    <button
                        onClick={() => setShowComments(false)}
                        className="absolute left-0 top-1/2 -ml-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-md hover:text-gray-600 dark:border-gray-700 dark:bg-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                    <InspectorSidebar />
                </div>
            )}

            {/* Common Inspector Elements */}
            {inspectorVisible && pathname !== "/" && <NameEntryModal />}
        </div>
    );
};

export default InspectorLayoutWrapper;
