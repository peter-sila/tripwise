# Google Sign-In Implementation Guide

This guide explains how to set up Google OAuth authentication for TripWise.

## Overview

The Google Sign-In feature allows users to authenticate using their Google account instead of creating a new account with email/password.

## What Was Implemented

### Backend
- **File**: `backend/api/google-auth.php`
- **Endpoint**: POST `/backend/api/google-auth.php`
- **Functions**:
  - Verifies Google ID tokens
  - Creates or retrieves users from database
  - Handles account linking (links Google ID to existing email users)
  - Returns authentication token

### Frontend
- **Modified Files**:
  - `src/App.jsx` - Added GoogleOAuthProvider wrapper
  - `src/users/statics/navbar.jsx` - Added GoogleLogin button
  - `src/utils/translations.js` - Added Google Sign-In text translations
  - `src/users/css/navbar.css` - Added Google button styling
  - `package.json` - Added @react-oauth/google dependency

### Database
- **Migration File**: `backend/db/migration_add_oauth.sql`
- **New Fields Added to users table**:
  - `google_id` - Stores Google user ID
  - `oauth_provider` - Identifies OAuth provider (currently "google")
  - `oauth_email` - Stores OAuth email
  - `password_hash` - Now nullable for OAuth users

## Setup Instructions

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

This installs the `@react-oauth/google` package.

### Step 2: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing one)
3. Enable the "Google+ API"
4. Create OAuth 2.0 Client ID credentials:
   - Application type: "Web application"
   - Authorized JavaScript origins: `http://localhost:5173` (for development)
   - Authorized redirect URIs: `http://localhost:5173` (for development)
5. Copy the **Client ID**

### Step 3: Configure Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_API_BASE_URL=http://localhost:8000/api
```

**Important**: TripWise uses **Vite** (not Create React App), so:
- Use `VITE_` prefix instead of `REACT_APP_`
- Environment variables are accessed via `import.meta.env.VITE_*`

Replace `your_google_client_id_here` with the Client ID from Step 2.

You can also copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

### Step 4: Update App.jsx

The Client ID is already configured to read from Vite environment variables:

```javascript
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';
```

The app will use the value from your `.env` file. If no value is set, it defaults to the placeholder text.

### Step 5: Update Database Schema

Run the migration to add OAuth fields:

```bash
# Connect to MySQL
mysql -u root -p

# Run the migration
source backend/db/migration_add_oauth.sql;
```

Or manually execute the SQL from `backend/db/migration_add_oauth.sql`

### Step 6: Update CORS Settings

In `backend/api/google-auth.php`, ensure the CORS header matches your frontend URL:

```php
header("Access-Control-Allow-Origin: http://localhost:5173");
```

For production, update to your actual domain.

### Step 7: Start the Application

```bash
# Terminal 1: Start backend
cd backend
php -S localhost:8000

# Terminal 2: Start frontend
cd frontend
npm run dev
```

## How It Works

### User Sign-In Flow

1. User clicks "Sign in with Google" button
2. Google login popup appears
3. User authenticates with Google
4. Frontend receives ID token from Google
5. Frontend sends ID token to `backend/api/google-auth.php`
6. Backend verifies token and either:
   - Returns existing user (if Google ID already in database)
   - Links Google ID to existing email user
   - Creates new user account
7. Frontend stores token in localStorage
8. User is logged in

### Account Linking

If a user already has a regular account with the same email they use for Google:
- Their Google ID is automatically linked to their existing account
- They can now sign in with either email/password OR Google
- Their account data is preserved

## Troubleshooting

### Issue: "Invalid Client ID"
- Verify Client ID is correct in .env file
- Check that Client ID hasn't been rotated in Google Cloud Console
- Ensure Client ID is for a "Web application" type credential

### Issue: "CORS Error"
- Ensure `http://localhost:5173` is added to authorized origins in Google Cloud Console
- For production, add your production domain to authorized origins
- Check CORS headers in `backend/api/google-auth.php`

### Issue: "Token verification failed"
- Google tokens expire after ~1 hour
- User should see Google login popup again if token expired
- Check that ID token is being sent correctly from frontend

### Issue: User not created
- Ensure database migration was run successfully
- Check that `password_hash` column is nullable in users table
- Verify `google_id` column exists and has UNIQUE constraint

## Security Considerations

### Production Checklist

1. **Verify Google ID Token Signature** (Critical for production)
   - Current implementation does basic verification
   - Should use Google's official library to verify JWT signature
   - Install: `composer require google/auth`
   
   Example:
   ```php
   require 'vendor/autoload.php';
   use Google_Client;
   
   $client = new Google_Client();
   $client->setClientId(YOUR_CLIENT_ID);
   $payload = $client->verifyIdToken($idToken);
   ```

2. **Use HTTPS only**
   - Tokens should only be transmitted over HTTPS

3. **Store tokens securely**
   - Current implementation uses localStorage (suitable for frontend)
   - Backend tokens are simple (should use JWT in production)

4. **Rate limiting**
   - Add rate limiting to `google-auth.php` endpoint
   - Prevent brute force authentication attempts

5. **Input validation**
   - Additional input sanitization is recommended

## API Reference

### Endpoint: `/backend/api/google-auth.php`

**Method**: POST

**Request Body**:
```json
{
  "action": "google_signin",
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImE3NTRjMDk2NjI5YzI0YmYwNTcyYWQ3ZjI1ZmQ3YTUwNGY4ZWU4OTEifQ..."
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "token": "123",
  "user": {
    "id": 123,
    "email": "user@gmail.com",
    "name": "John Doe",
    "created_at": "2024-04-25 10:30:00"
  }
}
```

**Error Response (400/401/500)**:
```json
{
  "error": "Error message here"
}
```

## Testing

### Manual Testing

1. Open `http://localhost:5173` in browser
2. Click "Join Us" button
3. Click "Sign in with Google" button
4. Authenticate with Google account
5. Verify user is logged in
6. Check browser console for errors
7. Refresh page - user should still be logged in (token persisted)

### Testing Account Linking

1. Create regular account with email: `test@gmail.com` and password
2. Log out
3. Click "Sign in with Google"
4. Use Google account associated with `test@gmail.com`
5. Verify you're logged in as the same user
6. Verify Google ID is now linked in database

## Language Support

Google Sign-In button automatically displays in the selected language (English, Spanish, French, German, Italian, Portuguese, Japanese, Chinese).

The button text is controlled by the `locale` prop in the GoogleLogin component.

## Next Steps

1. Test thoroughly in development
2. Get Google Cloud Admin approval (if needed for your organization)
3. Update CORS settings for production domain
4. Add JWT token signing for production security
5. Implement token refresh mechanism
6. Add email verification for new accounts
7. Monitor authentication logs

## Files Modified

- `backend/api/google-auth.php` (new)
- `backend/db/migration_add_oauth.sql` (new)
- `frontend/package.json`
- `frontend/src/App.jsx`
- `frontend/src/users/statics/navbar.jsx`
- `frontend/src/utils/translations.js`
- `frontend/src/users/css/navbar.css`

## Support

For Google OAuth issues, refer to:
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google)
