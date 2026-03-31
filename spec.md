# InstaSite Kerala - Dynamic Digital Card

## Current State
The app is a static React component with all profile data hardcoded in App.tsx (name, title, phone, email, location, buttons, QR). The backend has a basic Card type but it is not wired to the frontend. There is no admin login and no way to edit the card without rebuilding.

## Requested Changes (Diff)

### Add
- Admin login via Internet Identity (authorization component)
- Admin panel: edit all card fields (name, title, company, bio, phone, email, location, website) and upload profile photo
- Blob storage for profile photo (blob-storage component)
- Public card view reads live data from the backend canister
- Loading state while fetching card data
- Admin-only floating Edit button on the public card

### Modify
- App.tsx: replace hardcoded data with live data fetched from the backend
- Backend: store one card profile globally (admin-owned); support getPublicCard (anyone) and updateCard (admin only), plus profile photo blob URL
- Profile image: loaded from blob storage URL instead of static asset

### Remove
- Hardcoded VCARD, PROFILE_IMG, and all static data constants in App.tsx

## Implementation Plan
1. Select `authorization` and `blob-storage` Caffeine components
2. Generate Motoko backend: stores one global card profile, admin-only updateCard, public getPublicCard, stores profilePhotoUrl text field
3. Build frontend:
   - PublicCard view (default): fetches card data from backend, renders existing glassmorphic layout with live data
   - AdminPanel view: shown when admin is logged in, form to edit all fields + upload photo, save calls updateCard
   - Floating Edit button visible only when admin is authenticated
   - Logout button in admin panel
