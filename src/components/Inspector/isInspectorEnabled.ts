/**
 * The Inspector (Pinpoint) is an internal tool for leaving design/QA
 * comments on the running app — it is not meant for end users.
 *
 * On by default in local development, opt-in anywhere else (staging) via
 * NEXT_PUBLIC_ENABLE_INSPECTOR=true, and off in production unless that flag is
 * explicitly set. NEXT_PUBLIC_* values are inlined at build time, so this is
 * safe to read on the client.
 */
const flag = process.env.NEXT_PUBLIC_ENABLE_INSPECTOR;

export const isInspectorEnabled =
    flag === "true" || (flag !== "false" && process.env.NODE_ENV === "development");
