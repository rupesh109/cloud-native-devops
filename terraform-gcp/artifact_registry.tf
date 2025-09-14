resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = "demo"
  description   = "Docker images for devops demo"
  format        = "DOCKER"
}

output "artifact_registry_repo_path" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.repo.repository_id}"
}
