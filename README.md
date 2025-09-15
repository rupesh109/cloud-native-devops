# 🚀 Cloud-Native DevOps Pipeline (React + Node + GCP Cloud Run + MongoDB Atlas)

[![CI-CD (GCP Cloud Run)](https://github.com/rupesh109/cloud-native-devops/actions/workflows/ci-cd-gcp.yml/badge.svg)](../../actions/workflows/ci-cd-gcp.yml)
![Node](https://img.shields.io/badge/Node-18.x-43853d?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=black)
![Cloud Run](https://img.shields.io/badge/Deployed%20to-Cloud%20Run-4285F4?logo=googlecloud&logoColor=white)
![Trivy](https://img.shields.io/badge/Secured%20by-Trivy-0F80AA?logo=aqua)
![License](https://img.shields.io/badge/License-MIT-informational)

This project demonstrates end-to-end DevOps practices for deploying a React frontend and Node/Express backend on Google Cloud Run, with a fully automated CI/CD pipeline.

Key features:

• 🚀 Automated CI/CD with GitHub Actions

• 🏗 Infrastructure as Code using Terraform

• 🔐 Security with Trivy scans and Workload Identity Federation (no long-lived keys)

• 📦 Containerization with Docker and Artifact Registry

• 📊 Optional code analysis with SonarQube

---
Live services

Frontend: https://frontend-z3e5qg5e7q-el.a.run.app/

Backend: https://backend-z3e5qg5e7q-el.a.run.app/


## 🏗️ Architecture

Here’s the high-level system design for this project:

![Architecture Diagram](./Architecture.png)


# ⚙️ CI/CD Workflow

1. On push to main:
2. Authenticate to GCP via Workload Identity Federation
3. Build & push Docker images → Artifact Registry
4. Run Trivy scans (non-blocking by default)
5. (Optional) Run SonarQube analysis
6. Deploy backend → capture API URL
7. Deploy frontend → inject backend API URL
8. Validate deployment 

# 📂 Tech Stack

• Frontend: React (served via Cloud Run)

• Backend: Node.js / Express + MongoDB Atlas

• CI/CD: GitHub Actions + Artifact Registry + Cloud Run

• Infra: Terraform for provisioning

• Security: Trivy scans, optional SonarQube


# 📁 Repository layout
backend/
 ├── Dockerfile
 ├── package.json
 └── server.js        # Express API (list/add users), health endpoints

frontend/
 ├── Dockerfile       # Multi-stage build → Nginx runtime
 ├── nginx.conf.template  # Proxies /api/* → $BACKEND_URL
 ├── package.json
 ├── public/
 └── src/
     ├── App.js
     └── App.css      # polished UI + API integration

.github/workflows/
 └── ci-cd-gcp.yml    # GitHub Actions pipeline

terraform-gcp/
 └── main.tf          # Infra provisioning

README.md
docker-compose.yml



