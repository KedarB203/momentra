# 🔐 Setting Up Anthropic API Key Securely

## Step 1: Get Your API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign in or create an account
3. Navigate to "API Keys" section
4. Click "Create Key"
5. Copy the generated API key (starts with `sk-ant-...`)

## Step 2: Create Environment File

Create a `.env.local` file in your project root (same level as `package.json`):

```bash
# Create the file
touch .env.local
```

## Step 3: Add Your API Key

Open `.env.local` and add:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Anthropic Claude API Configuration (Server-side only - KEEP PRIVATE!)
ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
```

## Step 4: Restart Development Server

```bash
# Stop your current dev server (Ctrl+C)
# Then restart it
npm run dev
```

## 🔒 Security Notes

- ✅ **DO**: Use `ANTHROPIC_API_KEY` (no `NEXT_PUBLIC_` prefix)
- ✅ **DO**: Keep the key in `.env.local` (not committed to git)
- ✅ **DO**: Never share your API key publicly
- ❌ **DON'T**: Put the key in client-side code
- ❌ **DON'T**: Commit `.env.local` to version control
- ❌ **DON'T**: Use `NEXT_PUBLIC_ANTHROPIC_API_KEY`

## 🚨 Troubleshooting

### Error: "Could not resolve authentication method"
- Check that `ANTHROPIC_API_KEY` is set in `.env.local`
- Restart your development server after adding the key
- Verify the key starts with `sk-ant-`

### Error: "API key not configured"
- Make sure `.env.local` is in the project root
- Check the file name is exactly `.env.local` (not `.env` or `.env.local.txt`)
- Restart the development server

## 📁 File Structure
```
momentra/
├── .env.local          ← Your API key goes here
├── package.json
├── app/
│   ├── api/
│   │   └── analyze-image/
│   │       └── route.ts  ← Uses the API key securely
│   └── page.tsx
└── components/
    └── ImagaAnalyzer.tsx
```

## ✅ Verification

Once set up correctly, you should see:
- No authentication errors in console
- Image analysis working properly
- API calls succeeding in Network tab
