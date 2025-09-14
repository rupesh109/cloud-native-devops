# Terraform for GCP (VPC + GKE + Artifact Registry)

## Commands
export PROJECT_ID="<YOUR_GCP_PROJECT_ID>"
terraform init
terraform apply -auto-approve \
  -var="project_id=$PROJECT_ID" \
  -var="region=asia-south1" \
  -var="zone=asia-south1-a" \
  -var="cluster_name=devops-demo-gke" \
  -var="gar_repo=demo"

# Get kubeconfig
gcloud container clusters get-credentials devops-demo-gke --region asia-south1 --project $PROJECT_ID
kubectl get nodes



cd terraform-gcp
export PROJECT_ID="<YOUR_GCP_PROJECT_ID>"
terraform init
terraform apply -auto-approve -var="project_id=$PROJECT_ID"
gcloud container clusters get-credentials devops-demo-gke --region asia-south1 --project $PROJECT_ID
kubectl get nodes   # expect 2 Ready nodes
