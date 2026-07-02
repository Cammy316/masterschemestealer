# Name: Next.js 16 & Tailwind 4 Strict
# Description: Enforces modern Next.js App Router and Tailwind CSS best practices for UI generation.

## Guidelines
- Always use the Next.js 16 App Router (`app/` directory). Do not use the legacy Pages router.
- Use React Server Components by default. Only append `"use client"` when React hooks (`useState`, `useRef`, Zustand) or browser DOM APIs are strictly necessary.
- For styling, exclusively use Tailwind CSS utility classes. Do not generate custom CSS files or write inline styles unless absolutely unavoidable.
- Enforce the "SchemeStealer" aesthetic: default to dark backgrounds (e.g., `bg-gray-950`), use high-contrast neon accents for active states, and maintain strict mobile-first responsiveness using Tailwind breakpoints.
- When generating React components, map visual constraints directly to Flexbox and CSS Grid.