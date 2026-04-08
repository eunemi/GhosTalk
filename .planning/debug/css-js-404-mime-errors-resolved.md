# Debug: CSS/JS 404 MIME Errors — RESOLVED

**Status:** ✅ Resolved
**Date:** 2026-04-08
**Severity:** Critical (App completely non-functional)

## Symptoms
- CSS files refused: MIME type `text/plain` not supported
- JS chunks returning 404: `main-app.js`, `app-pages-internals.js`, `page.js`
- Scripts refused: MIME type `text/plain` not executable
- Favicon returning 500

## Root Cause
Corrupt `.next` build cache. The compiled CSS/JS chunk files in `.next/static/` were either missing, stale, or had mismatched build IDs. Combined with the `X-Content-Type-Options: nosniff` security header in `next.config.ts`, the browser strictly rejected any resources served with wrong MIME types.

## Fix Applied
1. Deleted `.next` build cache
2. Deleted `node_modules` and `package-lock.json`
3. Fresh `npm install` (635 packages, 0 vulnerabilities)
4. Fresh `npm run build` — passed cleanly, all routes compiled

## Verification
- `npm run dev` → server started on port 3001
- `GET / 200` — page loads correctly
- `GET /favicon.ico 200` — favicon loads (was 500 before)
- Browser screenshot confirms full UI rendering with CSS applied
- Zero MIME type errors in console
- Settings modal, rooms, chat — all functional

## Notes
- `next.config.ts` has `X-Content-Type-Options: nosniff` on all routes — this is a good security practice but makes stale build caches more visible as errors (browser won't guess MIME types)
- No code changes were needed — purely a build cache issue
