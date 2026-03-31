# Digital Visiting Card - GitHub Pages Compatibility Fix

## Current State
The app is a React/Vite PWA deployed on Caffeine (ICP) at root `/`. All asset paths use absolute URLs starting with `/`, which work fine at root but break when hosted under a subfolder like GitHub Pages' `/digital-visiting-card/` path.

## Requested Changes (Diff)

### Add
- `.github/workflows/deploy.yml`: GitHub Actions workflow that builds the app with `VITE_BASE_URL=/digital-visiting-card/` and deploys to GitHub Pages
- `src/frontend/public/.nojekyll`: Empty file to disable Jekyll processing on GitHub Pages (required for files/folders starting with `_`)

### Modify
- `src/frontend/vite.config.js`: Add `base: process.env.VITE_BASE_URL || '/'` so the build adapts to the deployment environment
- `src/frontend/src/App.tsx`: Change hardcoded `/assets/uploads/...` profile image path to use `import.meta.env.BASE_URL` so it resolves correctly in both root and subfolder deployments
- `src/frontend/public/manifest.json`: Change icon `src` and `start_url` to relative paths (no leading `/`) so they resolve correctly regardless of subfolder
- `src/frontend/public/sw.js`: Use `self.registration.scope` for cache URLs so the service worker works correctly in both environments

### Remove
- Nothing removed

## Implementation Plan
1. Update `vite.config.js` to read base from `VITE_BASE_URL` env var (defaults to `/` for Caffeine)
2. Update `App.tsx` profile image src to use `import.meta.env.BASE_URL` prefix
3. Update `manifest.json` to use relative paths for icons and start_url
4. Update `sw.js` to use `self.registration.scope` instead of hardcoded `/`
5. Add `.nojekyll` to public folder
6. Add GitHub Actions workflow with correct build env and pages deployment
