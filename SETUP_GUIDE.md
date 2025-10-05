# Complete Setup Guide for Tax Prep Assistant

## 🚀 Quick Setup Checklist

### 1. Get OpenAI API Key (5 minutes)
1. Go to https://platform.openai.com/api-keys
2. Sign in or create account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

### 2. Set up Google OAuth (10 minutes)
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Tax Prep Assistant"
   - Authorized redirect URIs: 
     - `http://localhost:3000/api/auth/callback/google` (for local)
     - `https://your-vercel-app.vercel.app/api/auth/callback/google` (for production)
5. Copy Client ID and Client Secret

### 3. Configure Vercel Environment Variables
1. Go to https://vercel.com/dashboard
2. Select your tax-prep-assistant project
3. Go to Settings → Environment Variables
4. Add these variables:

```
OPENAI_API_KEY=sk-your-openai-key-here
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=https://tax-prep-assistant-6iuxq7ise-curtis-projects-bf93d458.vercel.app
NEXTAUTH_SECRET=your-random-32-character-string
```

### 4. Generate NEXTAUTH_SECRET
Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```
Or use this online generator: https://generate-secret.vercel.app/32

### 5. Redeploy
After adding environment variables, redeploy:
```bash
vercel --prod
```

## 🔧 Local Development Setup

1. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` with your values:
```
OPENAI_API_KEY=sk-your-openai-key-here
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-32-character-string
```

3. Run locally:
```bash
npm run dev
```

## 🎯 Testing the Setup

1. Visit your deployed app
2. Click "Sign In with Google"
3. Upload a tax document
4. Click "Analyze with AI" (should work after sign-in)
5. Generate tax return summary

## 🚨 Troubleshooting

### "API key not configured" error:
- Check environment variables are set in Vercel
- Redeploy after adding variables

### Google OAuth not working:
- Verify redirect URIs match exactly
- Check Google Cloud Console project is active
- Ensure Google+ API is enabled

### "Sign in to use AI" message:
- This is normal - AI features require authentication
- Sign in with Google to unlock features

## 💡 Cost Estimates

- **OpenAI API**: ~$0.01-0.10 per document analysis
- **Google OAuth**: Free
- **Vercel Hosting**: Free tier sufficient

Your app is now ready for production use! 🎉