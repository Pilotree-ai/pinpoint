"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SelectedElement {
    tagName: string;
    id: string;
    className: string;
    rect: DOMRect;
    selector: string;
    innerText?: string;
}

interface InspectorContextType {
    isInspectMode: boolean;
    setIsInspectMode: (active: boolean) => void;
    selectedElement: SelectedElement | null;
    setSelectedElement: (element: SelectedElement | null) => void;
    userName: string | null;
    setUserName: (name: string) => void;
    showComments: boolean;
    setShowComments: (show: boolean) => void;
    isLoading: boolean;
    highlightedSelector: string | null;
    setHighlightedSelector: (selector: string | null) => void;
}

const InspectorContext = createContext<InspectorContextType | undefined>(undefined);

export const InspectorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isInspectMode, setIsInspectMode] = useState(false);
    const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
    const [userName, setUserNameState] = useState<string | null>(null);
    const [showComments, setShowComments] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [highlightedSelector, setHighlightedSelector] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const storedName = localStorage.getItem("inspector_user_name");
        if (storedName) {
            setUserNameState(storedName);
        }
        setIsLoading(false);
    }, []);

    // Clear highlight when navigating to a different page
    useEffect(() => {
        setHighlightedSelector(null);
    }, [pathname]);

    const setUserName = (name: string) => {
        localStorage.setItem("inspector_user_name", name);
        setUserNameState(name);

        // Save visitor to backend
        fetch("/api/visitors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        }).catch((err) => console.error("Failed to save visitor", err));
    };

    return (
        <InspectorContext.Provider
            value={{
                isInspectMode,
                setIsInspectMode,
                selectedElement,
                setSelectedElement,
                userName,
                setUserName,
                showComments,
                setShowComments,
                isLoading,
                highlightedSelector,
                setHighlightedSelector,
            }}
        >
            {children}
        </InspectorContext.Provider>
    );
};

export const useInspector = () => {
    const context = useContext(InspectorContext);
    if (context === undefined) {
        throw new Error("useInspector must be used within an InspectorProvider");
    }
    return context;
};
