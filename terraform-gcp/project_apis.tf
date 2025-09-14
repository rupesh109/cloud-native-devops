resource "google_project_service" "compute" { service = "compute.googleapis.com" }
resource "google_project_service" "artifactregistry" { service = "artifactregistry.googleapis.com" }
resource "google_project_service" "run" { service = "run.googleapis.com" }
resource "google_project_service" "cloudbuild" { service = "cloudbuild.googleapis.com" }
