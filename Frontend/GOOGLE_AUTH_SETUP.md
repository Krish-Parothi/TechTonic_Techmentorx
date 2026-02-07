# Google Authentication Setup with Supabase

This guide will help you set up Google OAuth authentication using Supabase for the FlyWise LLM application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- A Google Cloud Console account for OAuth credentials

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - **Name**: FlyWise-LLM (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for it to initialize

## Step 2: Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Configure Google OAuth in Supabase

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list and click to expand
3. Enable Google provider
4. You'll need to add Google OAuth credentials (we'll get these in the next step)

## Step 4: Set Up Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     ```
     https://YOUR_SUPABASE_PROJECT_URL/auth/v1/callback
     ```
     Replace `YOUR_SUPABASE_PROJECT_URL` with your actual Supabase project URL
   - Click "Create"
5. Copy the **Client ID** and **Client Secret**

## Step 5: Add Google Credentials to Supabase

1. Go back to Supabase dashboard → **Authentication** → **Providers** → **Google**
2. Paste your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
3. Click "Save"

## Step 6: Configure Environment Variables

1. Create a `.env` file in the `Frontend` directory (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

3. **Important**: Add `.env` to your `.gitignore` file to keep credentials secure:
   ```
   .env
   .env.local
   ```

## Step 7: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login page: `http://localhost:5173/login`

3. Click "Continue with Google"

4. You should be redirected to Google's OAuth consent screen

5. After successful authentication, you'll be redirected back to `/trip-selection`

## How It Works

### Authentication Flow

1. **User clicks "Continue with Google"**
   - Calls `signInWithGoogle()` from `src/lib/supabase.js`
   - Supabase redirects to Google OAuth

2. **User authenticates with Google**
   - Google verifies user credentials
   - User grants permissions

3. **Google redirects back to Supabase**
   - Supabase creates/updates user in database
   - Supabase creates a session

4. **User is redirected to your app**
   - Redirects to `/trip-selection`
   - User session is active

### User Data Storage

- **Google OAuth users**: Stored in Supabase database
- **Email/Password users**: Will be handled by your backend with JWT (MongoDB)

### Available Functions

In `src/lib/supabase.js`:

- `signInWithGoogle()` - Initiates Google OAuth flow
- `signOut()` - Signs out the current user
- `getCurrentUser()` - Gets the currently authenticated user
- `onAuthStateChange(callback)` - Listens for auth state changes

## Accessing User Information

To get the current user in any component:

```javascript
import { getCurrentUser } from '../lib/supabase';

const user = await getCurrentUser();
if (user) {
  console.log('User email:', user.email);
  console.log('User name:', user.user_metadata.full_name);
  console.log('User avatar:', user.user_metadata.avatar_url);
}
```

## Protecting Routes

To protect routes that require authentication, you can create an auth guard:

```javascript
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/supabase';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (!user) {
        navigate('/login');
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return children;
};
```

## Troubleshooting

### "Invalid redirect URI" error
- Make sure the redirect URI in Google Cloud Console exactly matches:
  `https://YOUR_SUPABASE_PROJECT_URL/auth/v1/callback`

### Authentication not working
- Check that your `.env` file has the correct credentials
- Restart the dev server after changing `.env`
- Check browser console for errors

### User not redirected after login
- Verify the `redirectTo` URL in `src/lib/supabase.js`
- Make sure the route exists in your app

## Security Best Practices

1. **Never commit `.env` file** - Keep credentials secure
2. **Use environment variables** - Don't hardcode credentials
3. **Enable Row Level Security (RLS)** in Supabase for data protection
4. **Validate user sessions** on protected routes
5. **Use HTTPS in production** - Required for OAuth

## Next Steps

- Implement email/password authentication with your backend
- Add user profile management
- Implement session persistence
- Add logout functionality throughout the app
- Set up Row Level Security policies in Supabase

## Support

- Supabase Documentation: https://supabase.com/docs
- Google OAuth Documentation: https://developers.google.com/identity/protocols/oauth2
