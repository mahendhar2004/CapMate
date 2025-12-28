# CapMate - Microservices Mobile Application

CapMate is a mobile application for buying and selling items on college campuses, built with a robust microservice architecture on AWS.

## Architecture

- **Mobile App**: React Native (Expo).
- **Services**:
  - `auth`: User authentication (Cognito).
  - `listing`: Marketplace listings (PostgreSQL, S3).
  - `payment`: Payment processing (Razorpay, SQS).
  - `shared`: Common utilities and Prisma schema.
- **Infrastructure**: AWS App Runner, RDS (PostgreSQL), S3, ECR.

## Deployment

The project uses GitHub Actions for CI/CD. Pushing to the `main` branch triggers:
1.  Docker builds for each service.
2.  Push to Amazon ECR.
3.  Automatic deployment to AWS App Runner.

## Running Locally

1.  **Infrastructure**:
    ```bash
    cd infrastructure/terraform
    terraform apply
    ```

2.  **Mobile**:
    ```bash
    cd mobile
    npx expo start
    ```

3.  **Services**:
    See `package.json` in each service directory for start scripts.
