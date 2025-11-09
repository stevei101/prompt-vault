variable "project_id" {
  description = "Google Cloud project ID used for Prompt Vault."
  type        = string
}

variable "region" {
  description = "Region for Cloud Run and Artifact Registry resources."
  type        = string
  default     = "us-central1"
}

variable "artifact_registry_repository_id" {
  description = "Artifact Registry repository ID that stores Prompt Vault images."
  type        = string
  default     = "prompt-vault"
}

variable "artifact_registry_location" {
  description = "Location for the Artifact Registry repository; defaults to region when blank."
  type        = string
  default     = ""
}

variable "supabase_anon_secret_id" {
  description = "Secret Manager ID for the Supabase anon key consumed by the frontend."
  type        = string
  default     = "SUPABASE_ANON_KEY"
}

variable "runtime_service_account_email" {
  description = "Optional Cloud Run runtime service account email. Use to override the default compute service account."
  type        = string
  default     = ""
}

variable "gha_service_account_email" {
  description = "Optional GitHub Actions deployer service account email to grant required project roles."
  type        = string
  default     = ""
}

variable "labels" {
  description = "Common labels applied to created resources."
  type        = map(string)
  default = {
    application = "prompt-vault"
    managed_by  = "terraform"
  }
}
