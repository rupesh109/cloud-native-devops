# 🚀 Cloud-Native DevOps – React + Express on GCP Cloud Run

[![CI/CD – GCP Cloud Run](https://github.com/rupesh109/cloud-native-devops/actions/workflows/ci-cd-gcp.yml/badge.svg?branch=main)](https://github.com/rupesh109/cloud-native-devops/actions/workflows/ci-cd-gcp.yml)
![Cloud Run](https://img.shields.io/badge/Cloud%20Run-managed-4285F4?logo=googlecloud&logoColor=white)
![Region](https://img.shields.io/badge/region-asia--south1-blue)
![Node](https://img.shields.io/badge/node-18.x-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-18-61DAFB?logo=react&logoColor=061e26)
![Docker](https://img.shields.io/badge/container-multi--stage-2496ED?logo=docker&logoColor=white)
![Security](https://img.shields.io/badge/security-Trivy-informational)
![DB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)

A minimal, production-shaped template that ships a **React SPA (Nginx)** and a **Node/Express API**, built via **GitHub Actions** with **Workload Identity Federation** (no long-lived keys), scanned by **Trivy**, and deployed to **Cloud Run** with images from **Artifact Registry**. Data lives in **MongoDB Atlas**.

---

## 🏗️ Architecture

```mermaid
flowchart LR
  U[User Browser] --> F[Cloud Run - frontend<br/>Nginx@8080]
  F -->|/api/* proxy| B[Cloud Run - backend<br/>Express@8080]
  B --> M[(MongoDB Atlas<br/>db: devops)]
  subgraph CI[GitHub Actions]
    CI1[Build • Trivy • (Sonar)] --> AR[(Artifact Registry)]
    CI2[Deploy (WIF)] --> F
    CI2 --> B
  end
