data "google_project" "current" {
  project_id = var.project_id
}

locals {
  artifact_registry_location    = trim(var.artifact_registry_location) != "" ? var.artifact_registry_location : var.region
  runtime_service_account_email = trim(var.runtime_service_account_email) != ""
    ? var.runtime_service_account_email
    : "${data.google_project.current.number}-compute@developer.gserviceaccount.com"
  gha_roles = trim(var.gha_service_account_email) != ""
    ? [
        "roles/run.admin",
        "roles/artifactregistry.writer",
        "roles/iam.serviceAccountTokenCreator",
        "roles/secretmanager.secretAccessor",
      ]
    : []
}

resource "google_artifact_registry_repository" "prompt_vault" {
  repository_id = var.artifact_registry_repository_id
  location      = local.artifact_registry_location
  format        = "DOCKER"
  description   = "OCI images for the Prompt Vault Cloud Run service"
  labels        = var.labels
}

resource "google_secret_manager_secret" "supabase_anon" {
  secret_id = var.supabase_anon_secret_id
  labels    = var.labels

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_iam_member" "runtime_access_supabase_anon" {
  secret_id = google_secret_manager_secret.supabase_anon.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${local.runtime_service_account_email}"
}

resource "google_project_iam_member" "gha_permissions" {
  for_each = toset(local.gha_roles)

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${var.gha_service_account_email}"
}
