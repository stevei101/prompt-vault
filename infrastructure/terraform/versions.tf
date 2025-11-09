terraform {
  required_version = ">= 1.5.0"

  cloud {
    organization = "stevei101"
    workspaces {
      prefix = "prompt-vault-"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}
