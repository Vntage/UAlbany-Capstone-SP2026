# Business Financial Monitoring and Insight System

A full-stack financial analytics platform that enables businesses to track transactions, generate financial reports, and build customizable rule-based alerts.

This system provides real-time financial insights including income statements, cash flow analysis, category breakdowns, and automated alerting for threshold and logic-based conditions.

## Features

### Financial Dashboard
- Real-time transaction tracking
- Business-level financial overview
- Category-based summaries

### Reporting Engine
- Income Statement generation
- Cash Flow Insights
- Expense breakdown reports
- Export reports to PDF
  
### Advanced Alert System
- Rule-based alert creation
- Threshold alerts (>, <, =, >=, <=)
- Nested expression support (Advanced mode)

## Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- React Router DOM

### Backend
- Node.js
- Express.js
- TypeScript
- Puppeteer (PDF report generation)
- REST API architecture

### Database
- PostgreSQL (or configured DB)
- Relational financial schema (users, businesses, transactions, categories)

## Getting Started
### Clone the repository

```bash
git clone

cd backend
npm install

npm run dev
...
cd frontend
npm install

npm run dev
```
## Backend .env file
```bash
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID

PORT=8080
PG_HOST=YOUR_DB_HOST
PG_USER=YOUR_DB_USER
PG_PASSWORD=YOUR_DB_PASSWORD
PG_DATABASE=YOUR_DB_NAME
PG_PORT=5432
```

## Backend Firebase-service-account.json file
```bash
{
  "type": "service_account",
  "project_id": "capstone-spring2026",
  "private_key_id": "REDACTED",
  "private_key": "REDACTED",
  "client_email": "REDACTED",
  "client_id": "REDACTED",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "REDACTED",
  "universe_domain": "googleapis.com"
}
```

## Frontend .env file
```bash
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

## ICSI499 Capstone Project UAlbany Spring 2026
This project was developed as part of a Senior Capstone Project at the University at Albany (SUNY). 

### Development Team
- Vincent Jiang
- Kevin Chen
- George Lee

### Capstone Sponsor
- Nishant Agarwal, META Platforms
