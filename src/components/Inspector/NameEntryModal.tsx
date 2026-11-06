"use client";

import React, { useState } from "react";
import { useInspector } from "./InspectorProvider";

const NameEntryModal: React.FC = () => {
    const { userName, setUserName, isLoading } = useInspector();
    const [name, setName] = useState("");

    if (isLoading || userName) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            setUserName(name.trim());
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Welcome to Pinpoint</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                    Please enter your name to participate in the feedback session.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        autoFocus
                        type="text"
                        className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-brand-500"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-brand-600 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
                    >
                        Continue to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NameEntryModal;
