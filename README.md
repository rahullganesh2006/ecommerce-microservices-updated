# Serverless E-Commerce Microservices Platform 🚀

A highly scalable, fully serverless e-commerce platform built with **React**, **FastAPI**, and deployed natively on **AWS**. This project demonstrates a decoupled, event-driven microservices architecture using modern cloud infrastructure practices.

---

## 🏗️ Architecture Overview

The system is composed of a decoupled frontend and **7 independent backend microservices**, all communicating securely through an API Gateway and interacting with Amazon DynamoDB.

- **Frontend:** Built with React/Vite and hosted on a global CDN via AWS Amplify.
- **Backend:** 7 independent Python FastAPI microservices, adapted with Mangum to run seamlessly in AWS Lambda.
- **Database:** Amazon DynamoDB (NoSQL) utilizing a `PAY_PER_REQUEST` billing mode for infinite scalability with zero idle costs.
- **Infrastructure:** Provisioned fully as code (IaC) using **Terraform**.

### Microservices
| Service | Responsibility |
|---|---|
| `auth-service` | User authentication, registration, and JWT generation |
| `cart-service` | Managing user shopping carts and checkout flows |
| `inventory-service` | Managing product stock levels |
| `notification-service` | Handling async emails (e.g., checkout success) via AWS SNS/SQS |
| `order-service` | Order creation and history |
| `payment-service` | Payment processing and mock transaction handling |
| `product-service` | Product catalog viewing and searching |

---

## 🌟 Key Cloud Features

### 1. Centralized Logging (AWS CloudWatch)
Instead of manually SSHing into servers, all standard Python `logging` outputs from the microservices are natively intercepted by AWS Lambda and streamed to centralized **CloudWatch Log Groups**.

### 2. Distributed Tracing (AWS X-Ray)
To debug issues in the complex checkout flow (which hits API Gateway -> Cart -> Payment -> Order), we use **AWS X-Ray**. 
- Using `aws-xray-sdk`, we use `patch_all()` in our FastAPI apps to automatically intercept and trace all downstream `boto3` calls (like DynamoDB queries).
- This generates a visual **Service Map** in the AWS Console, showing exact millisecond latencies and pinpointing exactly which microservice caused any 500 errors.

### 3. CI/CD Deployment Pipelines
We have fully automated CI/CD pipelines split across our stack:
- **Frontend (AWS Amplify):** Pushes to the `main` branch automatically trigger AWS Amplify to read `amplify.yml`, install dependencies, run the Vite build, and deploy to the global CDN.
- **Backend (GitHub Actions):** Pushes to `main` trigger a massive **Matrix Deployment** (`deploy.yml`). GitHub Actions concurrently builds all 7 microservices using `manylinux2014_x86_64` (to ensure binary compatibility with AWS Lambda's Amazon Linux OS). To avoid AWS's 50MB direct-upload limit, the pipeline strips out natively provided libraries (like `botocore` and `boto3`) before zipping and deploying via the AWS CLI.

### 4. DevSecOps (SonarQube & Snyk)
A dedicated `security.yml` GitHub Actions workflow runs on every push and pull request to ensure high code quality and security:
- **Static Application Security Testing (SAST):** Uses **SonarCloud/SonarQube** to analyze all Python microservices for code smells, bugs, and security hotspots.
- **Software Composition Analysis (SCA):** Uses **Snyk** in a matrix strategy to scan the `requirements.txt` of all 7 microservices for known vulnerable dependencies (CVEs).

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite, TailwindCSS
- **Backend:** Python 3.11, FastAPI, Mangum, Pydantic, python-jose (JWT)
- **Database:** Amazon DynamoDB
- **Cloud Infrastructure (AWS):** Lambda, API Gateway, SQS, SNS, IAM, CloudWatch, X-Ray
- **DevOps:** Terraform, GitHub Actions, AWS Amplify

---

## 🚀 Local Development Setup

To run this architecture on your local machine for development:

### 1. Clone the Repository
```bash
git clone https://github.com/rahullganesh2006/ecommerce-microservices-updated.git
cd ecommerce-microservices-updated
```

### 2. Run the Backend Locally
You can run any individual microservice locally using Uvicorn.
```bash
cd product-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8001
```

### 3. Run the Frontend Locally
```bash
cd frontend-ui
npm install
npm run dev
```
Navigate to `http://localhost:5173` (or the port specified by Vite) to view the application!

---

## 🔐 Security
- **Authentication:** Custom JWT-based authentication using `python-jose`. The `auth-service` generates signed tokens, and other microservices validate the signature using FastAPI's `HTTPBearer` dependency.
- **IAM Policies:** Granular AWS IAM roles restrict each Lambda function to only the exact DynamoDB tables or SQS queues it needs to access, following the Principle of Least Privilege.

---
*Architected and Built for the Cloud.* ☁️
