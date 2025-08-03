# OAuth Authentication Troubleshooting Guide

## Common OAuth Issues and Solutions

### Problem: Google/Apple OAuth Sign-in Not Working After Account Creation

#### Symptoms:
- User signs in with Google/Apple
- Account gets created in Clerk
- User doesn't get redirected properly
- Stuck on auth page or gets logged out immediately

#### Root Causes:
1. **Incorrect Redirect URLs** in Clerk Dashboard
2. **Missing OAuth Configuration** in production
3. **Middleware Blocking OAuth Callbacks**
4. **Environment Variables** not set correctly

## Fix Steps:

### 1. Clerk Dashboard Configuration

#### Go to [Clerk Dashboard](https://dashboard.clerk.com)
1. Select your project
2. Go to **"Social connections"**
3. Enable **Google** and **Apple** if not already enabled
4. For each provider, set:
   - **Redirect URLs**: 
     - `https://yourdomain.com/sso-callback`
     - `https://yourdomain.com/sign-in/sso-callback`
     - `https://yourdomain.com/sign-up/sso-callback`

#### In "Domains" section:
1. Add your production domain: `yourdomain.com`
2. Add your development domain: `localhost:3000`

### 2. Environment Variables (Vercel)

Ensure these are set in Vercel Dashboard → Settings → Environment Variables:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/
```

### 3. Google OAuth Setup

#### In Google Cloud Console:
1. Go to **APIs & Services** → **Credentials**
2. Select your OAuth 2.0 client
3. Add **Authorized redirect URIs**:
   - `https://accounts.clerk.dev/v1/oauth_callback`
   - `https://yourdomain.com/sso-callback`

### 4. Apple OAuth Setup

#### In Apple Developer Portal:
1. Go to **Certificates, Identifiers & Profiles**
2. Select your **Sign in with Apple** service
3. Add **Return URLs**:
   - `https://accounts.clerk.dev/v1/oauth_callback`
   - `https://yourdomain.com/sso-callback`

## Testing OAuth Flow:

### 1. Development Testing:
```bash
npm run dev
# Navigate to http://localhost:3000/sign-in
# Test Google/Apple sign-in
# Should redirect to /onboarding after success
```

### 2. Production Testing:
1. Deploy changes to Vercel
2. Test OAuth flow on live domain
3. Check browser network tab for failed requests
4. Check Vercel function logs for errors

## Debug Commands:

### Check Environment Variables:
```bash
vercel env ls
```

### Check Deployment Logs:
```bash
vercel logs yourdomain.com
```

### Force Redeploy:
```bash
vercel --prod
```

## Common Error Messages:

### "Redirect URI mismatch"
- **Solution**: Update redirect URIs in OAuth provider settings

### "Invalid client"
- **Solution**: Check OAuth client ID/secret in Clerk Dashboard

### "CORS error"
- **Solution**: Add domain to allowed origins in Clerk Dashboard

### "Session not found"
- **Solution**: Clear browser cookies and try again

## Additional Notes:

- OAuth changes can take up to 10 minutes to propagate
- Always test in incognito/private browsing mode
- Check both development and production environments
- Verify SSL certificates are valid for production domain

## Contact Support:

If issues persist:
1. Check Clerk Documentation: https://clerk.com/docs
2. Contact Clerk Support with:
   - Application ID
   - Error messages
   - Screenshots of configuration
   - Browser console logs
