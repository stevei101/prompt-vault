# Prompt Vault

Prompt Vault is the dedicated prompt management experience for the `stevei101`
agent ecosystem. It offers a Supabase-backed store for reusable prompts together
with a lightweight React admin UI that allows authors to create, organise, and
test prompts before sharing them with agent applications such as
`agentnav` or `email-triage-act`.

This repository is the new home for that functionality (see
[Issue #25](https://github.com/stevei101/stevei101/issues/25)).

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind, managed with **bun**
- **Authentication & Storage:** Supabase (Postgres + Auth)
- **Runtime:** Cloud Run (container image built from the provided Dockerfile)
- **IaC & CI/CD:** Terraform + reusable workflows from `stevei101/infrastructure`

## Repository Layout

```text
frontend/        # Standalone React app served via Nginx in Cloud Run
database/        # Supabase schema + RLS helpers
services/        # Cloud Run helper clients (e.g. Agent Navigator bridge)
Dockerfile       # Multi-stage build producing the production container
README.md        # This file
QUICK_START.md   # 5-minute setup guide
```

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/stevei101/prompt-vault.git
cd prompt-vault/frontend
bun install
```

### 2. Configure Supabase

Follow [`database/README.md`](./database/README.md) to

- create the project,
- run the SQL schema, and
- enable Google OAuth.

Create `frontend/.env.local` with:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Run the App Locally

```bash
cd frontend
bun run dev
```

Visit <http://localhost:5175> and sign in using your Supabase Google OAuth
configuration.

### 4. Useful Commands

```bash
bun install        # install dependencies
bun run dev        # start dev server (Vite)
bun run build      # create production bundle
bun run preview    # serve production bundle locally
bun run lint       # ESLint checks
bun run type-check # TypeScript project check
```

## Deployment

Prompt Vault ships as a single static site served by Nginx. The included
`Dockerfile` follows the production image pattern already used in
`stevei101/agentnav`. Build locally with:

```bash
docker build -t prompt-vault-frontend -f Dockerfile .
```

GitHub Actions integration mirrors the standard pattern across the organisation
by consuming the reusable workflows in `stevei101/infrastructure`. See
`.github/workflows/` in this repo once initial pipelines are wired up.

## Related Projects

- [`stevei101/cursor-ide`](https://github.com/stevei101/cursor-ide) – utility
  for managing Cursor prompt libraries. Use
  [`PROMPT_VAULT_INTEGRATION.md`](https://github.com/stevei101/cursor-ide/blob/main/PROMPT_VAULT_INTEGRATION.md)
  to sync Cursor prompts into Prompt Vault.

## Integration with Agent Apps

Agent applications consume Prompt Vault via Supabase APIs and the helper in
`services/agentNavigatorClient.ts` for authenticated callbacks into
`agentnav`. Downstream projects should treat Prompt Vault as an external
service—no direct imports from `agentnav` remain after the repo split
([Issue #27](https://github.com/stevei101/stevei101/issues/27)).

## Contributing

1. Create a feature branch from `main`.
2. Make your changes and run `bun run lint && bun run type-check`.
3. Submit a pull request. All CI quality gates must pass (formatting, tests,
   security scans).

For larger architectural proposals, open an issue in
[`stevei101/stevei101`](https://github.com/stevei101/stevei101) to discuss the
plan before implementation.

## License

Prompt Vault inherits the licensing model used across the `stevei101`
organisation. See `LICENSE` (to be added) or consult the organisation admins
for clarification.
