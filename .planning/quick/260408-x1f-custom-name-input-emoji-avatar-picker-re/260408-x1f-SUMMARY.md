# Quick Task 260408-x1f: Custom Name + Emoji Avatar, Remove Themes

## Summary

Updated Settings Modal in `app/page.tsx`: removed theme system, added custom name input with validation, and emoji avatar picker.

## Changes

### Removed
- `THEMES` constant object (Void/Crimson/Matrix)
- `ThemeKey` type alias
- `currentTheme` state
- `applyTheme()` function + `useCallback` import
- Theme restore `useEffect`
- Theme Toggle section in Settings Modal
- `initialsFromName()` function (no longer needed)

### Added
- `GHOST_AVATARS` array — 20 emoji options (👻🐺🦊🐉🦅🦇🐍🦁🐯🦈🦂🐙🦋🐦‍⬛🦎🐸🦉🦚🐲🔮)
- `customName`, `nameError`, `nameSaved`, `selectedAvatar` states
- `saveCustomName()` — validates (empty/length/charset), saves to Supabase metadata, reloads after 1.2s
- `saveAvatar()` — saves to localStorage + Supabase metadata
- Avatar restore `useEffect` on mount
- **Custom Name Input** section — with `>` prompt prefix, Enter-to-submit, char counter, validation errors, green success state
- **Avatar Picker** grid — 5×4 grid with hover scale, selected glow effect, Reset button
- **Sidebar** user card now shows `selectedAvatar || '👻'` instead of text initials
- **Own messages** show selected avatar emoji next to bubble
- **Others' messages** show default 👻 emoji instead of text initials
- Modal close button resets name input state
- Sticky modal header that stays visible while scrolling

## Verification
- `npx next build` — ✅ compiled successfully, 0 errors, 0 warnings
- Committed as `df2d574`
