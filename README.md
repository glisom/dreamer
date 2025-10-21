# Dreamer

Mystical journaling companion bootstrapped with Expo and TypeScript.

## Getting started

```bash
npm install
npm run start
```

Additional scripts:

- `npm run lint` – run ESLint across the project
- `npm run format` – format with Prettier
- `npm run format:check` – verify formatting
- `npm run typecheck` – run the TypeScript compiler without emitting output
- `npm run ci:check` – execute linting, formatting check, and type-checking

## Project structure

- `App.tsx` – application entry that wires providers and navigation
- `src/app/providers` – shared providers for settings and theming
- `src/theme` – design tokens (colors, typography)
- `src/navigation` – navigation stacks and tabs
- `src/components/ui` – reusable layout primitives with global styling
- `src/screens` – screen components used by navigation
