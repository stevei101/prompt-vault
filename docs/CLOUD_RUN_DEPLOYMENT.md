# Cloud Run Deployment Guide

This document explains how to deploy **Prompt Vault** to Google Cloud Run using the reusable [`podman-cloudrun-deploy-gha`](https://github.com/stevei101/podman-cloudrun-deploy-gha) workflow and the Terraform configuration that ships with this repository.

## 1. Prerequisites

- Google Cloud project with billing enabled
- Workload Identity Federation (WIF) pool + provider mapped to GitHub (see `infrastructure/terraform` for the deployer service account bindings)
- Supabase project with Google and GitHub OAuth providers enabled
- Terraform Cloud organization `stevei101` with a workspace named `prompt-vault-<environment>` (for example `prompt-vault-staging`)

## 2. Configure Terraform

Update `infrastructure/terraform/terraform.tfvars` (copy the provided example) with values for your environment:

```hcl
project_id                     = "prod-agentnav-123456"
region                         = "europe-west1"
artifact_registry_repository_id = "prompt-vault"
artifact_registry_location     = "europe-west1"
supabase_anon_secret_id        = "SUPABASE_ANON_KEY"
# Optional overrides
runtime_service_account_email  = "" # defaults to PROJECT_NUMBER-compute@developer.gserviceaccount.com
gha_service_account_email      = "gha-prompt-vault@prod-agentnav-123456.iam.gserviceaccount.com"
```

### Apply infrastructure

Using the GitHub Actions workflow or running locally:

```bash
cd infrastructure/terraform
terraform init
terraform workspace select prompt-vault-staging || terraform workspace new prompt-vault-staging
terraform apply
```

Resources created:

- Artifact Registry repository for container images
- Supabase anon key secret (`google_secret_manager_secret`)
- Secret Manager bindings so the Cloud Run runtime service account can read the Supabase secret
- (Optional) IAM roles for the GitHub Actions deployer service account

Add secret **versions** manually (or via automation) after Terraform runs:

```bash
gcloud secrets versions add SUPABASE_ANON_KEY --data-file=anon-key.txt
```

## 3. GitHub repository configuration

In **Settings → Secrets and variables → Actions**:

### Secrets

| Name | Description |
| --- | --- |
| `GCP_PROJECT_ID` | Target GCP project ID |
| `WIF_PROVIDER` | Workload Identity Federation provider resource name |
| `WIF_SERVICE_ACCOUNT` | Service account impersonated by GitHub Actions |
| `TF_API_TOKEN` | Terraform Cloud API token |

### Variables

| Name | Description |
| --- | --- |
| `CLOUD_RUN_SERVICE_NAME` | Cloud Run service name (e.g. `prompt-vault`) |
| `CLOUD_RUN_REGION` | Cloud Run region (e.g. `europe-west1`) |
| `GAR_REPOSITORY` | Artifact Registry repository (e.g. `prompt-vault`) |
| `DEPLOY_ENV` | Logical environment (`staging`, `prod`, etc.) |
| `SUPABASE_URL` | Public Supabase URL (e.g. `https://xyzcompany.supabase.co`) |
| `GOOGLE_OAUTH_CLIENT_ID` | Google OAuth client configured in Supabase |
| `GITHUB_OAUTH_CLIENT_ID` | GitHub OAuth client configured in Supabase |

Ensure the Supabase anon key secret exists in Secret Manager with ID `SUPABASE_ANON_KEY` and contains the current anon key value.

## 4. Workflow behaviour

`.github/workflows/deploy-cloudrun.yaml` invokes the reusable workflow `podman-cloudrun-deploy-gha@v0.1.0`. The pipeline performs:

1. (Optional) Terraform init + apply in `infrastructure/terraform`
2. Build the container image with Podman
3. Push the image to Artifact Registry
4. Deploy Prompt Vault to Cloud Run, injecting:
   - `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - `NEXT_PUBLIC_GITHUB_CLIENT_ID`
   - Supabase anon key via Secret Manager `SUPABASE_ANON_KEY`

Cloud Run reads the `PORT` environment variable automatically; the container entrypoint propagates the Supabase values to `config.js` at runtime.

## 5. Supabase SSO checklist

The application depends on Supabase to offer both Google and GitHub sign-in options:

1. In Supabase → Authentication → Providers enable **Google** and **GitHub**
2. Configure the OAuth redirect to `https://<cloud-run-service-url>/` (and development URLs as needed)
3. Copy the client IDs into the GitHub repository variables (`GOOGLE_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_ID`)
4. Store the anon key in Secret Manager (ID `SUPABASE_ANON_KEY`)

No service-role key is required by the frontend; all privileged operations run server-side via Supabase policies.

## 6. Deploy

Push to `main` or trigger the workflow manually:

```text
Actions → Deploy Prompt Vault to Cloud Run → Run workflow
```

Monitor the workflow logs and confirm the Cloud Run service URL returned by the reusable workflow. Once deployed, navigate to the URL and verify you can sign in via both Google and GitHub SSO providers configured in Supabase.
