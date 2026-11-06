"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useInspector } from "./InspectorProvider";

const InspectorLayer: React.FC = () => {
    const { isInspectMode, setSelectedElement, setIsInspectMode, setShowComments } = useInspector();
    const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);

    const getSelector = (element: HTMLElement): string => {
        if (element.id) return `#${element.id}`;

        let path: string[] = [];
        let current: HTMLElement | null = element;

        while (current && current.tagName !== "BODY" && current.tagName !== "HTML") {
            let selector = current.tagName.toLowerCase();
            const parent: HTMLElement | null = current.parentElement;

            if (parent) {
                const siblings = Array.from(parent.children).filter(c => c.tagName === current!.tagName);
                if (siblings.length > 1) {
                    const index = siblings.indexOf(current) + 1;
                    selector += `:nth-of-type(${index})`;
                }
            }

            path.unshift(selector);
            current = parent;
        }
        return path.join(" > ");
    };

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isInspectMode) return;
            const target = e.target as HTMLElement;
            if (!target || target.closest(".inspector-ui")) {
                setHoveredRect(null);
                return;
            }
            setHoveredRect(target.getBoundingClientRect());
        },
        [isInspectMode]
    );

    const handleClick = useCallback(
        (e: MouseEvent) => {
            if (!isInspectMode) return;
            const target = e.target as HTMLElement;
            if (!target || target.closest(".inspector-ui")) return;

            e.preventDefault();
            e.stopPropagation();

            const rect = target.getBoundingClientRect();
            const selector = getSelector(target);

            const getElementLabel = (el: HTMLElement) => {
                const label = (el as HTMLInputElement).labels?.[0]?.innerText;
                const placeholder = (el as HTMLInputElement).placeholder;
                const value = (el as HTMLInputElement).value;
                const alt = (el as HTMLImageElement).alt;
                const ariaLabel = el.getAttribute('aria-label');
                const title = el.getAttribute('title');
                const text = label || placeholder || value || alt || ariaLabel || title || el.innerText || "";
                return text.slice(0, 50);
            }

            const getHumanName = (el: HTMLElement) => {
                const tag = el.tagName.toLowerCase();
                const role = el.getAttribute('role');
                if (role) return role;
                if (tag === 'a') return 'Link';
                if (tag === 'button') return 'Button';
                if (tag === 'input') return 'Input Field';
                if (tag === 'img') return 'Image';
                if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6') return 'Heading';
                if (tag === 'p') return 'Paragraph';
                if (tag === 'div' || tag === 'section' || tag === 'article') return 'Section';
                return 'Element';
            };

            const labelText = getElementLabel(target);

            setSelectedElement({
                tagName: getHumanName(target),
                id: target.id,
                className: target.className,
                rect,
                selector,
                innerText: labelText,
            });

            setIsInspectMode(false);
            setShowComments(true);
            setHoveredRect(null);
        },
        [isInspectMode, setSelectedElement, setIsInspectMode]
    );

    useEffect(() => {
        if (isInspectMode) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("click", handleClick, true);
            document.body.style.cursor = "crosshair";
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("click", handleClick, true);
            document.body.style.cursor = "default";
            setHoveredRect(null);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("click", handleClick, true);
            document.body.style.cursor = "default";
        };
    }, [isInspectMode, handleMouseMove, handleClick]);

    // Effect to highlight specific element when active (click)
    const { highlightedSelector } = useInspector();
    const [commentHighlightRect, setCommentHighlightRect] = useState<DOMRect | null>(null);

    const updateHighlightRect = useCallback(() => {
        if (!highlightedSelector) {
            setCommentHighlightRect(null);
            return;
        }
        try {
            const el = document.querySelector(highlightedSelector);
            if (el) {
                setCommentHighlightRect(el.getBoundingClientRect());
            } else {
                setCommentHighlightRect(null);
            }
        } catch (e) {
            setCommentHighlightRect(null);
        }
    }, [highlightedSelector]);

    useEffect(() => {
        if (highlightedSelector) {
            try {
                const el = document.querySelector(highlightedSelector);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(updateHighlightRect, 100);
                }
            } catch (e) { }
        }
        updateHighlightRect();

        const handleScroll = () => {
            requestAnimationFrame(updateHighlightRect);
        };

        window.addEventListener('scroll', handleScroll, { capture: true });
        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll, { capture: true });
            window.removeEventListener('resize', handleScroll);
        };
    }, [highlightedSelector, updateHighlightRect]);

    return (
        <>
            {/* Inspect Selection Box (Darker Indigo with thick left border) */}
            {hoveredRect && (
                <div
                    className="pointer-events-none fixed z-[10000] bg-indigo-600/10 border-indigo-600 transition-all duration-75"
                    style={{
                        left: hoveredRect.left,
                        top: hoveredRect.top,
                        width: hoveredRect.width,
                        height: hoveredRect.height,
                        borderTopWidth: '2px',
                        borderRightWidth: '2px',
                        borderBottomWidth: '2px',
                        borderLeftWidth: '6px', // Thick left border
                    }}
                />
            )}

            {/* Comment Highlight Box (Dashed Red) */}
            {commentHighlightRect && (
                <div
                    className="pointer-events-none fixed z-[10000] border-2 border-dashed border-red-600 bg-red-600/20 shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all duration-300 animate-pulse"
                    style={{
                        left: commentHighlightRect.left,
                        top: commentHighlightRect.top,
                        width: commentHighlightRect.width,
                        height: commentHighlightRect.height,
                    }}
                />
            )}
        </>
    );
};

export default InspectorLayer;
