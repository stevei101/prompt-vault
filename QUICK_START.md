# Prompt Vault - Quick Start Guide

Get Prompt Vault up and running in 5 minutes!

## 1. Set Up Supabase (5 minutes)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Wait for provisioning (usually 1-2 minutes)

2. **Run Database Schema**
   - In Supabase Dashboard → **SQL Editor**
   - Copy contents of `database/schema.sql`
   - Click **Run**

3. **Configure OAuth Providers**
   - Go to **Authentication** → **Providers**
   - Enable **Google** and **GitHub**
   - Add the OAuth client IDs and secrets generated in Google Cloud Console and GitHub Developer settings
   - Add redirect URL: `https://{project-ref}.supabase.co/auth/v1/callback`

4. **Get API Keys**
   - Go to **Settings** → **API**
   - Copy **Project URL** → `SUPABASE_URL`
   - Copy **Publishable key** → `SUPABASE_ANON_KEY`

## 2. Local Development (2 minutes)

```bash
# Navigate to frontend
cd prompt-vault/frontend

# Install dependencies
bun install

# Create .env.local
cat > .env.local << EOF
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_key_here
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_GITHUB_CLIENT_ID=your-github-client-id
EOF

# Note: You only need the Google OAuth Client ID, NOT the Client Secret!
# The Client Secret is stored in Supabase Dashboard and used server-side by Supabase.

# Start dev server
bun run dev
```

Visit `http://localhost:5175` and sign in with Google or GitHub!

## 3. Deploy to Cloud Run (Automatic)

Once you push to the `main` branch the **Deploy Prompt Vault to Cloud Run** workflow will:

1. Run `terraform apply` in `infrastructure/terraform` (using Terraform Cloud)
2. Build the container with Podman and push it to Artifact Registry
3. Deploy to Cloud Run with Supabase configuration injected from repository variables and Secret Manager

Before running the workflow, follow the [Cloud Run Deployment Guide](./docs/CLOUD_RUN_DEPLOYMENT.md) to:

- Configure GitHub repository secrets/variables
- Add the Supabase anon key to Secret Manager (`SUPABASE_ANON_KEY`)
- Provision the supporting infrastructure via Terraform

After the workflow completes, the Cloud Run service URL appears in the job summary (and in the Cloud Run console).

## What's Next?

- ✨ Create your first prompt
- 🔍 Search and organize prompts
- 📝 Edit and refine prompts
- 🌐 Share public prompts
- ⛅ Import your Cursor IDE library with
  [cursor-ide](https://github.com/stevei101/cursor-ide)

## Troubleshooting

**"Missing Supabase credentials" error:**

- Check your `.env.local` file exists
- Verify environment variable names start with `VITE_`

**"Authentication failed":**

- Verify Google OAuth is enabled in Supabase
- Check redirect URL matches Supabase callback URL

**"Database error":**

- Make sure you ran the schema SQL in Supabase
- Check Row Level Security policies are active

## Need Help?

- See [database/README.md](./database/README.md) for database setup
- Open an issue in [stevei101/prompt-vault](https://github.com/stevei101/prompt-vault/issues)
