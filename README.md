# 🚀 Cloud-Native DevOps Demo (React + Node + GCP Cloud Run + MongoDB Atlas)

[![CI-CD (GCP Cloud Run)](https://github.com/rupesh109/cloud-native-devops/actions/workflows/ci-cd-gcp.yml/badge.svg)](../../actions/workflows/ci-cd-gcp.yml)
![Node](https://img.shields.io/badge/Node-18.x-43853d?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=black)
![Cloud Run](https://img.shields.io/badge/Deployed%20to-Cloud%20Run-4285F4?logo=googlecloud&logoColor=white)
![Trivy](https://img.shields.io/badge/Secured%20by-Trivy-0F80AA?logo=aqua)
![License](https://img.shields.io/badge/License-MIT-informational)

A tiny full-stack app that demonstrates **cloud-native delivery on GCP**:
- **Frontend**: React SPA served by **Nginx**, proxying `/api/*` to the backend.
- **Backend**: Node/Express REST API with `/api/users` persisted in **MongoDB Atlas**.
- **CI/CD**: GitHub Actions → **Artifact Registry** → **Cloud Run** via **Workload Identity Federation** (no long-lived keys).
- **Security**: Container image scanning with **Trivy**.
- **Optionally**: **SonarQube** code analysis (if tokens are provided).

---

flowchart LR
  U[User Browser] --> F[Cloud Run • Frontend (Nginx)]
  F -- "/api/* proxy" --> B[Cloud Run • Backend (Express)]
  B -->|Mongo driver| M[(MongoDB Atlas: devops)]

  subgraph CI[GitHub Actions (CI/CD)]
    C1[[Build images]]
    C2[[Security scan (Trivy)]]
    C3[[Optional: SonarQube]]
    C4[[Deploy via WIF]]
  end

  subgraph GCP[Google Cloud]
    AR[(Artifact Registry)]
    F
    B
  end

  %% CI/CD flows
  C1 --> AR
  C2 --> C1
  C3 --> C1
  AR --> F
  AR --> B
  C4 --> F
  C4 --> B


🖥️ Deploy (CI/CD)

1. On push to main:
2. Authenticate to GCP via Workload Identity Federation
3. Build & push images → Artifact Registry
4. Trivy scans (non-blocking by default)
5. (Optional) SonarQube scan
6. Deploy backend, capture URL
7. Deploy frontend with BACKEND_URL=<backend-url>

