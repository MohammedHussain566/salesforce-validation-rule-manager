# Salesforce Validation Rule Manager

A full-stack Salesforce integration project built using React.js, Node.js, Express.js, Salesforce OAuth 2.0, Tooling API, and Metadata API.

This application allows users to:

- Login with Salesforce
- Fetch Validation Rules
- View Active / Inactive Status
- Enable Validation Rules
- Disable Validation Rules
- Deploy Changes Directly to Salesforce

---

# Features

## Salesforce OAuth Login
Secure authentication using Salesforce Connected App and OAuth 2.0.

## Fetch Validation Rules
Retrieve validation rules from Salesforce using Tooling API.

## Toggle Validation Rules
Enable or disable validation rules directly from the web application.

## Deploy Changes
Deploy validation rule updates directly to Salesforce using Metadata API.

---

# Tech Stack

## Frontend
- React.js
- Axios

## Backend
- Node.js
- Express.js
- JSForce

## Salesforce
- Connected App
- OAuth 2.0
- Tooling API
- Metadata API

---

# Project Structure

salesforce-validation-rule-manager/

├── frontend/

├── backend/

└── README.md

---

# Frontend Setup

Open terminal:

```bash
cd frontend
npm install
npm start

Frontend runs on:

http://localhost:3000


---

# STEP 7

Paste this:

```markdown id="rm7"
---

# Backend Setup

Open another terminal:

```bash
cd backend
npm install
node server.js

Backend runs on:

http://localhost:5000


---

# STEP 8

Paste this:

```markdown id="rm8"
---

# Salesforce Setup

## Create Salesforce Developer Org

https://developer.salesforce.com/signup

## Create Connected App

Enable OAuth settings and configure callback URL:

http://localhost:3000

## OAuth Scopes

Add:
- Full Access
- Access and manage your data (api)

---

#step 9

# Validation Rules Created

- Phone_Required
- Website_HTTPS
- AnnualRevenue_Not_Negative
- Account_Name_Min_Length
- Employees_Not_Negative

#step 10
---

# APIs Used

## Tooling API
Used to fetch validation rules.

## Metadata API
Used to enable and disable validation rules.

---

# Assignment Requirements Covered

- Salesforce Developer Org
- Connected App
- OAuth 2.0 Login
- Fetch Validation Rules
- Show Active / Inactive Status
- Enable / Disable Validation Rules
- Deploy Changes to Salesforce
- React Frontend
- Node.js Backend

---

# Author

Mohammed Hussain