output "artifact_registry_repository" {
  description = "Fully qualified Artifact Registry repository resource name."
  value       = google_artifact_registry_repository.prompt_vault.id
}

output "supabase_anon_secret" {
  description = "Supabase anon key secret resource ID. Add secret versions out-of-band."
  value       = google_secret_manager_secret.supabase_anon.id
}

output "runtime_service_account_email" {
  description = "Service account email used by Cloud Run to access Supabase secrets."
  value       = local.runtime_service_account_email
}
