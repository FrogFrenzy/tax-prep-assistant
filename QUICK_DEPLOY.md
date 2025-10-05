# 🚀 Quick Deploy Instructions

## Your App is Already Live!
**URL**: https://tax-prep-assistant-6iuxq7ise-curtis-projects-bf93d458.vercel.app

## To Enable AI Features (15 minutes total):

### Step 1: Get OpenAI API Key (5 min)
1. Visit: https://platform.openai.com/api-keys
2. Sign in/create account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

### Step 2: Set up Google OAuth (5 min)
1. Visit: https://console.cloud.google.com/
2. Create project → Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add redirect URI: `https://tax-prep-assistant-6iuxq7ise-curtis-projects-bf93d458.vercel.app/api/auth/callback/google`
5. Copy Client ID and Secret

### Step 3: Add to Vercel (5 min)
1. Visit: https://vercel.com/curtis-projects-bf93d458/tax-prep-assistant/settings/environment-variables
2. Add these 5 variables:

```
OPENAI_API_KEY = sk-your-key-here
GOOGLE_CLIENT_ID = your-id.apps.googleusercontent.com  
GOOGLE_CLIENT_SECRET = your-secret
NEXTAUTH_URL = https://tax-prep-assistant-6iuxq7ise-curtis-projects-bf93d458.vercel.app
NEXTAUTH_SECRET = bzQ513rqam1zBNiyEdQTWP5CWoc5mt3vgqp3hGGOymg=
```

3. Click "Redeploy" after adding variables

## ✅ That's it! 
Your tax prep assistant will have full AI capabilities with Google sign-in.

## Test it:
1. Visit your app
2. Sign in with Google  
3. Upload a document
4. Click "Analyze with AI"
5. Generate tax return

**Need help?** Check SETUP_GUIDE.md for detailed instructions.